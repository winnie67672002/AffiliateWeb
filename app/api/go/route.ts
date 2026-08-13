import { NextRequest, NextResponse } from 'next/server'

// ============================================================================
// 反機器人／防護設定
// ============================================================================
//
// 已知的機器人／掃描器 UA 關鍵字（不分大小寫比對）。
// 刻意縮小範圍，只保留明確、不太可能誤判真人或一般 App 流量的關鍵字；
// 命中這裡只會被「標記」為可疑，不會被攔截（見下方 GET handler 說明）。
const BOT_UA_KEYWORDS = [
  'bot',
  'crawler',
  'spider',
  'virustotal',
  'appengine',
  'go-http-client',
]

function isBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return true // 沒有 UA 幾乎不可能是真人瀏覽器
  const ua = userAgent.toLowerCase()
  return BOT_UA_KEYWORDS.some((keyword) => ua.includes(keyword))
}

// 明確的 Hard Bot 關鍵字（不分大小寫比對）。與上面 BOT_UA_KEYWORDS 完全分開：
// 這裡只放「幾乎不可能是真人瀏覽器」的自動化工具／腳本／掃描器關鍵字，
// 命中就直接擋（見下方 GET handler），不會因為命中 BOT_UA_KEYWORDS 的
// bot/crawler/spider/facebookexternalhit 等較寬鬆的關鍵字就被升級成 Hard Bot。
const HARD_BOT_UA_KEYWORDS = [
  'go-http-client',
  'virustotal',
  'curl',
  'wget',
  'python-requests',
  'python-urllib',
  'aiohttp',
  'headlesschrome',
  'phantomjs',
  'selenium',
  'puppeteer',
  'playwright',
  'apache-httpclient',
  'stagefright',
]

function isHardBotUserAgent(userAgent: string | null): boolean {
  if (!userAgent) return false // 缺少 UA 不視為 Hard Bot，交由既有 suspected bot 標記處理
  const ua = userAgent.toLowerCase()
  return HARD_BOT_UA_KEYWORDS.some((keyword) => ua.includes(keyword))
}

// 已確認為異常流量的 zone 黑名單（依 2026-07-27 點擊報告分析：zone 6542888
// 單一 subid 在數小時內被多個互不相關、明顯偽造/輪替的 UA 重複打點擊，
// 其中包含 VirusTotal 掃描器與 Go-http-client，判定為代理農場／機器人流量）。
// 可透過環境變數 BLOCKED_ZONES（逗號分隔）疊加更多 zone，不需要改程式碼重新部署。
const DEFAULT_BLOCKED_ZONES = ['6542888', '11283975','9959951','9894439','11019169']

function getBlockedZones(): Set<string> {
  const fromEnv = process.env.BLOCKED_ZONES
  const extra = fromEnv
    ? fromEnv.split(',').map((z) => z.trim()).filter(Boolean)
    : []
  return new Set([...DEFAULT_BLOCKED_ZONES, ...extra])
}

// 從常見的反向代理 header 取出真實來源 IP（Vercel 會自帶 x-forwarded-for）
function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim()
  }
  return request.headers.get('x-real-ip')
}

// ============================================================================
// 短時間重複 Redirect 保護
// ============================================================================
//
// 目的不是偵測 Bot，而是避免同一個點擊在幾秒內被重複導向 Shopee，
// 降低短時間大量 redirect 造成 Shopee 風控的風險。
//
// 判斷 key 優先用 subid + ip；沒有 subid 時退回 ip + userAgent（不單獨用
// browser、也不單獨用 ip）。同一個 key 在 10 秒內已經成功 redirect 過，
// 就不再 302，改回傳 204 No Content；10 秒後自動恢復正常。
//
// 實作方式：process 記憶體內的 Map（key → 上次成功 redirect 的時間戳記），
// 不查詢資料庫、不額外呼叫 Supabase，純粹是這次 request 處理過程中的一次
// 記憶體讀寫，不會增加資料庫查詢次數。代價是：Serverless（如 Vercel）冷啟動
// 或多個實例並行時，各實例各自維護一份 Map，保護效果可能打折，但不會出錯。
const DUPLICATE_REDIRECT_WINDOW_MS = 10_000
// 避免長時間運行的 process 讓 Map 無限增長，成長到一定規模才觸發一次清理。
const DUPLICATE_REDIRECT_PRUNE_THRESHOLD = 2000

