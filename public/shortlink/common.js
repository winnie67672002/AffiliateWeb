/* Good Picks Lab 短網址：共用前端工具（無任何追蹤、無第三方請求） */
(function () {
  'use strict'

  async function postJson(path, payload) {
    let res
    try {
      res = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        credentials: 'same-origin',
        cache: 'no-store',
      })
    } catch {
      return { ok: false, status: 0, data: { error: '網路連線失敗，請稍後再試' } }
    }
    let data = {}
    try {
      data = await res.json()
    } catch {
      data = {}
    }
    return { ok: res.ok, status: res.status, data: data }
  }

  /** 只用 textContent 顯示訊息，避免任何 HTML injection */
  function showError(el, message) {
    if (!el) return
    el.textContent = typeof message === 'string' && message ? message : '發生錯誤，請稍後再試'
    el.hidden = false
  }

  function hideError(el) {
    if (!el) return
    el.textContent = ''
    el.hidden = true
  }

  function readData() {
    const node = document.getElementById('sl-data')
    if (!node) return null
    try {
      return JSON.parse(node.textContent || 'null')
    } catch {
      return null
    }
  }

  function isHttpUrl(value) {
    if (typeof value !== 'string') return false
    try {
      const u = new URL(value)
      return (u.protocol === 'http:' || u.protocol === 'https:') && !!u.hostname
    } catch {
      return false
    }
  }

  async function copyText(text, button) {
    try {
      await navigator.clipboard.writeText(text)
      if (button) {
        const old = button.textContent
        button.textContent = '已複製'
        setTimeout(function () { button.textContent = old }, 1500)
      }
    } catch {
      window.prompt('請手動複製：', text)
    }
  }

  window.SL = { postJson: postJson, showError: showError, hideError: hideError, readData: readData, isHttpUrl: isHttpUrl, copyText: copyText }
})()
