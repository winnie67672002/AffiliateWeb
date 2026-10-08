// ============================================================================
// 短網址 API 測試（Node 內建 test runner，不需要安裝任何套件）
//
// 用法：
//   1. 先啟動網站（npm run dev 或 npm run build && npm start），並設定好
//      SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY，資料庫已跑過 migration。
//   2. 另開終端機執行：
//        node --test tests/shortlink.api.test.mjs
//      測正式站：
//        SHORTLINK_TEST_BASE=https://goodpickslab.com node --test tests/shortlink.api.test.mjs
//
// 流程（這一版）：
//   /s/<code> 警示頁 →（有密碼先 /api/unlock）→ 訪客自己點：
//     ① 立即前往 → /go/<通行證> → 伺服器 302 導向原始網址（目前分頁）
//     ② 查看我的作品（另開新分頁，選擇性）→ /artwork-site → 302 固定作品網站
//   原始網址與作品網址都不顯示在頁面上，且無法被 query string 改變。
// ============================================================================

import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = (process.env.SHORTLINK_TEST_BASE || 'http://localhost:3000').replace(/\/$/, '')
const ARTWORK_URL = 'https://www.google.com/' // 需與 lib/shortlink/config.ts 的 ARTWORK_URL 一致
const RUN = Math.random().toString(36).slice(2, 8)
let ipCounter = 0
const IP_PREFIX = `10.${Math.floor(Math.random() * 250) + 1}.${Math.floor(Math.random() * 250) + 1}`
const nextIp = () => `${IP_PREFIX}.${(++ipCounter % 250) + 1}`

async function post(path, body, ip = nextIp(), extraHeaders = {}) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-forwarded-for': `${ip}`, ...extraHeaders },
    body: typeof body === 'string' ? body : JSON.stringify(body),
    redirect: 'manual',
  })
  let data = null
  try {
    data = await res.json()
  } catch {
    data = null
  }
  return { status: res.status, data, headers: res.headers }
}

async function get(path) {
  const res = await fetch(`${BASE}${path}`, { redirect: 'manual' })
  return { status: res.status, text: await res.text(), headers: res.headers, location: res.headers.get('location') }
}

const created = []
async function shorten(body) {
  const r = await post('/api/shorten', body)
  if (r.status === 201) created.push(r.data.deleteToken)
  return r
}

function extractData(html) {
  const m = html.match(/<script type="application\/json" id="sl-data">([\s\S]*?)<\/script>/)
  return m ? JSON.parse(m[1]) : null
}

/** 取出警示頁兩個動作連結的 href 與完整 tag */
function links(html) {
  const go = (html.match(/<a id="continue"[^>]*href="([^"]*)"/) || [])[1]
  const art = (html.match(/<a id="artwork-link"[^>]*href="([^"]*)"/) || [])[1]
  const goTag = (html.match(/<a id="continue"[^>]*>/) || [])[0] || ''
  const artTag = (html.match(/<a id="artwork-link"[^>]*>/) || [])[0] || ''
  return { go, art, goTag, artTag }
}

const GO_RE = /^\/go\/[A-Za-z0-9]{7}\.\d{10}\.[A-Za-z0-9_-]{43}$/

test('Test 1: 正常建立短網址（HTTPS）', async () => {
  const r = await shorten({ url: `https://example.com/some/very/long/url?run=${RUN}` })
  assert.equal(r.status, 201)
  assert.match(r.data.shortCode, /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{7}$/)
  assert.ok(r.data.shortUrl.endsWith(`/${r.data.shortCode}`))
  assert.match(r.data.deleteToken, /^del_[A-Za-z0-9_-]{43}$/)
  assert.equal(r.data.hasPassword, false)
  assert.equal((Date.parse(r.data.expiresAt) - Date.parse(r.data.createdAt)) / 86400000, 30)
  assert.equal(r.headers.get('cache-control'), 'no-store')
  assert.ok(!('passwordHash' in r.data) && !('password_hash' in r.data) && !('deleteTokenHash' in r.data))
})