const recentRedirects = new Map<string, number>()

function getDuplicateRedirectKey(
  subid: string | null,
  ip: string | null,
  userAgent: string | null
): string {
  if (subid) {
    return `subid:${subid}|ip:${ip ?? ''}`
  }
  return `ip:${ip ?? ''}|ua:${userAgent ?? ''}`
}

function pruneExpiredRedirects(now: number): void {
  for (const [key, lastRedirectAt] of recentRedirects) {
    if (now - lastRedirectAt >= DUPLICATE_REDIRECT_WINDOW_MS) {
      recentRedirects.delete(key)
    }
  }
}

// 回傳 true 代表「這是 10 秒內的重複 redirect」。回傳 false（第一次請求）時，
// 會順帶把目前時間戳記記錄下來，作為接下來 10 秒的判斷基準。
function isDuplicateRedirect(key: string): boolean {
  const now = Date.now()

  if (recentRedirects.size > DUPLICATE_REDIRECT_PRUNE_THRESHOLD) {
    pruneExpiredRedirects(now)
  }

  const lastRedirectAt = recentRedirects.get(key)
  if (lastRedirectAt !== undefined && now - lastRedirectAt < DUPLICATE_REDIRECT_WINDOW_MS) {
    return true
  }

  recentRedirects.set(key, now)
  return false
}

// ============================================================================
// IP + Click ID pair 防重複 ＋ IP cooldown（process memory，僅供防刷判斷用）
// ============================================================================
//
// 目的：降低同一個 IP 在短時間內反覆進入 Shopee 的次數，避免機器人／異常流量
// 大量觸發 302。完全不查詢 Supabase 做防刷判斷、不引入 Redis / Vercel KV 等
// 外部服務，全部用 process 記憶體內的 Map 完成（Supabase 仍然只負責既有的
// click log，不參與這裡的防刷判斷）。
//
// 重要限制（刻意的 trade-off，不是 bug）：
// - 這些 Map 存在於單一 serverless process 的記憶體中，Vercel cold start 後
//   會被重置歸零；不同 serverless instance 之間也不會共享同一份 Map，因此
//   防護效果不是 100% 全域一致。即使如此也不查 Supabase、不增加外部服務，
//   也不會增加正常 request 的 DB 查詢次數。
//
// 規則摘要：
// 1. 同一個 IP + subid（Click ID）在 72 小時 TTL 內只允許成功 302 一次，
//    重複命中回 204（skip_reason = "ip_clickid_used"）。
// 2. 每個新 IP 前兩個「不同」subid 可以直接 302（不進 cooldown）；
//    第二個不同 subid 成功後開始 30 分鐘 IP cooldown。
// 3. Cooldown 期間所有 request 一律 204（skip_reason = "ip_cooldown"），
//    不更新 lastAllowedAt / successCount / cooldownMinutes。
// 4. 每次 cooldown 結束後，只允許一個「尚未成功過」的新 subid 成功 302，
//    成功後 cooldown 遞增 15 分鐘（30 → 45 → ... → 最高 180 分鐘）。
// 5. 距離上一次成功 302 太久（超過目前 cooldownMinutes 的 3 倍）時，視為
//    該 IP 長時間沒有活動，重置回「新 IP」狀態，避免永久懲罰。

const IP_CLICKID_TTL_MS = 72 * 60 * 60 * 1000 // 72 小時
const IP_CLICKID_PRUNE_THRESHOLD = 2000

const IP_COOLDOWN_START_MINUTES = 30
const IP_COOLDOWN_STEP_MINUTES = 15
const IP_COOLDOWN_MAX_MINUTES = 180
const IP_COOLDOWN_RESET_MULTIPLIER = 3
const IP_COOLDOWN_PRUNE_THRESHOLD = 2000

// key：`${ip}|${subid}`，value：上次成功 302 的時間戳記
const recentIpClickIds = new Map<string, number>()

interface IpCooldownState {
  lastAllowedAt: number
  cooldownMinutes: number
  successCount: number
  uniqueClickIdsUsed: number
}

