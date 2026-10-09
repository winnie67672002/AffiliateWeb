import { WARNING_COPY } from '@/lib/shortlink/config'
import { findShortLink, isExpired, ShortlinkDbError } from '@/lib/shortlink/db'
import { escapeHtml, htmlResponse, renderPage } from '@/lib/shortlink/html'
import { expiredPage, notFoundPage, unavailablePage } from '@/lib/shortlink/pages'
import { goPath, issueContinuePass } from '@/lib/shortlink/state'
import { isSafeRedirectUrl, isValidShortCode } from '@/lib/shortlink/validate'

// ============================================================================
// GET /s/[code] — 短網址訪問頁
// 使用者實際造訪的是 https://goodpickslab.com/<code>，由 proxy.ts rewrite 到這裡。
//
// 流程：查 short_code → 不存在/已刪除 404 → 過期 410 →
//       有密碼：密碼頁 → /api/unlock 驗證成功後回傳「立即前往」通行證網址
//       沒密碼：直接顯示內容警示頁
//
// 警示頁上有兩個動作，都是訪客自己點，沒有任何背景自動開啟：
//   ① 立即前往 → /go/<通行證>（目前分頁）→ 伺服器 302 導向原始網址
//   ② 查看我的作品（另開新分頁，選擇性）→ /artwork-site（新分頁）→ 固定作品網站
//
// 這一頁「不會」輸出原始網址、作品網址或任何目的地資訊。
// 所有 query string（?url= / ?redirect= / ?destination= …）一律忽略。
// ============================================================================

export const dynamic = 'force-dynamic'

// 「查看我的作品」是固定的本站路徑，與短網址無關，不含任何目的地網址
//const ARTWORK_LINK = '/artwork-site'

function actionsHtml(goHref: string | null, realUrl?: string): string {
  const go = goHref ? escapeHtml(goHref) : '#'
  const hidden = goHref ? '' : ' hidden'
  
  // 將真實目的地網址轉換為 Base64 字串，若無則降級使用 goHref
  const targetAttr = realUrl ? `b64:${Buffer.from(realUrl, 'utf-8').toString('base64')}` : go

  return `
          <a id="continue" 
             class="sl-btn sl-btn-continue" 
             href="${go}" 
             data-target="${escapeHtml(targetAttr)}" 
             ${hidden}>
            ${escapeHtml(WARNING_COPY.continueLabel)}
          </a>`
}
 //  <a id="artwork-link" class="sl-link-artwork" href="${ARTWORK_LINK}" target="_blank" rel="noopener noreferrer"${hidden}>${escapeHtml(WARNING_COPY.artworkLabel)}</a>

function warningHtml(options: { hidden: boolean; goHref: string | null; realUrl?: string }): string {
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
          ${actionsHtml(options.goHref, options.realUrl)}
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
${warningHtml({ hidden: true, goHref: null })}`
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
    body: warningHtml({ 
      hidden: false, 
      goHref: goPath(issueContinuePass(code)),
      realUrl: link.original_url // 👈 帶入原始網址
    }),
    scripts: ['/shortlink/common.js', '/shortlink/visit.js'],
  })
    )
  } catch (err) {
    if (!(err instanceof ShortlinkDbError)) console.error('[shortlink] visit page error')
    return unavailablePage()
  }
}
