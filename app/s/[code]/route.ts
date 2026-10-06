import { WARNING_COPY } from '@/lib/shortlink/config'
import { findShortLink, isExpired, ShortlinkDbError } from '@/lib/shortlink/db'
import { escapeHtml, htmlResponse, renderPage } from '@/lib/shortlink/html'
import { expiredPage, notFoundPage, unavailablePage } from '@/lib/shortlink/pages'
import { continuePath, issueContinuePass } from '@/lib/shortlink/state'
import { isSafeRedirectUrl, isValidShortCode } from '@/lib/shortlink/validate'

// ============================================================================
// GET /s/[code] — 短網址訪問頁
// 使用者實際造訪的是 https://goodpickslab.com/<code>，由 proxy.ts rewrite 到這裡。
//
// 流程：查 short_code → 不存在/已刪除 404 → 過期 410 →
//       有密碼：密碼頁 → /api/unlock 驗證成功後回傳「繼續前往」通行證網址
//       沒密碼：直接顯示內容警示頁（通行證網址由伺服器在此產生）
//       → [繼續前往] 另開新分頁 → /artwork/<通行證> → 作品 → 自動跳轉原始網址
//
// 這一頁「不會」輸出原始網址、作品網址或任何目的地資訊。
// 所有 query string（?url= / ?redirect= / ?destination= …）一律忽略。
// ============================================================================

export const dynamic = 'force-dynamic'

/** 「繼續前往」：新分頁 + noopener noreferrer（防 reverse tabnabbing）。href 只會是本站 /artwork/<通行證>。 */
function continueLinkHtml(href: string | null): string {
  const hrefAttr = href ? escapeHtml(href) : '#'
  return `<a id="continue" class="sl-btn sl-btn-continue" href="${hrefAttr}" target="_blank" rel="noopener noreferrer"${href ? '' : ' hidden'}>${escapeHtml(WARNING_COPY.continueLabel)}</a>`
}

function warningHtml(options: { hidden: boolean; continueHref: string | null }): string {
  const question = WARNING_COPY.question.split('\n').map(escapeHtml).join('<br>')
  return `
        <section id="warning" class="sl-card sl-warning"${options.hidden ? ' hidden' : ''}>
          <div class="sl-warning-head">
            <span class="sl-dot" aria-hidden="true"></span>
            <h1 class="sl-title">${escapeHtml(WARNING_COPY.title)}</h1>
          </div>
          <ul class="sl-checks">
            <li><span class="sl-check" aria-hidden="true">✔</span>${escapeHtml(WARNING_COPY.check)}</li>
          </ul>
          <p class="sl-note">${escapeHtml(WARNING_COPY.note)}</p>
          <p class="sl-adult">${question}</p>
          ${continueLinkHtml(options.continueHref)}
        </section>`
}

export async function GET(_request: Request, { params }: { params: Promise<{ code: string }> }) {
  const { code } = await params
  if (!isValidShortCode(code)) return notFoundPage()

  try {
    const link = await findShortLink(code)
    if (!link) return notFoundPage()
    if (isExpired(link)) return expiredPage()

    if (link.password_hash) {
      const body = `
        <section id="password-step" class="sl-card sl-narrow">
          <h1 class="sl-title">Password Required</h1>
          <p class="sl-lead">此短網址需要密碼才能前往。</p>
          <form id="unlock-form" class="sl-form" novalidate>
            <label class="sl-label" for="password">Password</label>
            <input class="sl-input" id="password" name="password" type="password" autocomplete="off" required maxlength="128">
            <p id="form-error" class="sl-error" role="alert" hidden></p>
            <button class="sl-btn" id="submit" type="submit">Unlock</button>
          </form>
        </section>
${warningHtml({ hidden: true, continueHref: null })}`
      return htmlResponse(
        renderPage({
          title: 'Password Required',
          body,
          scripts: ['/shortlink/common.js', '/shortlink/visit.js'],
          data: { code, locked: true },
        })
      )
    }

    if (!isSafeRedirectUrl(link.original_url)) {
      console.error('[shortlink] stored url failed safety re-check')
      return notFoundPage()
    }

    return htmlResponse(
      renderPage({
        title: WARNING_COPY.title,
        body: warningHtml({ hidden: false, continueHref: continuePath(issueContinuePass(code)) }),
      })
    )
  } catch (err) {
    if (!(err instanceof ShortlinkDbError)) console.error('[shortlink] visit page error')
    return unavailablePage()
  }
}