// key：ip，value：該 IP 目前的 cooldown 狀態
const ipCooldowns = new Map<string, IpCooldownState>()

function getIpClickIdKey(ip: string | null, subid: string | null): string {
  return `${ip ?? ''}|${subid ?? ''}`
}

function pruneExpiredIpClickIds(now: number): void {
  for (const [key, lastSuccessAt] of recentIpClickIds) {
    if (now - lastSuccessAt >= IP_CLICKID_TTL_MS) {
      recentIpClickIds.delete(key)
    }
  }
}

// 回傳 true 代表這個 IP + subid pair 在 72 小時內已經成功 302 過一次。
function hasSuccessfulIpClickId(key: string, now: number): boolean {
  if (recentIpClickIds.size > IP_CLICKID_PRUNE_THRESHOLD) {
    pruneExpiredIpClickIds(now)
  }
  const lastSuccessAt = recentIpClickIds.get(key)
  return lastSuccessAt !== undefined && now - lastSuccessAt < IP_CLICKID_TTL_MS
}

// 判斷一筆 IP cooldown 狀態是否已經「久到可以視為新 IP」：
// - 已經進入 cooldown（cooldownMinutes > 0）：距離上次成功 302 超過
//   cooldownMinutes 的 IP_COOLDOWN_RESET_MULTIPLIER 倍，就重置（規格第十一節）。
// - 還沒進入 cooldown（只用掉第一個免費名額）：沿用跟 IP + Click ID 一樣的
//   72 小時上限，純粹是記憶體清理用，避免無限增長。
function isIpCooldownStale(state: IpCooldownState, now: number): boolean {
  if (state.cooldownMinutes > 0) {
    return now - state.lastAllowedAt > state.cooldownMinutes * IP_COOLDOWN_RESET_MULTIPLIER * 60_000
  }
  return now - state.lastAllowedAt > IP_CLICKID_TTL_MS
}

function pruneStaleIpCooldowns(now: number): void {
  for (const [key, state] of ipCooldowns) {
    if (isIpCooldownStale(state, now)) {
      ipCooldowns.delete(key)
    }
  }
}

// 取得目前 IP 的「有效」cooldown 狀態；如果太久沒有成功過，視為新 IP
// （見上方說明）。純粹讀取／視情況清理，不會寫入 ipCooldowns —— 寫入只發生
// 在真正放行 302 時（見 decideIpGate 呼叫端）。
function getEffectiveIpCooldownState(ipKey: string, now: number): IpCooldownState {
  if (ipCooldowns.size > IP_COOLDOWN_PRUNE_THRESHOLD) {
    pruneStaleIpCooldowns(now)
  }

  const existing = ipCooldowns.get(ipKey)
  if (!existing || isIpCooldownStale(existing, now)) {
    return { lastAllowedAt: 0, cooldownMinutes: 0, successCount: 0, uniqueClickIdsUsed: 0 }
  }
  return existing
}

type IpGateDecision =
  | { outcome: 'ip_clickid_used' }
  | { outcome: 'ip_cooldown' }
  | { outcome: 'success'; ipKey: string; ipClickIdKey: string; nextState: IpCooldownState }

