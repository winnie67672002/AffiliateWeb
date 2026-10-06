// ============================================================================
// 短網址 API 測試（Node 內建 test runner，不需要安裝任何套件）
//
// 用法：
//   1. 先啟動網站（npm run dev 或 npm run build && npm start），並設定好
//      SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY，資料庫已跑過 migration。
//   2. 另開終端機執行：
//        node --test tests/shortlink.api.test.mjs
//      測其他網址：
//        SHORTLINK_TEST_BASE=https://goodpickslab.com node --test tests/shortlink.api.test.mjs
//
// 注意：每次執行會建立數筆短網址並在最後刪除；rate limit 測試會讓同一 IP
// 暫時被擋 10 分鐘（本機測試時用 x-forwarded-for 模擬不同 IP；
// 在 Vercel 上 x-forwarded-for 會被平台覆寫，所以 rate limit 測試會用真實 IP）。
// ============================================================================

import { test } from 'node:test'
import assert from 'node:assert/strict'

const BASE = (process.env.SHORTLINK_TEST_BASE || 'http://localhost:3000').replace(/\/$/, '')
const RUN = Math.random().toString(36).slice(2, 8)
let ipCounter = 0
// 每次執行用不同的模擬 IP 區段，避免上一輪留下的 rate limit 計數影響這一輪
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
  return { status: res.status, text: await res.text(), headers: res.headers }
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

/** 警示頁「繼續前往」連結：回傳 { href, tag } */
function continueLink(html) {
  const m = html.match(/<a id="continue"[^>]*>/)
  if (!m) return null
  const href = (m[0].match(/href="([^"]*)"/) || [])[1]
  return { href, tag: m[0] }
}

/** 無密碼：短網址 → 警示頁 → 作品頁，回傳作品頁 data.url（原始網址） */
async function followToArtwork(shortCode) {
  const warning = await get(`/${shortCode}`)
  const link = continueLink(warning.text)
  const artwork = await get(link.href)
  return { warning, link, artwork, data: extractData(artwork.text) }
}

test('Test 1/11: 正常建立短網址（HTTPS）', async () => {
  const r = await shorten({ url: `https://example.com/some/very/long/url?run=${RUN}` })
  assert.equal(r.status, 201)
  assert.match(r.data.shortCode, /^(?=.*[A-Z])(?=.*[0-9])[A-Za-z0-9]{7}$/)
  assert.ok(r.data.shortUrl.endsWith(`/${r.data.shortCode}`))
  assert.match(r.data.deleteToken, /^del_[A-Za-z0-9_-]{43}$/)
  assert.equal(r.data.hasPassword, false)
  const days = (Date.parse(r.data.expiresAt) - Date.parse(r.data.createdAt)) / 86400000
  assert.equal(days, 30)
  assert.equal(r.headers.get('cache-control'), 'no-store')
  // 回應中不得出現任何 hash 欄位
  assert.ok(!('passwordHash' in r.data) && !('password_hash' in r.data) && !('deleteTokenHash' in r.data))
})

test('Test 1(v2)/10: 無密碼 → 警示頁（只有繼續前往）→ 作品頁 → 原始網址', async () => {
  const target = `https://example.com/no-password?run=${RUN}`
  const r = await shorten({ url: target })
  const { warning, link, artwork, data } = await followToArtwork(r.data.shortCode)

  // 警示頁
  assert.equal(warning.status, 200)
  for (const text of ['內容警示', '已通過網址格式檢查', '（本頁含推廣贊助）', '此網址可能包含成人內容', '您是否已年滿 18 歲？', '繼續前往']) {
    assert.ok(warning.text.includes(text), `警示頁應包含：${text}`)
  }
  assert.ok(!warning.text.includes('未偵測到惡意程式'), '不可虛構安全掃描')
  assert.ok(!warning.text.includes('id="unlock-form"'))
  // Test 10：警示頁沒有原始網址 / 目的地 / 作品網址 / 作品連結 / 倒數
  assert.ok(!warning.text.includes('example.com'), '警示頁不可出現原始網址')
  assert.ok(!/artworks\/|<img|sl-art|Redirecting|目的地|查看畫作/.test(warning.text), '警示頁不可出現作品或目的地')
  assert.equal(extractData(warning.text), null, '警示頁不帶任何前端資料')
  assert.equal((warning.text.match(/<a /g) || []).length, 2, '只有品牌連結＋繼續前往')
  // Test 11：新分頁 + noopener noreferrer，href 只指向本站作品頁
  assert.match(link.tag, /target="_blank"/)
  assert.match(link.tag, /rel="noopener noreferrer"/)
  assert.match(link.href, /^\/artwork\/[A-Za-z0-9]{7}\.\d{10}\.[A-Za-z0-9_-]{43}$/)

  // 作品頁
  assert.equal(artwork.status, 200)
  assert.match(artwork.text, /class="sl-art"/)
  assert.match(artwork.text, /Redirecting in/)
  assert.equal(data.url, target, '作品頁的跳轉目標 = 資料庫中的原始網址')
  for (const page of [warning, artwork]) {
    assert.match(page.headers.get('content-security-policy'), /script-src 'self'/)
    assert.equal(page.headers.get('x-robots-tag'), 'noindex, nofollow')
  }
})

