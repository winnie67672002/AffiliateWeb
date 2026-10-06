import {
  MAX_URL_LENGTH,
  PASSWORD_MAX_LENGTH,
  PASSWORD_MIN_LENGTH,
  SHORT_CODE_PATTERN,
} from './config'

export type UrlValidationResult = { ok: true; url: string } | { ok: false; error: string }

// 本站網域：禁止把「本站短網址」再縮一次，避免無限轉址迴圈
const OWN_HOSTS = new Set(['goodpickslab.com', 'www.goodpickslab.com'])

// 控制字元 / 空白 / 不可見字元（避免 header injection、視覺欺騙）
const FORBIDDEN_CHARS = /[\u0000-\u0020\u007f-\u009f\u00ad\u200b-\u200f\u2028-\u202e\u2060-\u206f\ufeff]/

/**
 * 驗證並正規化使用者輸入的原始網址。
 * - 只允許 http: / https:（javascript: data: vbscript: file: 等一律拒絕）
 * - 必須有 hostname，不允許 user:pass@host（常見釣魚偽裝手法）
 * - 不允許控制字元、空白、零寬字元
 * - 回傳 WHATWG URL 正規化後的 href，存進資料庫的就是這個值
 */
export function validateOriginalUrl(input: unknown): UrlValidationResult {
  if (typeof input !== 'string') return { ok: false, error: '請輸入網址' }
  const raw = input.trim()
  if (!raw) return { ok: false, error: '請輸入網址' }
  if (raw.length > MAX_URL_LENGTH) return { ok: false, error: `網址太長（上限 ${MAX_URL_LENGTH} 字元）` }
  if (FORBIDDEN_CHARS.test(raw)) return { ok: false, error: '網址含有不允許的字元' }

  // 先用字面檢查 scheme，避免 URL parser 對奇怪輸入做出意外的補完
  if (!/^https?:\/\//i.test(raw)) {
    return { ok: false, error: '只接受 http:// 或 https:// 開頭的網址' }
  }

  let url: URL
  try {
    url = new URL(raw)
  } catch {
    return { ok: false, error: '網址格式不正確' }
  }

  if (url.protocol !== 'http:' && url.protocol !== 'https:') {
    return { ok: false, error: '只接受 http:// 或 https:// 開頭的網址' }
  }
  if (!url.hostname) return { ok: false, error: '網址格式不正確' }
  if (url.username || url.password) {
    return { ok: false, error: '網址不可包含帳號或密碼（user:pass@）' }
  }

  const host = url.hostname.toLowerCase()
  if (OWN_HOSTS.has(host)) {
    const firstSegment = url.pathname.split('/')[1] ?? ''
    if (SHORT_CODE_PATTERN.test(firstSegment) || url.pathname.startsWith('/s/')) {
      return { ok: false, error: '不能縮短本站的短網址' }
    }
  }

  const href = url.href
  if (href.length > MAX_URL_LENGTH) return { ok: false, error: `網址太長（上限 ${MAX_URL_LENGTH} 字元）` }
  return { ok: true, url: href }
}

/** 第二道防線：redirect 前再確認一次（只信任 http/https）。 */
export function isSafeRedirectUrl(value: unknown): value is string {
  if (typeof value !== 'string' || value.length > MAX_URL_LENGTH) return false
  try {
    const url = new URL(value)
    return (url.protocol === 'http:' || url.protocol === 'https:') && !!url.hostname && !url.username && !url.password
  } catch {
    return false
  }
}

export type PasswordValidationResult =
  | { ok: true; password: string | null }
  | { ok: false; error: string }

/** 密碼為選填：空字串 / undefined / null 一律視為 null（不設密碼）。 */
export function validateOptionalPassword(input: unknown): PasswordValidationResult {
  if (input === undefined || input === null || input === '') return { ok: true, password: null }
  if (typeof input !== 'string') return { ok: false, error: '密碼格式不正確' }
  if (input.length < PASSWORD_MIN_LENGTH) {
    return { ok: false, error: `密碼至少 ${PASSWORD_MIN_LENGTH} 個字元` }
  }
  if (input.length > PASSWORD_MAX_LENGTH) {
    return { ok: false, error: `密碼最多 ${PASSWORD_MAX_LENGTH} 個字元` }
  }
  return { ok: true, password: input }
}

export function isValidShortCode(value: unknown): value is string {
  return typeof value === 'string' && SHORT_CODE_PATTERN.test(value)
}