// 純判斷、不寫入任何 Map。呼叫端只有在真的要放行 302 時，才把
// nextState / ipClickIdKey 寫回 recentIpClickIds / ipCooldowns（見 GET handler），
// 確保被擋掉的 request 不會誤消耗名額、不會誤更新 cooldown。
function decideIpGate(ip: string | null, subid: string | null, now: number): IpGateDecision {
  const ipKey = ip ?? ''
  const ipClickIdKey = getIpClickIdKey(ip, subid)

  // 同一個 IP + subid 在 72 小時內已經成功過，永遠不能再次成功
  // （即使 cooldown 已經結束也一樣，見規格第十節）。
  if (hasSuccessfulIpClickId(ipClickIdKey, now)) {
    return { outcome: 'ip_clickid_used' }
  }

  const state = getEffectiveIpCooldownState(ipKey, now)

  const inActiveCooldown =
    state.cooldownMinutes > 0 && now - state.lastAllowedAt < state.cooldownMinutes * 60_000

  if (inActiveCooldown) {
    return { outcome: 'ip_cooldown' }
  }

  const nextUniqueClickIdsUsed = state.uniqueClickIdsUsed + 1

  let nextCooldownMinutes: number
  if (nextUniqueClickIdsUsed <= 1) {
    // 這個 IP 的第一個不同 subid：先放行，還不開始 cooldown
    nextCooldownMinutes = 0
  } else if (nextUniqueClickIdsUsed === 2) {
    // 第二個不同 subid：放行，並開始 30 分鐘 cooldown
    nextCooldownMinutes = IP_COOLDOWN_START_MINUTES
  } else {
    // cooldown 結束後的每一次成功，cooldown 遞增 15 分鐘，最高 180 分鐘
    nextCooldownMinutes = Math.min(
      state.cooldownMinutes + IP_COOLDOWN_STEP_MINUTES,
      IP_COOLDOWN_MAX_MINUTES
    )
  }

  return {
    outcome: 'success',
    ipKey,
    ipClickIdKey,
    nextState: {
      lastAllowedAt: now,
      cooldownMinutes: nextCooldownMinutes,
      successCount: state.successCount + 1,
      uniqueClickIdsUsed: nextUniqueClickIdsUsed,
    },
  }
}

// ============================================================================
// Supabase 點擊紀錄（使用 anon key，透過 PostgREST REST API 寫入，
// 不引入 @supabase/supabase-js 依賴，避免修改 package.json 以外的檔案）
// ============================================================================
interface ClickLogData {
  zone: string | null
  subid: string | null
  browser: string | null
  campaign: string | null
  referer: string | null
  userAgent: string | null
  country: string | null
  device: string | null
  language: string | null
  os: string | null
  subzone_id: string | null
  user_activity: string | null
  ip: string | null
  isBlocked: boolean
  blockReason: string | null
  trackingKey: string | null
  trackingMatched: boolean | null
  redirected: boolean
  skipReason: string | null
}

async function insertClickRow(
  supabaseUrl: string,
  supabaseAnonKey: string,
  body: Record<string, unknown>
): Promise<Response> {
  return fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/clicks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: supabaseAnonKey,
      Authorization: `Bearer ${supabaseAnonKey}`,
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(body),
  })
}

async function logClickToSupabase(data: ClickLogData) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase click log skipped: SUPABASE_URL or SUPABASE_ANON_KEY is not configured')
    return
  }

  const baseFields = {
    zone: data.zone,
    subid: data.subid,
    browser: data.browser,
    campaign: data.campaign,
    referer: data.referer,
    user_agent: data.userAgent,
    country: data.country,
    device: data.device,
    language: data.language,
    os: data.os,
    subzone_id: data.subzone_id,
    user_activity: data.user_activity,
  }

  // 新增欄位（ip / is_blocked / block_reason / tracking_key / tracking_matched /
  // redirected / skip_reason）需要先在 Supabase 的 clicks 資料表加上對應欄位，
  // SQL 如下（在 Supabase SQL editor 執行一次即可）：
  //
  //   alter table clicks add column if not exists ip text;
  //   alter table clicks add column if not exists is_blocked boolean default false;
  //   alter table clicks add column if not exists block_reason text;
  //   alter table clicks add column if not exists tracking_key text;
  //   alter table clicks add column if not exists tracking_matched boolean;
  //   alter table clicks add column if not exists redirected boolean;
  //   alter table clicks add column if not exists skip_reason text;
  //
  // 在欄位尚未建立前，帶新欄位的 insert 會被 PostgREST 拒絕（unknown column），
  // 這裡會自動 fallback 成只寫入舊欄位，確保既有 log 行為不會被這次改動打斷。
  const extendedFields = {
    ...baseFields,
    ip: data.ip,
    is_blocked: data.isBlocked,
    block_reason: data.blockReason,
    tracking_key: data.trackingKey,
    tracking_matched: data.trackingMatched,
    redirected: data.redirected,
    skip_reason: data.skipReason,
  }

  try {
    let res = await insertClickRow(supabaseUrl, supabaseAnonKey, extendedFields)

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      // 42703 = undefined_column：代表 ip / is_blocked / block_reason 欄位還沒建立，
      // 自動退回只用舊欄位寫入，避免這次改動讓 log 完全失敗。
      if (res.status === 400 && /column|schema cache/i.test(text)) {
        res = await insertClickRow(supabaseUrl, supabaseAnonKey, baseFields)
        if (!res.ok) {
          const fallbackText = await res.text().catch(() => '')
          console.error(`Supabase click log failed (fallback): ${res.status} ${res.statusText} ${fallbackText}`)
        }
      } else {
        console.error(`Supabase click log failed: ${res.status} ${res.statusText} ${text}`)
      }
    }
  } catch (err) {
    console.error('Supabase click log failed:', err)
  }
}

