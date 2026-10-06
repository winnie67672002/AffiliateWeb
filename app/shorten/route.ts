import { htmlResponse, renderPage } from '@/lib/shortlink/html'
import { LINK_TTL_DAYS, PASSWORD_MAX_LENGTH, PASSWORD_MIN_LENGTH } from '@/lib/shortlink/config'

// ============================================================================
// GET /shorten — 建立短網址頁面（獨立 HTML，不載入任何追蹤 / 廣告 script）
// 互動邏輯在 public/shortlink/shorten.js；QR Code 完全在瀏覽器端產生。
// ============================================================================

export function GET() {
  const body = `
        <section class="sl-card">
          <h1 class="sl-title">建立短網址</h1>
          <p class="sl-lead">貼上長網址，產生 goodpickslab.com 短網址與 QR Code。連結會在 ${LINK_TTL_DAYS} 天後自動失效。</p>

          <form id="shorten-form" class="sl-form" novalidate>
            <label class="sl-label" for="url">Original URL</label>
            <input class="sl-input" id="url" name="url" type="url" inputmode="url" autocomplete="off"
              placeholder="https://example.com/some/very/long/url" required maxlength="2048">

            <label class="sl-label" for="password">Password <span class="sl-optional">(Optional)</span></label>
            <input class="sl-input" id="password" name="password" type="password" autocomplete="new-password"
              placeholder="不填則不需要密碼" minlength="${PASSWORD_MIN_LENGTH}" maxlength="${PASSWORD_MAX_LENGTH}">
            <p class="sl-hint">設定密碼後，訪客需輸入正確密碼才會前往原始網址。</p>

            <p id="form-error" class="sl-error" role="alert" hidden></p>
            <button class="sl-btn" id="submit" type="submit">建立短網址</button>
          </form>
        </section>

        <section id="result" class="sl-card sl-result" hidden aria-live="polite">
          <h2 class="sl-title-sm">短網址已建立</h2>

          <div class="sl-field">
            <span class="sl-label">Short URL</span>
            <div class="sl-copyrow">
              <a id="short-url" class="sl-mono sl-link" href="#" rel="noopener noreferrer"></a>
              <button class="sl-btn-ghost" type="button" data-copy="short-url">複製</button>
            </div>
          </div>

          <div class="sl-field">
            <span class="sl-label">QR Code</span>
            <div class="sl-qr-wrap">
              <img id="qr" class="sl-qr" alt="短網址 QR Code" width="200" height="200">
              <a id="qr-download" class="sl-btn-ghost" download="shortlink-qr.svg" href="#">下載 QR Code</a>
            </div>
            <p class="sl-hint">QR Code 內容：<span id="qr-text" class="sl-mono"></span></p>
          </div>

          <div class="sl-field sl-token-box">
            <span class="sl-label">Delete Token</span>
            <div class="sl-copyrow">
              <code id="delete-token" class="sl-mono sl-token"></code>
              <button class="sl-btn-ghost" type="button" data-copy="delete-token">複製</button>
            </div>
            <p class="sl-warn"><strong>Delete Token will only be shown once. Save it somewhere safe.</strong><br>
              Delete Token 只會在建立時顯示這一次，請自行保存。之後要刪除短網址時，到 <a class="sl-link" href="/delete">/delete</a> 輸入這組 Token。</p>
          </div>

          <div class="sl-field">
            <span class="sl-label">Expires</span>
            <p class="sl-value"><span id="expires"></span>（${LINK_TTL_DAYS} days）</p>
          </div>

          <p id="has-password" class="sl-hint" hidden>🔒 此短網址已設定密碼。</p>

          <button class="sl-btn-ghost" id="again" type="button">再建立一個</button>
        </section>`

  return htmlResponse(
    renderPage({
      title: '建立短網址',
      body,
      scripts: ['/shortlink/qrcode.js', '/shortlink/common.js', '/shortlink/shorten.js'],
    })
  )
}
