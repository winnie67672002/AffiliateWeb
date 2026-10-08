import { escapeHtml, htmlResponse, renderPage } from './html'

// ============================================================================
// 短網址頁面共用的狀態頁（404 / 410 / 503）
// ============================================================================

export function statusPage(status: 403 | 404 | 410, title: string, message: string): Response {
  const icon = status === 410 ? '⌛' : status === 403 ? '⏱' : '🔍'
  return htmlResponse(
    renderPage({
      title,
      body: `
        <section class="sl-card sl-center">
          <p class="sl-big-icon" aria-hidden="true">${icon}</p>
          <h1 class="sl-title">${escapeHtml(title)}</h1>
          <p class="sl-lead">${escapeHtml(message)}</p>
          <a class="sl-btn-ghost" href="/shorten">建立新的短網址</a>
        </section>`,
    }),
    status
  )
}

export function notFoundPage(): Response {
  return statusPage(404, 'Link Not Found', '連結不存在或已被刪除。')
}

export function expiredPage(): Response {
  return statusPage(410, 'Link Expired', '此短網址已超過 30 天有效期限，已失效。')
}

export function unavailablePage(): Response {
  return htmlResponse(
    renderPage({
      title: '暫時無法使用',
      body: `
        <section class="sl-card sl-center">
          <h1 class="sl-title">服務暫時無法使用</h1>
          <p class="sl-lead">請稍後再試一次。</p>
        </section>`,
    }),
    503
  )
}