// ============================================================================
// PropellerAds 流量追蹤 → 蝦皮聯盟導流 API
// GET /api/go?zone=<zone_id>&subid=<subid>&browser=<browser_version>&campaign=<可選>
//
// 目標網址固定由環境變數 SHOPEE_AFFILIATE_URL 提供，不接受外部傳入 url，
// 避免 open redirect 被濫用（影響 SEO 與網站信譽）。
// 這支 API 完全獨立於現有頁面/元件/路由，不修改任何既有檔案。
//
// 安全性設計：
// - 僅允許 https 目的地
// - 僅允許轉跳到白名單網域（防止環境變數設定錯誤導致轉跳到非預期網域）
//   白名單可透過環境變數 ALLOWED_REDIRECT_HOSTS（逗號分隔）覆寫/擴充
// - 標記已知機器人／掃描器 UA（block_reason = suspected_bot），但不攔截：
//   照常寫入 Supabase、照常 302 導轉，僅供後續分析用，避免誤判真人流量
// - 攔截黑名單 zone（可用環境變數 BLOCKED_ZONES 疊加），不導轉
// - 記錄來源 IP，供後續人工／腳本比對可疑流量
// - 支援自訂追蹤標籤 ?track=<key>，可對應到不同的蝦皮聯盟連結（見下方
//   TRACKING_LINKS_JSON 說明），找不到對應時退回原本的 SHOPEE_AFFILIATE_URL；
//   zone 本身仍然照舊記錄、照舊套用黑名單判斷，不受這個功能影響
// ============================================================================

const DEFAULT_ALLOWED_HOSTS = [
  'shopee.tw',
  'shp.ee',
  's.shopee.tw',
  'affiliate.shopee.tw',
  'shopee.com',
]

function getAllowedHosts(): string[] {
  const fromEnv = process.env.ALLOWED_REDIRECT_HOSTS
  if (!fromEnv) return DEFAULT_ALLOWED_HOSTS
  return fromEnv
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
}

function isAllowedHost(hostname: string, allowedHosts: string[]): boolean {
  return allowedHosts.some(
    (h) => hostname === h || hostname.endsWith(`.${h}`)
  )
}

// ============================================================================
// 自訂追蹤標籤（TRACKING_LINKS）→ 蝦皮聯盟連結對應
// ============================================================================
//
// 概念：不綁定特定變數（不是只給 zone 用），任何測試維度都可以當 key，
// 對應到一條「已經在蝦皮後台設定好專屬 Sub_id」的聯盟連結。可以拿來做
// zone 級歸因（例如 key 叫 zone_9895206），也可以拿來做其他 A/B 測試
// （例如 price_low / price_high / device_iphone），key 完全自訂。
//
// 設定方式：Vercel 環境變數 TRACKING_LINKS_JSON，內容是 JSON 物件字串，例如：
//   {"zone_9895206":"https://s.shopee.tw/aaa","price_low":"https://s.shopee.tw/bbb"}
//
// 使用方式：/api/go 網址加上 ?track=<key>，例如 /api/go?track=zone_9895206。
// 新增或調整對應關係只需要改這個環境變數（Vercel 後台），不需要改程式碼、
// 不需要重新部署。
//
// track 不存在、或找不到對應 key、或對應到的網址驗證失敗時，一律 fallback
// 回原本的 SHOPEE_AFFILIATE_URL，不會讓請求失敗。

function getTrackingLinks(): Record<string, string> {
  const raw = process.env.TRACKING_LINKS_JSON
  if (!raw) return {}

  try {
    const parsed = JSON.parse(raw)
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
      return parsed as Record<string, string>
    }
    console.error('TRACKING_LINKS_JSON is not a JSON object, ignoring')
    return {}
  } catch (err) {
    console.error('TRACKING_LINKS_JSON is not valid JSON, ignoring:', err)
    return {}
  }
}