test('無密碼：警示頁有立即前往(/go→原始網址) + 查看我的作品(/artwork-site→固定作品站)', async () => {
  const target = `https://example.com/no-password?run=${RUN}`
  const r = await shorten({ url: target })
  const page = await get(`/${r.data.shortCode}`)
  assert.equal(page.status, 200)

  for (const text of ['內容警示', '已通過網址格式檢查', '（本頁含推廣贊助）', '此網址可能包含成人內容', '您是否已年滿 18 歲？', '立即前往', '查看我的作品（另開新分頁）']) {
    assert.ok(page.text.includes(text), `警示頁應包含：${text}`)
  }
  assert.ok(!page.text.includes('未偵測到惡意程式'), '不可虛構安全掃描')
  // 警示頁不顯示原始網址、作品網址（google）、前端資料、倒數
  assert.ok(!page.text.includes('example.com'), '不可出現原始網址')
  assert.ok(!page.text.includes('google'), '不可出現作品網址')
  assert.ok(!/Redirecting|目的地/.test(page.text), '不可有自動跳轉/目的地')
  assert.equal(extractData(page.text), null, '警示頁不帶任何前端資料')

  const { go, art, goTag, artTag } = links(page.text)
  // 立即前往：同分頁（不是 _blank），指向本站 /go/<通行證>
  assert.match(go, GO_RE)
  assert.ok(!/target=/.test(goTag), '立即前往應在目前分頁')
  // 查看我的作品：固定本站路徑 /artwork-site，新分頁 + noopener noreferrer
  assert.equal(art, '/artwork-site')
  assert.match(artTag, /target="_blank"/)
  assert.match(artTag, /rel="noopener noreferrer"/)

  // ① 立即前往 → 302 → 原始網址
  const g = await get(go)
  assert.equal(g.status, 302)
  assert.equal(g.location, target)
  assert.equal(g.headers.get('referrer-policy'), 'no-referrer')

  // ② 查看我的作品 → 302 → 固定作品網站
  const a = await get('/artwork-site')
  assert.equal(a.status, 302)
  assert.equal(a.location, ARTWORK_URL)
  assert.equal(a.headers.get('referrer-policy'), 'no-referrer')

  assert.match(page.headers.get('content-security-policy'), /script-src 'self'/)
  assert.equal(page.headers.get('x-robots-tag'), 'noindex, nofollow')
})

test('有密碼：密碼頁 → 錯誤拒絕 → 正確取得 goUrl；作品連結為固定路徑', async () => {
  const target = `https://example.com/secret?run=${RUN}`
  const r = await shorten({ url: target, password: 'correct-horse' })
  assert.equal(r.data.hasPassword, true)

  const page = await get(`/${r.data.shortCode}`)
  assert.match(page.text, /Password Required/)
  assert.ok(!page.text.includes('example.com/secret'), '密碼頁不洩漏原始網址')
  assert.equal(extractData(page.text).locked, true)
  const l = links(page.text)
  assert.equal(l.go, '#')
  assert.equal(l.art, '/artwork-site') // 作品連結固定，不洩漏受保護連結資訊
  assert.ok(/ hidden/.test(l.goTag) && / hidden/.test(l.artTag))

  const ip = nextIp()
  const wrong = await post('/api/unlock', { code: r.data.shortCode, password: 'correct-horsf' }, ip)
  assert.equal(wrong.status, 401)
  assert.deepEqual(wrong.data, { error: 'Invalid password' })
  assert.equal(wrong.data.goUrl, undefined, '錯誤密碼不產生通行證')
  assert.equal((await post('/api/unlock', { code: r.data.shortCode, password: '' }, ip)).status, 401)

  const ok = await post('/api/unlock', { code: r.data.shortCode, password: 'correct-horse' }, ip)
  assert.equal(ok.status, 200)
  assert.deepEqual(Object.keys(ok.data), ['goUrl'], 'unlock 只回傳 goUrl')
  assert.ok(!JSON.stringify(ok.data).includes('example.com'), 'unlock 不回傳原始網址')
  assert.match(ok.data.goUrl, GO_RE)

  const g = await get(ok.data.goUrl)
  assert.equal(g.status, 302)
  assert.equal(g.location, target)

  // 偽造 / 竄改期限的通行證都進不去
  const [c, exp, sig] = ok.data.goUrl.replace('/go/', '').split('.')
  assert.equal((await get(`/go/${c}.${exp}.${'A'.repeat(43)}`)).status, 404)
  assert.equal((await get(`/go/${c}.${Number(exp) + 3600}.${sig}`)).status, 404, '改期限會讓簽章失效')
})

