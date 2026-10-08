// ============================================================================
// 短網址功能設定（集中管理，避免數值散落各處）
// ============================================================================

/** 正式網域。短網址與 QR Code 一律使用這個網域。 */
const DEFAULT_BASE_URL = 'https://goodpickslab.com'

/**
 * 短網址的網域。預設為正式網域；本機測試可以設定選用的環境變數
 * SHORTLINK_BASE_URL=http://localhost:3000 讓產生的短網址指向本機。
 */
export function getShortlinkBaseUrl(): string {
  const fromEnv = process.env.SHORTLINK_BASE_URL?.trim()
  if (fromEnv && /^https?:\/\/[^/\s]+$/i.test(fromEnv)) return fromEnv.replace(/\/$/, '')
  return DEFAULT_BASE_URL
}

/** Short code：7 碼 base62，且必須同時含大寫字母與數字（見 proxy.ts 說明）。 */
export const SHORT_CODE_LENGTH = 7
export const SHORT_CODE_ALPHABET =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
export const SHORT_CODE_PATTERN = /^(?=[A-Za-z0-9]*[A-Z])(?=[A-Za-z0-9]*[0-9])[A-Za-z0-9]{7}$/

/** 有效期限（天）。實際到期時間由資料庫 now() + interval '30 days' 決定。 */
export const LINK_TTL_DAYS = 30

/** 原始網址最大長度 */
export const MAX_URL_LENGTH = 2048

/** 密碼長度限制 */
export const PASSWORD_MIN_LENGTH = 4
export const PASSWORD_MAX_LENGTH = 128

/** Delete token 格式：del_ + 32 bytes base64url（43 字元） */
export const DELETE_TOKEN_PATTERN = /^del_[A-Za-z0-9_-]{43}$/

/** API request body 最大位元組數 */
export const MAX_BODY_BYTES = 8 * 1024

/**
 * Rate limit 規則（固定時間窗）。
 * - ip：同一個來源 IP（以 HMAC 雜湊表示）
 * - code：同一個短網址，不分來源（擋分散式猜密碼）
 */
export const RATE_LIMITS = {
  shortenPerIp: { windowSeconds: 10 * 60, maxHits: 10 },
  shortenPerIpDaily: { windowSeconds: 24 * 60 * 60, maxHits: 50 },
  unlockPerIp: { windowSeconds: 10 * 60, maxHits: 10 },
  unlockPerCode: { windowSeconds: 60 * 60, maxHits: 30 },
  deletePerIp: { windowSeconds: 10 * 60, maxHits: 10 },
} as const

/** 「立即前往」通行證有效秒數（警示頁 → 原始網址）。逾時需重新開啟短網址。 */
export const CONTINUE_PASS_TTL_SECONDS = 10 * 60

/**
 * 作品網站網址 —— server-side 固定常數，集中管理。
 * 目前用 Google 當測試網址，之後改成真正的作品網站只要改這一行。
 * 絕不接受使用者透過 query string（?url= / ?redirect= / ?destination= /
 * ?artwork=）修改；/artwork-site 只會導向這個固定值。
 */
const ARTWORK_URL = 'https://www.google.com/'

/** 取得作品網站網址（確認仍是 http/https，否則視為未設定）。 */
export function getArtworkUrl(): string | null {
  try {
    const u = new URL(ARTWORK_URL)
    return u.protocol === 'http:' || u.protocol === 'https:' ? u.href : null
  } catch {
    return null
  }
}

/**
 * 內容警示頁文字 —— 要改文案只改這裡，不需要動任何流程程式。
 * 內容會經過 HTML escape，請直接寫純文字（換行用 \n）。
 */
export const WARNING_COPY = {
  title: '內容警示',
  /** 只寫「實際存在」的檢查；本系統只有網址格式檢查，沒有惡意程式掃描 */
  check: '已通過網址格式檢查',
  note: '（本頁含推廣贊助）',
  question: '此網址可能包含成人內容，\n您是否已年滿 18 歲？',
  /** 主要動作：在目前分頁前往訪客原本要去的網址 */
  continueLabel: '立即前往',
  /** 選擇性：訪客自行決定要不要看作品，明確告知會另開新分頁到外部網站 */
  artworkLabel: '查看我的作品（另開新分頁）',
} as const

/** 短網址頁面共用頁尾文字 */
export const SHORTLINK_FOOTER_TEXT = '連結 30 天後自動失效'