test('Test 3/4/5: 有密碼 → 密碼頁；錯誤密碼拒絕；正確密碼取得網址', async () => {
  const target = `https://example.com/secret?run=${RUN}`
  const r = await shorten({ url: target, password: 'correct-horse' })
  assert.equal(r.status, 201)
  assert.equal(r.data.hasPassword, true)

  const page = await get(`/${r.data.shortCode}`)
  assert.equal(page.status, 200)
  assert.match(page.text, /Password Required/)
  assert.ok(!page.text.includes(target), '密碼頁不可洩漏原始網址')
  assert.ok(!page.text.includes('example.com/secret'))
  const data = extractData(page.text)
  assert.equal(data.locked, true)
  assert.equal(data.url, undefined)

  const ip = nextIp()
  const wrong = await post('/api/unlock', { code: r.data.shortCode, password: 'correct-horsf' }, ip)
  assert.equal(wrong.status, 401)
  assert.deepEqual(wrong.data, { error: 'Invalid password' })

  const empty = await post('/api/unlock', { code: r.data.shortCode, password: '' }, ip)
  assert.equal(empty.status, 401)
  assert.deepEqual(empty.data, { error: 'Invalid password' })

  const ok = await post('/api/unlock', { code: r.data.shortCode, password: 'correct-horse' }, ip)
  assert.equal(ok.status, 200)
  assert.deepEqual(Object.keys(ok.data), ['continueUrl'], 'unlock 不回傳原始網址')
  assert.ok(!JSON.stringify(ok.data).includes('example.com'))
  assert.match(ok.data.continueUrl, /^\/artwork\//)

  // 密碼頁上的「繼續前往」預設隱藏且沒有 href
  const hidden = continueLink(page.text)
  assert.equal(hidden.href, '#')
  assert.match(hidden.tag, / hidden/)

  const artwork = await get(ok.data.continueUrl)
  assert.equal(artwork.status, 200)
  assert.equal(extractData(artwork.text).url, target)

  // Test 3：錯誤密碼拿不到通行證；偽造通行證進不了作品頁
  assert.equal(wrong.data.continueUrl, undefined)
  const [c, exp] = ok.data.continueUrl.replace('/artwork/', '').split('.')
  assert.equal((await get(`/artwork/${c}.${exp}.${'A'.repeat(43)}`)).status, 404)
  assert.equal((await get(`/artwork/${c}.${Number(exp) + 3600}.${ok.data.continueUrl.split('.')[2]}`)).status, 404, '改期限會讓簽章失效')
})

test('Test 6/7/8: Delete Token 錯誤被拒；正確則刪除；刪除後 404', async () => {
  const r = await shorten({ url: `https://example.com/to-delete?run=${RUN}` })
  const code = r.data.shortCode
  // 刪除前先拿到一張有效通行證，驗證刪除後通行證也立即失效
  const passBeforeDelete = continueLink((await get(`/${code}`)).text).href

  // 錯誤 token：格式錯誤與「格式正確但不存在」回應必須完全相同
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

  const after = await get(`/${code}`)
  assert.equal(after.status, 404)
  assert.match(after.text, /Link Not Found/)
  assert.ok(!after.text.includes('example.com/to-delete'))

  const artworkAfter = await get(passBeforeDelete)
  assert.equal(artworkAfter.status, 404, 'Test 5：已刪除 → 作品頁也 404，不可跳轉')
  assert.equal(extractData(artworkAfter.text), null)

  const again = await post('/api/delete', { token: r.data.deleteToken })
  assert.equal(again.status, 404)
  const unlockAfter = await post('/api/unlock', { code, password: 'whatever' })
  assert.equal(unlockAfter.status, 404)
})

test('Test 10: HTTP URL 可以建立', async () => {
  const r = await shorten({ url: `http://example.com/plain-http?run=${RUN}` })
  assert.equal(r.status, 201)
})

test('Test 12: 危險 scheme 與可疑網址一律拒絕', async () => {
  const bad = [
    'javascript:alert(1)',
    'JaVaScRiPt:alert(document.cookie)',
    ' javascript:alert(1)',
    'data:text/html,<script>alert(1)</script>',
    'vbscript:msgbox(1)',
    'file:///etc/passwd',
    'ftp://example.com/x',
    '//example.com/protocol-relative',
    'example.com',
    'https://user:pass@example.com/',
    'https://example.com/\u0000x',
    'https://exa mple.com/',
    'https://example.com/\u202eevil',
    `https://example.com/${'a'.repeat(2100)}`,
    'https://goodpickslab.com/Ab3xK9q',
    'http://',
    '',
    12345,
    null,
  ]
  for (const url of bad) {
    const r = await post('/api/shorten', { url })
    assert.equal(r.status, 400, `應拒絕：${String(url).slice(0, 60)}`)
    assert.equal(typeof r.data.error, 'string')
  }
})

test('Test 13: SQL injection 無效（參數化查詢）', async () => {
  // 原始空白會被 URL 驗證拒絕，所以用 SQL 註解 /**/ 代替空白
  const payload = `https://example.com/?q='OR'1'='1';DROP/**/TABLE/**/short_links;--&run=${RUN}`
  const r = await shorten({ url: payload })
  assert.equal(r.status, 201)
  const { data } = await followToArtwork(r.data.shortCode)
  assert.equal(data.url, new URL(payload).href, '原樣存入（URL 正規化後），沒有被當成 SQL 執行')

  // 在 code / token / password 欄位注入
  assert.equal((await post('/api/unlock', { code: "Ab3xK9q' OR '1'='1", password: 'x' })).status, 404)
  assert.equal((await post('/api/unlock', { code: r.data.shortCode, password: "' OR '1'='1" })).status, 400)
  assert.equal((await post('/api/delete', { token: "del_' OR '1'='1" })).status, 404)
  assert.equal((await get(`/s/${encodeURIComponent("A1' OR 1=1--")}`)).status, 404)

  // 資料表仍在、功能正常
  const again = await shorten({ url: `https://example.com/still-works?run=${RUN}` })
  assert.equal(again.status, 201)
})

test('Test 14: XSS payload 不會變成 HTML', async () => {
  const xss = `https://example.com/"><script>alert(1)</script><svg/onload=alert(1)>'"?run=${RUN}`
  const r = await shorten({ url: xss })
  assert.equal(r.status, 201)
  const { warning, artwork, data } = await followToArtwork(r.data.shortCode)
  for (const page of [warning, artwork]) {
    assert.ok(!page.text.includes('<script>alert(1)</script>'))
    assert.ok(!page.text.includes('<svg/onload'))
  }
  assert.ok(data.url.startsWith('https://example.com/'))
  assert.ok(!data.url.includes('<'), 'URL 正規化後 < > " 都被 percent-encode')

  // 原始網址只出現在作品頁的 JSON data block（且已轉義），不出現在 HTML 本文
  const withoutData = artwork.text.replace(/<script type="application\/json" id="sl-data">[\s\S]*?<\/script>/, '')
  assert.ok(!withoutData.includes('example.com/'))
  assert.ok(!warning.text.includes('example.com/'))
})

test('Test 8/9: Open Redirect —— query string 無法改變目的地', async () => {
  const target = `https://example.com/real-target?run=${RUN}`
  const r = await shorten({ url: target })
  const evil = 'https%3A%2F%2Fevil.example%2F'
  // Test 9：/<code>、/s/<code> 帶參數
  for (const q of ['url', 'redirect', 'destination', 'artwork']) {
    for (const base of [`/${r.data.shortCode}`, `/s/${r.data.shortCode}`]) {
      const page = await get(`${base}?${q}=${evil}`)
      assert.equal(page.status, 200)
      assert.ok(!page.text.includes('evil.example'), `${base}?${q}=`)
      const href = continueLink(page.text).href
      assert.match(href, /^\/artwork\/[A-Za-z0-9._-]+$/)
      assert.ok(!href.includes('evil'))
    }
  }
  // Test 8：/artwork 帶參數
  const href = continueLink((await get(`/${r.data.shortCode}`)).text).href
  for (const q of ['url', 'redirect', 'destination', 'artwork']) {
    const page = await get(`${href}?${q}=${evil}`)
    assert.equal(page.status, 200)
    assert.equal(extractData(page.text).url, target, `artwork?${q}= 不影響目的地`)
    assert.ok(!page.text.includes('evil.example'))
    for (const bare of [`/artwork?${q}=${evil}`, `/artwork/?${q}=${evil}`]) {
      const res = await get(bare)
      // 沒有通行證的 /artwork 會落到網站既有的「找不到頁面」（既有行為），重點是絕不跳轉
      // 唯一可能的跳轉是 Next.js 內建的「去掉結尾斜線」（同站 308），不可能跳到外站
      const loc = res.headers.get('location')
      if (loc) assert.equal(new URL(loc, BASE).origin, new URL(BASE).origin, `${bare} → ${loc}`)
      assert.ok(!res.text.includes('sl-art'), `${bare} 不可顯示作品頁`)
      assert.ok(!res.text.includes('sl-data'), '不會產生任何跳轉資料')
    }
  }
  // 亂填的通行證
  for (const bad of ['x', 'Ab3xK9q', 'Ab3xK9q.9999999999.abc', 'a.b.c', `https%3A%2F%2Fevil.example`, `${r.data.shortCode}.9999999999.${'A'.repeat(43)}`]) {
    assert.equal((await get(`/artwork/${bad}`)).status, 404, bad)
  }
})

test('Test 15 (API 部分): shortUrl 指向本站短網址，不是原始網址', async () => {
  const target = `https://example.org/qr-target?run=${RUN}`
  const r = await shorten({ url: target })
  assert.ok(!r.data.shortUrl.includes('example.org'))
  assert.match(r.data.shortUrl, new RegExp(`/${r.data.shortCode}$`))
})

test('既有路由不會被短網址 proxy 攔截', async () => {
  for (const path of ['/', '/about', '/contact', '/blog', '/3c', '/mouse', '/terms', '/privacy-policy', '/robots.txt', '/sitemap.xml']) {
    const res = await get(path)
    assert.equal(res.status, 200, path)
    assert.ok(!res.text.includes('sl-shell'), `${path} 不應該是短網址頁`)
  }
  // 不存在的 7 碼代碼 → 404 短網址頁
  const missing = await get('/Zz9Zz9Z')
  assert.equal(missing.status, 404)
})

test('請求格式與跨站防護', async () => {
  assert.equal((await post('/api/shorten', 'not json')).status, 400)
  assert.equal((await post('/api/shorten', '[1,2]')).status, 400)
  const big = await post('/api/shorten', { url: 'https://example.com/', pad: 'x'.repeat(9000) })
  assert.equal(big.status, 413)
  const cross = await post('/api/shorten', { url: 'https://example.com/' }, nextIp(), { Origin: 'https://evil.example' })
  assert.equal(cross.status, 403)
  const res = await fetch(`${BASE}/api/shorten`, { method: 'POST', body: '{}', headers: { 'Content-Type': 'text/plain', 'x-forwarded-for': nextIp() } })
  assert.equal(res.status, 415)
})

test('Rate limit：同 IP 連續猜密碼 / 刪除 token 會被 429 擋下', async () => {
  const r = await shorten({ url: `https://example.com/rl?run=${RUN}`, password: 'rate-limit-pw' })
  const ip = `203.0.113.${Math.floor(Math.random() * 200) + 1}`
  const statuses = []
  for (let i = 0; i < 12; i++) {
    statuses.push((await post('/api/unlock', { code: r.data.shortCode, password: `guess-${i}` }, ip)).status)
  }
  assert.deepEqual(statuses.slice(0, 10), Array(10).fill(401))
  assert.equal(statuses[10], 429)
  // 被擋期間即使密碼正確也不放行
  assert.equal((await post('/api/unlock', { code: r.data.shortCode, password: 'rate-limit-pw' }, ip)).status, 429)

  const delIp = `203.0.113.${Math.floor(Math.random() * 200) + 1}`
  const delStatuses = []
  for (let i = 0; i < 11; i++) delStatuses.push((await post('/api/delete', { token: `del_${'x'.repeat(43)}` }, delIp)).status)
  assert.equal(delStatuses[10], 429)
})

test('清理：刪除本次測試建立的短網址', async () => {
  for (const token of created) await post('/api/delete', { token })
})