test('Test 6/7/8: Delete Token 錯誤被拒；正確則刪除；刪除後 /go 404 不跳轉', async () => {
  const r = await shorten({ url: `https://example.com/to-delete?run=${RUN}` })
  const code = r.data.shortCode
  const goBefore = links((await get(`/${code}`)).text).go

  const bad1 = await post('/api/delete', { token: 'del_wrong' })
  const bad2 = await post('/api/delete', { token: `del_${'A'.repeat(43)}` })
  const bad3 = await post('/api/delete', { token: r.data.deleteToken.slice(0, -1) + (r.data.deleteToken.endsWith('A') ? 'B' : 'A') })
  for (const bad of [bad1, bad2, bad3]) {
    assert.equal(bad.status, 404)
    assert.deepEqual(bad.data, { error: '無效的 Delete Token' })
  }
  assert.equal((await get(`/${code}`)).status, 200, '錯誤 token 不可刪除連結')

  const ok = await post('/api/delete', { token: r.data.deleteToken })
  assert.equal(ok.status, 200)
  assert.deepEqual(ok.data, { deleted: true, shortCode: code })

  assert.equal((await get(`/${code}`)).status, 404)
  // 刪除後，刪除前拿到的通行證也立即失效，不產生 302
  const goAfter = await get(goBefore)
  assert.equal(goAfter.status, 404)
  assert.equal(goAfter.location, null, '刪除後立即前往不可 302')

  assert.equal((await post('/api/delete', { token: r.data.deleteToken })).status, 404)
  assert.equal((await post('/api/unlock', { code, password: 'whatever' })).status, 404)
})

test('Test 9: 竄改成過去時間的通行證 → /go 404，不跳轉', async () => {
  const r = await shorten({ url: `https://example.com/exp?run=${RUN}` })
  const go = links((await get(`/${r.data.shortCode}`)).text).go
  const [c, , sig] = go.replace('/go/', '').split('.')
  const past = Math.floor(Date.now() / 1000) - 60
  const tampered = await get(`/go/${c}.${past}.${sig}`)
  assert.equal(tampered.status, 404)
  assert.equal(tampered.location, null)
})

test('Test 10/11: HTTP 與 HTTPS 都可建立', async () => {
  assert.equal((await shorten({ url: `http://example.com/plain-http?run=${RUN}` })).status, 201)
  assert.equal((await shorten({ url: `https://example.com/plain-https?run=${RUN}` })).status, 201)
})

test('Test 12: 危險 scheme 與可疑網址一律拒絕', async () => {
  const bad = [
    'javascript:alert(1)', 'JaVaScRiPt:alert(document.cookie)', ' javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>', 'vbscript:msgbox(1)', 'file:///etc/passwd',
    'ftp://example.com/x', '//example.com/protocol-relative', 'example.com',
    'https://user:pass@example.com/', 'https://example.com/\u0000x', 'https://exa mple.com/',
    'https://example.com/‮evil', `https://example.com/${'a'.repeat(2100)}`,
    'https://goodpickslab.com/Ab3xK9q', 'http://', '', 12345, null,
  ]
  for (const url of bad) {
    const r = await post('/api/shorten', { url })
    assert.equal(r.status, 400, `應拒絕：${String(url).slice(0, 60)}`)
    assert.equal(typeof r.data.error, 'string')
  }
})

test('Test 13: SQL injection 無效（參數化查詢）', async () => {
  const payload = `https://example.com/?q='OR'1'='1';DROP/**/TABLE/**/short_links;--&run=${RUN}`
  const r = await shorten({ url: payload })
  assert.equal(r.status, 201)
  const go = links((await get(`/${r.data.shortCode}`)).text).go
  assert.equal((await get(go)).location, new URL(payload).href, '原樣存入（正規化後），沒有被當成 SQL 執行')

  assert.equal((await post('/api/unlock', { code: "Ab3xK9q' OR '1'='1", password: 'x' })).status, 404)
  assert.equal((await post('/api/unlock', { code: r.data.shortCode, password: "' OR '1'='1" })).status, 400)
  assert.equal((await post('/api/delete', { token: "del_' OR '1'='1" })).status, 404)
  assert.equal((await get(`/s/${encodeURIComponent("A1' OR 1=1--")}`)).status, 404)
  assert.equal((await shorten({ url: `https://example.com/still-works?run=${RUN}` })).status, 201)
})

test('Test 14: XSS payload 不會變成 HTML', async () => {
  const xss = `https://example.com/"><script>alert(1)</script><svg/onload=alert(1)>'"?run=${RUN}`
  const r = await shorten({ url: xss })
  assert.equal(r.status, 201)
  const page = await get(`/${r.data.shortCode}`)
  assert.ok(!page.text.includes('<script>alert(1)</script>'))
  assert.ok(!page.text.includes('<svg/onload'))
  assert.ok(!page.text.includes('example.com/'), '原始網址不出現在警示頁 HTML')
  // 原始網址只透過 /go 的 302 Location 出現（已正規化、percent-encode）
  const loc = (await get(links(page.text).go)).location
  assert.ok(loc.startsWith('https://example.com/'))
  assert.ok(!loc.includes('<'))
})

