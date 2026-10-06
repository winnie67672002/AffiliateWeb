import { NextRequest } from 'next/server'
import { getShortlinkBaseUrl, RATE_LIMITS } from '@/lib/shortlink/config'
import { generateDeleteToken, generateShortCode, hashPassword, sha256Hex } from '@/lib/shortlink/crypto'
import { insertShortLink, ShortlinkDbError } from '@/lib/shortlink/db'
import {
  enforceRateLimits,
  errorResponse,
  ipBucket,
  isCrossOrigin,
  jsonResponse,
  readJsonBody,
  serverErrorResponse,
} from '@/lib/shortlink/http'
import { validateOptionalPassword, validateOriginalUrl } from '@/lib/shortlink/validate'

// ============================================================================
// POST /api/shorten — 建立短網址
// Body: { "url": "https://...", "password": "選填" }
// 回應中的 deleteToken 只會出現這一次；資料庫只存它的 SHA-256。
// ============================================================================

const MAX_CODE_ATTEMPTS = 5

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) return errorResponse(403, '不允許的來源')

  try {
    const limited = await enforceRateLimits([
      { key: ipBucket('shorten', request), rule: RATE_LIMITS.shortenPerIp },
      { key: ipBucket('shorten-day', request), rule: RATE_LIMITS.shortenPerIpDaily },
    ])
    if (limited) return limited

    const parsed = await readJsonBody(request)
    if (!parsed.ok) return parsed.response

    const urlResult = validateOriginalUrl(parsed.body.url)
    if (!urlResult.ok) return errorResponse(400, urlResult.error)

    const passwordResult = validateOptionalPassword(parsed.body.password)
    if (!passwordResult.ok) return errorResponse(400, passwordResult.error)

    const passwordHash = passwordResult.password ? await hashPassword(passwordResult.password) : null
    const deleteToken = generateDeleteToken()
    const deleteTokenHash = sha256Hex(deleteToken)

    for (let attempt = 0; attempt < MAX_CODE_ATTEMPTS; attempt++) {
      try {
        const created = await insertShortLink({
          shortCode: generateShortCode(),
          originalUrl: urlResult.url,
          passwordHash,
          deleteTokenHash,
        })
        const shortUrl = `${getShortlinkBaseUrl()}/${created.shortCode}`
        return jsonResponse(
          {
            shortCode: created.shortCode,
            shortUrl,
            deleteToken,
            hasPassword: passwordHash !== null,
            createdAt: created.createdAt,
            expiresAt: created.expiresAt,
          },
          201
        )
      } catch (err) {
        // short_code 碰撞 → 重新產生；其他錯誤直接往外丟
        if (err instanceof ShortlinkDbError && err.kind === 'conflict') continue
        throw err
      }
    }
    console.error('[shortlink] could not allocate a unique short code')
    return errorResponse(500, '發生錯誤，請稍後再試')
  } catch (err) {
    return serverErrorResponse(err)
  }
}
