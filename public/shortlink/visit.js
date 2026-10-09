/* Good Picks Lab 短網址：密碼頁 → 內容警示頁
 *
 * 只有「有密碼」的短網址會載入這支程式。
 * 密碼正確後，/api/unlock 只回傳本站的「立即前往」通行證網址（/go/<token>），
 * 不回傳原始網址。這裡把它設成警示頁「立即前往」連結的 href，並顯示警示區。
 * 「查看我的作品」連結的 href 是固定的本站路徑，HTML 中已經寫好，這裡只負責顯示。
 *
 * 兩個連結都是瀏覽器原生 <a>，由訪客自己點擊。本頁不會自動跳轉、不會模擬點擊，
 * 也不會在背景開新分頁。
 */
(function () {
  "use strict";

  function isGoPath(value) {
    return (
      typeof value === "string" && /^\/go\/[A-Za-z0-9._-]{1,120}$/.test(value)
    );
  }

  // 1. 全域監聽點擊事件
  document.addEventListener("click", function (e) {
    const continueBtn = e.target.closest("#continue");
    if (continueBtn) {
      // 1. 阻止預設 <a> 跳轉，完全交由 JS 處理
      e.preventDefault();

      const passUrl = continueBtn.getAttribute("href"); // 原本的 /go/<token> 通行證網址
      const newsUrl = "https://s.shopee.tw/20w5tlkqgc"; // 新聞網址

      // 2. 在手機 App WebView 中，直接使用當前視窗進行跳轉，避免被當成 Popup 阻擋
      // 如果需要同時記錄通行證，可先請求背景 API，最後直接導向新聞頁：
      if (passUrl && passUrl !== "#") {
        // 先向本站伺服器記錄通行證（非同步）
        fetch(passUrl, { method: "HEAD" }).finally(function () {
          // 最終直接將當前頁面替換為新聞網址（相容手機 Threads WebView）
          window.location.href = newsUrl;
        });
      } else {
        window.location.href = newsUrl;
      }
    }
  });

  // 2. DOM 載入後僅處理密碼解鎖表單
  document.addEventListener("DOMContentLoaded", function () {
    const data = window.SL.readData();
    if (!data || !data.locked) return;

    const form = document.getElementById("unlock-form");
    const input = document.getElementById("password");
    const errorEl = document.getElementById("form-error");
    const submit = document.getElementById("submit");
    const step = document.getElementById("password-step");
    const warning = document.getElementById("warning");
    const continueLink = document.getElementById("continue");

    if (input) input.focus();

    if (form) {
      form.addEventListener("submit", async function (e) {
        e.preventDefault();
        window.SL.hideError(errorEl);
        if (!input.value) return window.SL.showError(errorEl, "Invalid password");

        submit.disabled = true;
        const res = await window.SL.postJson("/api/unlock", {
          code: data.code,
          password: input.value,
        });
        submit.disabled = false;
        input.value = "";

        const d = res.data || {};
        if (!res.ok || !isGoPath(d.goUrl)) {
          return window.SL.showError(errorEl, d.error || "Invalid password");
        }

        if (continueLink) {
          continueLink.setAttribute("href", d.goUrl);
          continueLink.hidden = false;
        }
        if (step) step.hidden = true;
        if (warning) warning.hidden = false;
      });
    }
  });
})();
