
// ============================================================================
// Supabase 存取層（PostgREST REST API）
//
// 沿用專案既有做法：不引入 @supabase/supabase-js，直接用 fetch 呼叫 REST API
// （與 app/api/go/route.ts 寫 clicks 表的方式一致）。
//
// 與既有 /api/go 不同的是：short_links 存有密碼雜湊與刪除 token 雜湊，
// 因此改用只存在 server 端的 SUPABASE_SERVICE_ROLE_KEY，資料表開啟 RLS 且
// 不給 anon 任何權限。這支檔案只會被 route handler（server 端）import，
// 環境變數沒有 NEXT_PUBLIC_ 前綴，不會被打包進瀏覽器端程式碼。
//
// SQL injection：所有查詢條件都透過 URLSearchParams 帶入 PostgREST，
// PostgREST 會轉成 parameterized query；程式中沒有任何字串拼接 SQL。
// 錯誤訊息只回傳通用字串，不把資料庫錯誤內容外洩給前端或寫入 log。
// ============================================================================

export class ShortlinkDbError extends Error {
  constructor(public readonly kind: 'not_configured' | 'conflict' | 'request_failed') {
    super(`shortlink db error: ${kind}`)
    this.name = 'ShortlinkDbError'
  }
}

interface DbConfig {
  restUrl: string
  serviceKey: string
}

function getDbConfig(): DbConfig {
  const url = process.env.SUPABASE_URL?.trim()
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  if (!url || !serviceKey) throw new ShortlinkDbError('not_configured')
  return { restUrl: `${url.replace(/\/$/, '')}/rest/v1`, serviceKey }
}

/** Rate limit 的 IP HMAC 也使用同一把 server-only secret，不另外新增環境變數。 */
export function getServerSecret(): string {
  return getDbConfig().serviceKey
}

async function request(path: string, init: RequestInit & { prefer?: string } = {}): Promise<Response> {
  const { restUrl, serviceKey } = getDbConfig()
  const headers: Record<string, string> = {
    apikey: serviceKey,
    Accept: 'application/json',
  }
  // Supabase 新版金鑰（sb_secret_...）不是 JWT，只能放在 apikey 標頭，
  // 放進 Authorization: Bearer 會被拒絕。舊版 JWT 格式（eyJ...，三段）才同時放 Bearer。
  if (serviceKey.split('.').length === 3) headers.Authorization = `Bearer ${serviceKey}`
  if (init.body !== undefined) headers['Content-Type'] = 'application/json'
  if (init.prefer) headers.Prefer = init.prefer

  try {
    return await fetch(`${restUrl}${path}`, { ...init, headers, cache: 'no-store' })
  } catch {
    throw new ShortlinkDbError('request_failed')
  }
}

export interface ShortLinkRow {
  short_code: string
  original_url: string
  password_hash: string | null
  created_at: string
  expires_at: string
}

/** 新增一筆短網址。short_code 撞到 unique index 時丟出 conflict，由呼叫端重抽。 */
export async function insertShortLink(input: {
  shortCode: string
  originalUrl: string
  passwordHash: string | null
  deleteTokenHash: string
}): Promise<{ shortCode: string; createdAt: string; expiresAt: string }> {
  const params = new URLSearchParams({ select: 'short_code,created_at,expires_at' })
  const res = await request(`/short_links?${params}`, {
    method: 'POST',
    prefer: 'return=representation',
    body: JSON.stringify({
      short_code: input.shortCode,
      original_url: input.originalUrl,
      password_hash: input.passwordHash,
      delete_token_hash: input.deleteTokenHash,
      // created_at / expires_at 不由應用程式提供，交給資料庫 now()
    }),
  })

  if (res.status === 409) throw new ShortlinkDbError('conflict')
  if (!res.ok) throw new ShortlinkDbError('request_failed')

  const rows = (await res.json()) as { short_code: string; created_at: string; expires_at: string }[]
  const row = rows[0]
  if (!row) throw new ShortlinkDbError('request_failed')
  return { shortCode: row.short_code, createdAt: row.created_at, expiresAt: row.expires_at }
}

export async function findShortLink(shortCode: string): Promise<ShortLinkRow | null> {
  const params = new URLSearchParams({
    select: 'short_code,original_url,password_hash,created_at,expires_at',
    short_code: `eq.${shortCode}`,
    limit: '1',
  })
  const res = await request(`/short_links?${params}`, { method: 'GET' })
  if (!res.ok) throw new ShortlinkDbError('request_failed')
  const rows = (await res.json()) as ShortLinkRow[]
  return rows[0] ?? null
}

/** 依 delete token 的雜湊刪除。回傳被刪除的 short_code；找不到回傳 null。 */
export async function deleteShortLinkByTokenHash(deleteTokenHash: string): Promise<string | null> {
  const params = new URLSearchParams({
    delete_token_hash: `eq.${deleteTokenHash}`,
    select: 'short_code',
  })
  const res = await request(`/short_links?${params}`, {
    method: 'DELETE',
    prefer: 'return=representation',
  })
  if (!res.ok) throw new ShortlinkDbError('request_failed')
  const rows = (await res.json()) as { short_code: string }[]
  return rows[0]?.short_code ?? null
}

/** 呼叫資料庫 rate limit 函式。回傳 true = 允許。 */
export async function rateLimitHit(bucketKey: string, windowSeconds: number, maxHits: number): Promise<boolean> {
  const res = await request('/rpc/short_link_rate_limit_hit', {
    method: 'POST',
    body: JSON.stringify({
      p_bucket_key: bucketKey,
      p_window_seconds: windowSeconds,
      p_max_hits: maxHits,
    }),
  })
  if (!res.ok) throw new ShortlinkDbError('request_failed')
  return (await res.json()) === true
}

/** 以資料庫/伺服器時間判斷是否過期（不信任瀏覽器時間）。 */
export function isExpired(row: Pick<ShortLinkRow, 'expires_at'>, now: number = Date.now()): boolean {
  const expiresAt = Date.parse(row.expires_at)
  return !Number.isFinite(expiresAt) || expiresAt <= now
}
