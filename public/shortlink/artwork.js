/* Good Picks Lab 短網址：作品頁 → 倒數 → 自動跳轉原始網址
 *
 * 原始網址由伺服器從資料庫取出後放在 JSON data block（已轉義）。
 * 跳轉方式：location.replace()，不使用 iframe、模擬點擊或任何第三方請求。
 */
(function () {
  'use strict'

  document.addEventListener('DOMContentLoaded', function () {
    const data = window.SL.readData()
    if (!data || !window.SL.isHttpUrl(data.url)) return

    const countdownEl = document.getElementById('countdown')
    const bar = document.getElementById('progress-bar')
    let left = Math.max(1, Math.min(10, Number(data.countdown) || 3))
    const total = left

    countdownEl.textContent = String(left)
    requestAnimationFrame(function () { bar.style.width = (100 / total) + '%' })

    const timer = setInterval(function () {
      left -= 1
      if (left > 0) {
        countdownEl.textContent = String(left)
        bar.style.width = ((total - left + 1) / total * 100) + '%'
        return
      }
      clearInterval(timer)
      countdownEl.textContent = '0'
      bar.style.width = '100%'
      window.location.replace(data.url)
    }, 1000)
  })
})()
