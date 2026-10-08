import { SHORTLINK_FOOTER_TEXT } from './config'

// ============================================================================
// 短網址頁面的 HTML 外殼與安全標頭
//
// 為什麼這些頁面用 Route Handler 輸出獨立 HTML，而不是走 app/layout.tsx？
//   根 layout 會在每一頁載入 Google Ads gtag、Vercel Analytics、AdSense。
//   需求明確要求短網址頁「NO TRACKING / NO ADS」，若要在 layout 裡排除，
//   就得修改既有 layout 並讓整站變成動態渲染。改用獨立 HTML 可以：
//     1. 完全不載入任何第三方 script（並用 CSP 從瀏覽器層級禁止）
//     2. 不修改任何既有檔案
//     3. 回傳正確的 404 / 410 狀態碼
//
// XSS：所有動態內容一律經過 escapeHtml()；要交給前端 JS 的資料放在
// <script type="application/json">，並以 safeJsonForHtml() 轉義 < > & 等字元。
// ============================================================================

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

/** JSON 放進 HTML 時避免 </script> 跳脫與 U+2028/2029 問題。 */
export function safeJsonForHtml(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
}

/**
 * CSP：只允許本站的 script / style / 圖片，禁止任何第三方資源、inline script、
 * iframe 嵌入。即使未來有人誤加第三方追蹤碼，瀏覽器也會擋下。
 */
const CSP = [
  "default-src 'none'",
  "script-src 'self' 'unsafe-inline'",
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data:",
  "connect-src 'self'",
  "form-action 'self'",
  "base-uri 'none'",
  "frame-ancestors 'none'",
].join('; ')

export const PAGE_HEADERS: Record<string, string> = {
  'Content-Type': 'text/html; charset=utf-8',
  'Content-Security-Policy': CSP,
  'Cache-Control': 'no-store',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'no-referrer',
  'X-Robots-Tag': 'noindex, nofollow',
}

// 修改 public/shortlink/ 下的 css/js 後，調整這個版本號讓瀏覽器重新抓取
const ASSET_VERSION = '2'

export function renderPage(options: {
  title: string
  body: string
  scripts?: string[]
  data?: unknown
}): string {
  const scripts = (options.scripts ?? [])
    .map((src) => `<script src="${escapeHtml(src)}?v=${ASSET_VERSION}" defer></script>`)
    .join('\n    ')
  const data =
    options.data === undefined
      ? ''
      : `<script type="application/json" id="sl-data">${safeJsonForHtml(options.data)}</script>`

  return `<!doctype html>
<html lang="zh-TW">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="robots" content="noindex, nofollow">
    <meta name="referrer" content="no-referrer">
    <title>${escapeHtml(options.title)} | Good Picks Lab</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="stylesheet" href="/shortlink/shortlink.css?v=${ASSET_VERSION}">
    ${data}
    ${scripts}
  </head>
  <body>
    <div class="sl-shell">
      <header class="sl-top">
        <a class="sl-brand" href="/shorten"><span class="sl-logo" aria-hidden="true">G</span>Good Picks Lab <span class="sl-brand-sub">短網址</span></a>
      </header>
      <main class="sl-main">
${options.body}
      </main>
      <footer class="sl-foot">${escapeHtml(SHORTLINK_FOOTER_TEXT)}</footer>
    </div>
  </body>
</html>`
}

export function htmlResponse(html: string, status = 200): Response {
  return new Response(html, { status, headers: PAGE_HEADERS })
}
