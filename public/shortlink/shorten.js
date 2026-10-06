/* Good Picks Lab 短網址：建立頁 */
(function () {
  'use strict'

  /**
   * 用 qrcode-generator（public/shortlink/qrcode.js，MIT）在瀏覽器端產生 QR Code。
   * 自行組 SVG（只含 rect），不使用任何外部服務。
   */
  function buildQrSvg(text) {
    const qr = window.qrcode(0, 'M') // typeNumber 0 = 自動選擇大小
    qr.addData(text)
    qr.make()
    const count = qr.getModuleCount()
    const margin = 4
    const size = count + margin * 2
    let path = ''
    for (let r = 0; r < count; r++) {
      for (let c = 0; c < count; c++) {
        if (qr.isDark(r, c)) path += 'M' + (c + margin) + ' ' + (r + margin) + 'h1v1h-1z'
      }
    }
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + size + ' ' + size + '" shape-rendering="crispEdges">' +
      '<rect width="100%" height="100%" fill="#ffffff"/>' +
      '<path d="' + path + '" fill="#111827"/></svg>'
    )
  }

  function formatDate(iso) {
    const d = new Date(iso)
    if (isNaN(d.getTime())) return iso
    return d.toLocaleString('zh-TW', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
  }

  document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('shorten-form')
    const urlInput = document.getElementById('url')
    const passwordInput = document.getElementById('password')
    const errorEl = document.getElementById('form-error')
    const submit = document.getElementById('submit')
    const result = document.getElementById('result')
    const formCard = form.closest('.sl-card')

    form.addEventListener('submit', async function (e) {
      e.preventDefault()
      window.SL.hideError(errorEl)

      const url = urlInput.value.trim()
      if (!url) return window.SL.showError(errorEl, '請輸入網址')
      if (!/^https?:\/\//i.test(url)) return window.SL.showError(errorEl, '只接受 http:// 或 https:// 開頭的網址')

      submit.disabled = true
      submit.textContent = '建立中…'
      const payload = { url: url }
      if (passwordInput.value) payload.password = passwordInput.value

      const res = await window.SL.postJson('/api/shorten', payload)
      submit.disabled = false
      submit.textContent = '建立短網址'

      if (!res.ok) return window.SL.showError(errorEl, res.data && res.data.error)

      const data = res.data
      // 立即清掉密碼欄，不在頁面上保留
      passwordInput.value = ''

      const shortLink = document.getElementById('short-url')
      shortLink.textContent = data.shortUrl
      shortLink.href = data.shortUrl

      // QR Code 一律 encode 短網址（不是原始網址）
      const svg = buildQrSvg(data.shortUrl)
      const dataUri = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
      document.getElementById('qr').src = dataUri
      document.getElementById('qr').setAttribute('data-qr-text', data.shortUrl)
      document.getElementById('qr-text').textContent = data.shortUrl
      const dl = document.getElementById('qr-download')
      dl.href = dataUri
      dl.download = 'qr-' + data.shortCode + '.svg'

      document.getElementById('delete-token').textContent = data.deleteToken
      document.getElementById('expires').textContent = formatDate(data.expiresAt)
      document.getElementById('has-password').hidden = !data.hasPassword

      formCard.hidden = true
      result.hidden = false
      result.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })

    document.querySelectorAll('[data-copy]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        const target = document.getElementById(btn.getAttribute('data-copy'))
        if (target) window.SL.copyText(target.textContent || '', btn)
      })
    })

    document.getElementById('again').addEventListener('click', function () {
      // 清掉畫面上的 token，避免離開後還留著
      document.getElementById('delete-token').textContent = ''
      urlInput.value = ''
      result.hidden = true
      formCard.hidden = false
      urlInput.focus()
    })
  })
})()
