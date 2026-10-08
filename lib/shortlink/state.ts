import { createHmac, timingSafeEqual } from 'node:crypto'
import { CONTINUE_PASS_TTL_SECONDS } from './config'
import { getServerSecret } from './db'
import { isValidShortCode } from './validate'

// ============================================================================
// 「繼續前往」通行證（server-issued signed state）
//
// 格式：<short_code>.<expires_unix>.<HMAC-SHA256 簽章 base64url>
//
// - 只有伺服器能簽發（金鑰為 server-only 的 SUPABASE_SERVICE_ROLE_KEY）
// - 只綁定 short code，不含原始網址；作品頁會用 short code 重新查資料庫，
//   原始網址永遠從 Supabase 取得，不經過網址參數或前端
// - 有效期限短（預設 10 分鐘），過期需回到短網址重新開啟
// - 簽發時機：無密碼連結 → 警示頁產生時；有密碼連結 → /api/unlock 密碼正確後
// ============================================================================

function sign(payload: string): string {
  return createHmac('sha256', getServerSecret()).update(`shortlink-continue:${payload}`, 'utf8').digest('base64url')
}

export function issueContinuePass(shortCode: string, now: number = Date.now()): string {
  const expires = Math.floor(now / 1000) + CONTINUE_PASS_TTL_SECONDS
  const payload = `${shortCode}.${expires}`
  return `${payload}.${sign(payload)}`
}

export type PassResult = { ok: true; shortCode: string } | { ok: false; reason: 'invalid' | 'expired' }

export function verifyContinuePass(token: unknown, now: number = Date.now()): PassResult {
  if (typeof token !== 'string' || token.length > 120) return { ok: false, reason: 'invalid' }
  const parts = token.split('.')
  if (parts.length !== 3) return { ok: false, reason: 'invalid' }
  const [shortCode, expiresStr, signature] = parts
  if (!isValidShortCode(shortCode) || !/^\d{10}$/.test(expiresStr) || !/^[A-Za-z0-9_-]{43}$/.test(signature)) {
    return { ok: false, reason: 'invalid' }
  }

  const expected = Buffer.from(sign(`${shortCode}.${expiresStr}`), 'utf8')
  const actual = Buffer.from(signature, 'utf8')
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) {
    return { ok: false, reason: 'invalid' }
  }
  if (Number(expiresStr) * 1000 <= now) return { ok: false, reason: 'expired' }
  return { ok: true, shortCode }
}

/** 「立即前往」目的地：伺服器端 302 導向原始網址（/go/<通行證>），不把網址寫進頁面。 */
export function goPath(pass: string): string {
  return `/go/${encodeURIComponent(pass)}`
}
