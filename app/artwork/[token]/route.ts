import { REDIRECT_COUNTDOWN_SECONDS } from '@/lib/shortlink/config'
import { findShortLink, isExpired, ShortlinkDbError } from '@/lib/shortlink/db'
import { htmlResponse, renderPage } from '@/lib/shortlink/html'
import { artworkHtml, expiredPage, notFoundPage, pickArtwork, statusPage, unavailablePage } from '@/lib/shortlink/pages'
import { verifyContinuePass } from '@/lib/shortlink/state'
import { isSafeRedirectUrl } from '@/lib/shortlink/validate'

// ============================================================================
// GET /artwork/[token] — 作品頁（由警示頁的「繼續前往」另開新分頁進入）
//
// 1. 驗證伺服器簽發的通行證（簽章 + 期限）→ 取得 short code
// 2. 用 short code 重新查 Supabase：不存在/已刪除 404、過期 410
//    （所以通行證簽發後才刪除或過期的連結，一樣會被擋下）
// 3. 顯示作品，倒數後 location.replace(資料庫中的 original_url)
//
// 不接受任何 query string 當目的地：?url= / ?redirect= / ?destination= /
// ?artwork= 全部忽略。原始網址只來自資料庫。
// ============================================================================

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const pass = verifyContinuePass(token)
  if (!pass.ok) {
    if (pass.reason === 'expired') {
      return statusPage(403, '連結已逾時', '請回到原本的短網址重新開啟。')
    }
    return notFoundPage()
  }

  try {
    const link = await findShortLink(pass.shortCode)
    if (!link) return notFoundPage()
    if (isExpired(link)) return expiredPage()
    if (!isSafeRedirectUrl(link.original_url)) {
      console.error('[shortlink] stored url failed safety re-check')
      return notFoundPage()
    }

    const body = `
        <section class="sl-card sl-warning">
          ${artworkHtml(pickArtwork())}
          <div class="sl-countdown" aria-live="polite">
            <p>Redirecting in <span id="countdown">${REDIRECT_COUNTDOWN_SECONDS}</span>...</p>
            <div class="sl-progress"><span id="progress-bar"></span></div>
          </div>
        </section>`

    return htmlResponse(
      renderPage({
        title: 'Artwork',
        body,
        scripts: ['/shortlink/common.js', '/shortlink/artwork.js'],
        data: { url: link.original_url, countdown: REDIRECT_COUNTDOWN_SECONDS },
      })
    )
  } catch (err) {
    if (!(err instanceof ShortlinkDbError)) console.error('[shortlink] artwork page error')
    return unavailablePage()
  }
}
