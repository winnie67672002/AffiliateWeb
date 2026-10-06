import { NextRequest, NextResponse } from 'next/server'
import { MAX_BODY_BYTES } from './config'
import { hmacIp } from './crypto'
import { getServerSecret, rateLimitHit, ShortlinkDbError } from './db'

// ============================================================================
// 短網址 API 共用工具：JSON 回應、body 解析、同源檢查、rate limit
// ============================================================================

const API_HEADERS = {
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
}

export function jsonResponse(body: unknown, status = 200, extraHeaders: Record<string, string> = {}): NextResponse {
  return NextResponse.json(body, { status, headers: { ...API_HEADERS, ...extraHeaders } })
}

export function errorResponse(status: number, error: string, extraHeaders: Record<string, string> = {}): NextResponse {
  return jsonResponse({ error }, status, extraHeaders)
}

/** 通用的伺服器錯誤：不透露 SQL / 資料庫 / stack trace。 */
export function serverErrorResponse(err: unknown): NextResponse {
  if (err instanceof ShortlinkDbError && err.kind === 'not_configured') {
    // 只記錄「哪一類」錯誤，不記錄任何使用者輸入
    console.error('[shortlink] database is not configured (SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY)')
    return errorResponse(503, '服務暫時無法使用，請稍後再試')
  }
  console.error(`[shortlink] internal error: ${err instanceof Error ? err.name : 'unknown'}`)
  return errorResponse(500, '發生錯誤，請稍後再試')
}

/**
 * 同源檢查（簡易 CSRF 防護）：瀏覽器送出的跨站 POST 一定會帶 Origin，
 * 若帶了 Origin 但與本站 host 不同就拒絕。沒有 Origin（curl 等）時放行，
 * 交給 rate limit 處理。
 */
export function isCrossOrigin(request: NextRequest): boolean {
  const origin = request.headers.get('origin')
  if (!origin) return false
  try {
    const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host')
    return new URL(origin).host !== host
  } catch {
    return true
  }
}

export type ParsedBody = { ok: true; body: Record<string, unknown> } | { ok: false; response: NextResponse }

export async function readJsonBody(request: NextRequest): Promise<ParsedBody> {
  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().includes('application/json')) {
    return { ok: false, response: errorResponse(415, '請使用 application/json') }
  }
  const declared = Number(request.headers.get('content-length') ?? '0')
  if (declared > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse(413, '請求內容太大') }
  }

  let text: string
  try {
    text = await request.text()
  } catch {
    return { ok: false, response: errorResponse(400, '請求格式錯誤') }
  }
  if (Buffer.byteLength(text, 'utf8') > MAX_BODY_BYTES) {
    return { ok: false, response: errorResponse(413, '請求內容太大') }
  }

  try {
    const parsed: unknown = JSON.parse(text)
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return { ok: false, response: errorResponse(400, '請求格式錯誤') }
    }
    return { ok: true, body: parsed as Record<string, unknown> }
  } catch {
    return { ok: false, response: errorResponse(400, '請求格式錯誤') }
  }
}

/** Vercel 會覆寫 x-forwarded-for，第一個值即為真實來源 IP（與 /api/go 相同做法）。 */
export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) return forwardedFor.split(',')[0].trim() || 'unknown'
  return request.headers.get('x-real-ip')?.trim() || 'unknown'
}

export interface RateRule {
  windowSeconds: number
  maxHits: number
}

/** IP 以 HMAC 雜湊後才當成 bucket key，資料庫不存明文 IP。 */
export function ipBucket(action: string, request: NextRequest): string {
  return `${action}:ip:${hmacIp(getClientIp(request), getServerSecret())}`
}

/**
 * 依序檢查多個 bucket；任何一個超過就回傳 429。
 * 回傳 null 代表全部通過。
 */
export async function enforceRateLimits(buckets: { key: string; rule: RateRule }[]): Promise<NextResponse | null> {
  for (const { key, rule } of buckets) {
    const allowed = await rateLimitHit(key, rule.windowSeconds, rule.maxHits)
    if (!allowed) {
      return errorResponse(429, '嘗試次數過多，請稍後再試', { 'Retry-After': String(rule.windowSeconds) })
    }
  }
  return null
}
