import { htmlResponse, renderPage } from '@/lib/shortlink/html'

// ============================================================================
// GET /delete — 用 Delete Token 刪除短網址（獨立 HTML，無追蹤）
// ============================================================================

export function GET() {
  const body = `
        <section class="sl-card">
          <h1 class="sl-title">刪除短網址</h1>
          <p class="sl-lead">輸入建立短網址時取得的 Delete Token。刪除後短網址會立即失效，無法復原。</p>

          <form id="delete-form" class="sl-form" novalidate>
            <label class="sl-label" for="token">Delete Token</label>
            <input class="sl-input sl-mono" id="token" name="token" type="text" autocomplete="off"
              spellcheck="false" placeholder="del_xxxxxxxxxxxxxxxx" required maxlength="100">
            <p id="form-error" class="sl-error" role="alert" hidden></p>
            <button class="sl-btn sl-btn-danger" id="submit" type="submit">刪除短網址</button>
          </form>

          <div id="done" class="sl-success" role="status" hidden>
            <p><strong>已刪除。</strong>短網址 <span id="deleted-code" class="sl-mono"></span> 已失效。</p>
          </div>
        </section>`

  return htmlResponse(
    renderPage({
      title: '刪除短網址',
      body,
      scripts: ['/shortlink/common.js', '/shortlink/delete.js'],
    })
  )
}
