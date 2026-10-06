/* Good Picks Lab 短網址：密碼頁 → 內容警示頁
 *
 * 只有「有密碼」的短網址會載入這支程式。
 * 密碼正確後，/api/unlock 只回傳本站的「繼續前往」通行證網址（/artwork/<token>），
 * 不回傳原始網址。這裡把它設成警示頁「繼續前往」連結的 href；
 * 連結本身已在 HTML 中設定 target="_blank" rel="noopener noreferrer"。
 * 本頁不會自動跳轉，也不會模擬點擊。
 */
(function () {
  'use strict'

  /** 只接受本站 /artwork/<token>，其他任何值（含完整網址）一律拒絕 */
  function isContinuePath(value) {
    return typeof value === 'string' && /^\/artwork\/[A-Za-z0-9._-]{1,120}$/.test(value)
  }

  document.addEventListener('DOMContentLoaded', function () {
    const data = window.SL.readData()
    if (!data || !data.locked) return

    const form = document.getElementById('unlock-form')
    const input = document.getElementById('password')
    const errorEl = document.getElementById('form-error')
    const submit = document.getElementById('submit')
    const step = document.getElementById('password-step')
    const warning = document.getElementById('warning')
    const continueLink = document.getElementById('continue')
    input.focus()

    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      window.SL.hideError(errorEl)
      if (!input.value) return window.SL.showError(errorEl, 'Invalid password')

      submit.disabled = true
      const res = await window.SL.postJson('/api/unlock', { code: data.code, password: input.value })
      submit.disabled = false
      input.value = ''

      if (!res.ok || !isContinuePath(res.data && res.data.continueUrl)) {
        return window.SL.showError(errorEl, (res.data && res.data.error) || 'Invalid password')
      }

      continueLink.setAttribute('href', res.data.continueUrl)
      continueLink.hidden = false
      step.hidden = true
      warning.hidden = false
    })
  })
})()
