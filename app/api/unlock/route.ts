import { NextRequest } from 'next/server'
import { RATE_LIMITS } from '@/lib/shortlink/config'
import { verifyPassword } from '@/lib/shortlink/crypto'
import { findShortLink, isExpired } from '@/lib/shortlink/db'
import {
  enforceRateLimits,
  errorResponse,
  ipBucket,
  isCrossOrigin,
  jsonResponse,
  readJsonBody,
  serverErrorResponse,
} from '@/lib/shortlink/http'
import { goPath, issueContinuePass } from '@/lib/shortlink/state'
import { isSafeRedirectUrl, isValidShortCode } from '@/lib/shortlink/validate'
import { PASSWORD_MAX_LENGTH } from '@/lib/shortlink/config'

// ============================================================================
// POST /api/unlock — 驗證短網址密碼
// Body: { "code": "Ab3xK9q", "password": "..." }
// 密碼正確才回傳「立即前往」通行證網址（/go/<token>），不回傳原始網址；
// 錯誤一律回 "Invalid password"，不透露任何接近程度。
// Rate limit：同 IP 10 次 / 10 分鐘，同一短網址 30 次 / 小時（擋分散式猜測）。
// ============================================================================

const INVALID_PASSWORD = 'Invalid password'

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) return errorResponse(403, '不允許的來源')

  try {
    const parsed = await readJsonBody(request)
    if (!parsed.ok) return parsed.response

    const { code, password } = parsed.body
    if (!isValidShortCode(code)) return errorResponse(404, '連結不存在或已被刪除')

    const limited = await enforceRateLimits([
      { key: ipBucket('unlock', request), rule: RATE_LIMITS.unlockPerIp },
      { key: `unlock:code:${code}`, rule: RATE_LIMITS.unlockPerCode },
    ])
    if (limited) return limited

    if (typeof password !== 'string' || password.length === 0 || password.length > PASSWORD_MAX_LENGTH) {
      return errorResponse(401, INVALID_PASSWORD)
    }

    const link = await findShortLink(code)
    if (!link) return errorResponse(404, '連結不存在或已被刪除')
    if (isExpired(link)) return errorResponse(410, '連結已過期')
    if (!link.password_hash) {
      // 沒設密碼的連結不需要解鎖，直接走一般流程
      return errorResponse(400, '此連結不需要密碼')
    }

    const ok = await verifyPassword(password, link.password_hash)
    if (!ok) return errorResponse(401, INVALID_PASSWORD)

    if (!isSafeRedirectUrl(link.original_url)) {
      console.error('[shortlink] stored url failed safety re-check')
      return errorResponse(500, '發生錯誤，請稍後再試')
    }

    // 不把原始網址交給前端；只回傳「立即前往」通行證網址（綁定此 short code、短時效）。
    // 「查看我的作品」是固定的本站路徑 /artwork-site，與短網址無關，不需要通行證。
    return jsonResponse({ goUrl: goPath(issueContinuePass(code)),realUrl: link.original_url })
  } catch (err) {
    return serverErrorResponse(err)
  }
}
