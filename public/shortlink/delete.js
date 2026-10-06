/* Good Picks Lab 短網址：刪除頁 */
(function () {
  'use strict'

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('delete-form')
    const tokenInput = document.getElementById('token')
    const errorEl = document.getElementById('form-error')
    const submit = document.getElementById('submit')
    const done = document.getElementById('done')

    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      window.SL.hideError(errorEl)

      const token = tokenInput.value.trim()
      if (!token) return window.SL.showError(errorEl, '請輸入 Delete Token')

      submit.disabled = true
      const res = await window.SL.postJson('/api/delete', { token: token })
      submit.disabled = false

      if (!res.ok) return window.SL.showError(errorEl, res.data && res.data.error)

      tokenInput.value = ''
      form.hidden = true
      document.getElementById('deleted-code').textContent = '/' + (res.data.shortCode || '')
      done.hidden = false
    })
  })
})()
