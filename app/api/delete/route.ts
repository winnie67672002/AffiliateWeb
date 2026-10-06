import { NextRequest } from 'next/server'
import { DELETE_TOKEN_PATTERN, RATE_LIMITS } from '@/lib/shortlink/config'
import { sha256Hex } from '@/lib/shortlink/crypto'
import { deleteShortLinkByTokenHash } from '@/lib/shortlink/db'
import {
  enforceRateLimits,
  errorResponse,
  ipBucket,
  isCrossOrigin,
  jsonResponse,
  readJsonBody,
  serverErrorResponse,
} from '@/lib/shortlink/http'

// ============================================================================
// POST /api/delete — 用 Delete Token 刪除短網址
// Body: { "token": "del_..." }
// - 只用 SHA-256(token) 查詢，token 明文不落地、不寫 log
// - 格式錯誤與查無此 token 回傳「完全相同」的訊息，不透露接近程度
// - 刪除為硬刪除（DELETE），短網址立即失效
// ============================================================================

const INVALID_TOKEN = '無效的 Delete Token'

export async function POST(request: NextRequest) {
  if (isCrossOrigin(request)) return errorResponse(403, '不允許的來源')

  try {
    const limited = await enforceRateLimits([{ key: ipBucket('delete', request), rule: RATE_LIMITS.deletePerIp }])
    if (limited) return limited

    const parsed = await readJsonBody(request)
    if (!parsed.ok) return parsed.response

    const token = typeof parsed.body.token === 'string' ? parsed.body.token.trim() : ''
    if (!DELETE_TOKEN_PATTERN.test(token)) return errorResponse(404, INVALID_TOKEN)

    const deletedCode = await deleteShortLinkByTokenHash(sha256Hex(token))
    if (!deletedCode) return errorResponse(404, INVALID_TOKEN)

    return jsonResponse({ deleted: true, shortCode: deletedCode })
  } catch (err) {
    return serverErrorResponse(err)
  }
}