// 驗證 tracking link 候選網址，套用跟 SHOPEE_AFFILIATE_URL 一樣的規則
// （必須是合法 URL、https、且落在白名單網域內）。驗證失敗回傳 null，
// 呼叫端會 fallback 回預設的 SHOPEE_AFFILIATE_URL。
function resolveTrackingDestination(
  urlStr: string,
  allowedHosts: string[]
): URL | null {
  let url: URL
  try {
    url = new URL(urlStr)
  } catch {
    return null
  }
  if (url.protocol !== 'https:') return null
  if (!isAllowedHost(url.hostname, allowedHosts)) return null
  return url
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const zone = searchParams.get('zone')
  const subid = searchParams.get('subid')
  const browser = searchParams.get('browser')
  const campaign = searchParams.get('campaign')
  const country = searchParams.get('country')
  const device = searchParams.get('device')
  const language = searchParams.get('language')
  const os = searchParams.get('os')
  const subzone_id = searchParams.get('subzone_id')
  const user_activity = searchParams.get('user_activity')
  const track = searchParams.get('track')

  const affiliateUrl = process.env.SHOPEE_AFFILIATE_URL
  if (!affiliateUrl) {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL is not configured' },
      { status: 500 }
    )
  }

  let destination: URL
  try {
    destination = new URL(affiliateUrl)
  } catch {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL is not a valid URL' },
      { status: 500 }
    )
  }

  if (destination.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL must use https' },
      { status: 500 }
    )
  }

  const allowedHosts = getAllowedHosts()
  if (!isAllowedHost(destination.hostname, allowedHosts)) {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL host is not in the allowed list' },
      { status: 500 }
    )
  }

  // ---- 自訂追蹤標籤：track 命中 TRACKING_LINKS_JSON 就換目的地 -----------
  // 找不到 key、JSON 沒設定、或對應到的網址驗證失敗，都直接沿用上面已經
  // 驗證過的預設 destination（SHOPEE_AFFILIATE_URL），不影響既有行為。
  //
  // trackingMatched 只用來記錄「這次是否真的換成 track 對應的連結」，
  // 不影響上面 destination 的判斷邏輯：
  //   - 沒有帶 track                → null
  //   - 有帶 track 且成功換到對應連結 → true
  //   - 有帶 track 但找不到 key，或對應網址驗證失敗 → false
  let trackingMatched: boolean | null = null
  if (track) {
    trackingMatched = false
    const trackingLinks = getTrackingLinks()
    const candidateUrlStr = trackingLinks[track]
    if (typeof candidateUrlStr === 'string') {
      const trackingDestination = resolveTrackingDestination(candidateUrlStr, allowedHosts)
      if (trackingDestination) {
        destination = trackingDestination
        trackingMatched = true
      } else {
        console.error(
          `TRACKING_LINKS_JSON["${track}"] failed URL/https/allowlist validation, falling back to SHOPEE_AFFILIATE_URL`
        )
      }
    }
  }

  const referer = request.headers.get('referer')
  const userAgent = request.headers.get('user-agent')
  const ip = getClientIp(request)

  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  // ---- 防護 1：機器人／掃描器 UA（僅標記，不攔截）------------------------
  // 命中關鍵字只會在寫入 Supabase 時標記 block_reason = "suspected_bot"，
  // is_blocked 仍為 false，不中斷流程、照常 302 導轉，供後續用 SQL 分析。
  const botDetected = isBotUserAgent(userAgent)

  // ---- 防護 2：zone 黑名單（維持攔截）-------------------------------------
  const blockedZones = getBlockedZones()
  const zoneBlocked = !!zone && blockedZones.has(zone)

  if (zoneBlocked) {
    const blockReason = 'blocked_zone'

    console.warn(
      JSON.stringify({
        event: 'redirect_blocked',
        reason: blockReason,
        zone,
        subid,
        ip,
        userAgent,
      })
    )

    // 保留一筆審計用的 log（is_blocked = true），方便之後統計「擋掉多少」，
    // 失敗也不影響回應（本來就要擋，不需要導轉）。
    if (supabaseUrl && supabaseAnonKey) {
      logClickToSupabase({
        zone,
        subid,
        browser,
        campaign,
        referer,
        userAgent,
        country,
        device,
        language,
        os,
        subzone_id,
        user_activity,
        ip,
        isBlocked: true,
        blockReason: blockReason,
        trackingKey: track,
        trackingMatched,
        redirected: false,
        skipReason: null,
      }).catch(() => {})
    }

    return NextResponse.json(
      { error: 'Request blocked' },
      { status: 403 }
    )
  }

  // ---- 防護 3：Hard Bot（明確判定為機器人／掃描器／自動化工具，直接擋）----
  // 與上面 isBotUserAgent()／BOT_UA_KEYWORDS 的「只標記、不攔截」邏輯完全
  // 分開判斷；只有命中 HARD_BOT_UA_KEYWORDS 才會走到這裡。命中後直接 204，
  // 不進入後面的 10 秒 duplicate／IP + Click ID pair／IP cooldown，
  // 不消耗 IP + Click ID 名額、不建立也不更新 IP cooldown、不更新 successCount。
  const hardBotDetected = isHardBotUserAgent(userAgent)

  if (hardBotDetected) {
    console.warn(
      JSON.stringify({
        event: 'redirect_blocked',
        reason: 'hard_bot',
        zone,
        subid,
        ip,
        userAgent,
      })
    )

    if (supabaseUrl && supabaseAnonKey) {
      logClickToSupabase({
        zone,
        subid,
        browser,
        campaign,
        referer,
        userAgent,
        country,
        device,
        language,
        os,
        subzone_id,
        user_activity,
        ip,
        isBlocked: true,
        blockReason: 'hard_bot',
        trackingKey: track,
        trackingMatched,
        redirected: false,
        skipReason: null,
      }).catch(() => {})
    }

    return new NextResponse(null, { status: 204 })
  }

  // ---- 防護 4：短時間重複 Redirect 保護（10 秒內同 key 不重複導轉，原邏輯不變）----
  const duplicateRedirectKey = getDuplicateRedirectKey(subid, ip, userAgent)
  const isDuplicate = isDuplicateRedirect(duplicateRedirectKey)

  // ---- 防護 5：IP + Click ID pair 防重複 ------------------------------------
  // ---- 防護 6：IP cooldown ---------------------------------------------------
  // 只有在「不是 10 秒內重複」時才需要判斷，避免同一次 request 重複消耗名額。
  // 所有狀態更新（recentIpClickIds / ipCooldowns）只發生在真正要放行 302 時，
  // 被擋掉的 request（duplicate / ip_clickid_used / ip_cooldown）完全不寫入。
  let redirected: boolean
  let skipReason: string | null

  if (isDuplicate) {
    redirected = false
    skipReason = 'duplicate_within_10s'
  } else {
    const now = Date.now()
    const gate = decideIpGate(ip, subid, now)

    if (gate.outcome === 'ip_clickid_used') {
      redirected = false
      skipReason = 'ip_clickid_used'
    } else if (gate.outcome === 'ip_cooldown') {
      redirected = false
      skipReason = 'ip_cooldown'
    } else {
      // 真正要放行 302 了，才把成功狀態寫回 Map（見上方各 Map 說明）
      recentIpClickIds.set(gate.ipClickIdKey, now)
      ipCooldowns.set(gate.ipKey, gate.nextState)
      redirected = true
      skipReason = null
    }
  }

  // 寫入 Supabase 點擊紀錄；成功或失敗都不能阻止 redirect（或 204）
  try {
    await logClickToSupabase({
      zone,
      subid,
      browser,
      campaign,
      referer,
      userAgent,
      country,
      device,
      language,
      os,
      subzone_id,
      user_activity,
      ip,
      isBlocked: false,
      blockReason: botDetected ? 'suspected_bot' : null,
      trackingKey: track,
      trackingMatched,
      redirected,
      skipReason,
    })
  } catch (err) {
    console.error('Unexpected error logging click to Supabase:', err)
  }

  if (!redirected) {
    return new NextResponse(null, { status: 204 })
  }

  return NextResponse.redirect(destination.toString(), { status: 302 })
}