test('Test 7/8: Open Redirect —— 任何 query string 都無法改變原始網址或作品網址', async () => {
  const target = `https://example.com/real-target?run=${RUN}`
  const r = await shorten({ url: target })
  const go = links((await get(`/${r.data.shortCode}`)).text).go
  const evil = 'https%3A%2F%2Fevil.example%2F'

  for (const q of ['url', 'redirect', 'destination', 'artwork']) {
    // /s/<code> 帶參數：連結仍指向本站，不含 evil
    for (const base of [`/${r.data.shortCode}`, `/s/${r.data.shortCode}`]) {
      const p = await get(`${base}?${q}=${evil}`)
      assert.ok(!p.text.includes('evil'), `${base}?${q}=`)
      assert.match(links(p.text).go, GO_RE)
      assert.equal(links(p.text).art, '/artwork-site')
    }
    // /go 帶參數：仍 302 到資料庫原始網址
    const g = await get(`${go}?${q}=${evil}`)
    assert.equal(g.status, 302)
    assert.equal(g.location, target, `/go?${q}= 不影響原始網址`)
    // /artwork-site 帶參數：仍 302 到固定作品網站
    const a = await get(`/artwork-site?${q}=${evil}`)
    assert.equal(a.status, 302)
    assert.equal(a.location, ARTWORK_URL, `/artwork-site?${q}= 不影響作品網址`)
  }

  // 偽造 / 亂填的 go 通行證
  for (const bad of ['x', 'Ab3xK9q', 'Ab3xK9q.9999999999.abc', 'a.b.c', 'https%3A%2F%2Fevil.example', `${r.data.shortCode}.9999999999.${'A'.repeat(43)}`]) {
    assert.equal((await get(`/go/${bad}`)).status, 404, `go/${bad}`)
  }
})

test('Test 15 (API 部分): shortUrl 指向本站短網址，不是原始網址', async () => {
  const r = await shorten({ url: `https://example.org/qr-target?run=${RUN}` })
  assert.ok(!r.data.shortUrl.includes('example.org'))
  assert.match(r.data.shortUrl, new RegExp(`/${r.data.shortCode}$`))
})

test('既有路由不會被短網址 proxy 攔截', async () => {
  for (const path of ['/', '/about', '/contact', '/blog', '/3c', '/mouse', '/terms', '/privacy-policy', '/robots.txt', '/sitemap.xml']) {
    const res = await get(path)
    assert.equal(res.status, 200, path)
    assert.ok(!res.text.includes('sl-shell'), `${path} 不應該是短網址頁`)
  }
  assert.equal((await get('/Zz9Zz9Z')).status, 404)
})

test('請求格式與跨站防護', async () => {
  assert.equal((await post('/api/shorten', 'not json')).status, 400)
  assert.equal((await post('/api/shorten', '[1,2]')).status, 400)
  assert.equal((await post('/api/shorten', { url: 'https://example.com/', pad: 'x'.repeat(9000) })).status, 413)
  assert.equal((await post('/api/shorten', { url: 'https://example.com/' }, nextIp(), { Origin: 'https://evil.example' })).status, 403)
  const res = await fetch(`${BASE}/api/shorten`, { method: 'POST', body: '{}', headers: { 'Content-Type': 'text/plain', 'x-forwarded-for': nextIp() } })
  assert.equal(res.status, 415)
})

test('Rate limit：同 IP 連續猜密碼 / 刪除 token 會被 429 擋下', async () => {
  const r = await shorten({ url: `https://example.com/rl?run=${RUN}`, password: 'rate-limit-pw' })
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`
  const statuses = []
  for (let i = 0; i < 12; i++) statuses.push((await post('/api/unlock', { code: r.data.shortCode, password: `guess-${i}` }, ip)).status)
  assert.deepEqual(statuses.slice(0, 10), Array(10).fill(401))
  assert.equal(statuses[10], 429)
  assert.equal((await post('/api/unlock', { code: r.data.shortCode, password: 'rate-limit-pw' }, ip)).status, 429)

  const delIp = `203.0.113.${Math.floor(Math.random() * 200) + 1}`
  const delStatuses = []
  for (let i = 0; i < 11; i++) delStatuses.push((await post('/api/delete', { token: `del_${'x'.repeat(43)}` }, delIp)).status)
  assert.equal(delStatuses[10], 429)
})

test('清理：刪除本次測試建立的短網址', async () => {
  for (const token of created) await post('/api/delete', { token })
})
