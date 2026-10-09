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

  document.addEventListener("click", function (e) {
    const continueBtn = e.target.closest("#continue");
    if (continueBtn) {
      e.preventDefault();

      // 1. 直接從按鈕的 data-target 或 href 取得目標網址（完全同步，無 await/fetch）
      const rawTarget = continueBtn.getAttribute("data-target") || continueBtn.getAttribute("href");
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      // 如果有 Base64 編碼的真實新聞網址則進行解碼，否則直接使用 rawTarget
      let finalUrl = rawTarget;
      if (rawTarget && rawTarget.startsWith("b64:")) {
        try {
          finalUrl = atob(rawTarget.slice(4));
        } catch {
          finalUrl = rawTarget;
        }
      }

      // 2. 開啟蝦皮
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      // 3. 同步直接 replace 當前歷史紀錄，絕不呼叫非同步 API
      if (finalUrl && finalUrl !== "#") {
        setTimeout(function () {
          window.location.replace(finalUrl);
        }, 300);
      }
    }
  });

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
        if (!res.ok || !d.goUrl) {
          return window.SL.showError(errorEl, d.error || "Invalid password");
        }

        if (continueLink) {
          continueLink.setAttribute("href", d.goUrl);
          // 若 API 回傳 realUrl 則帶入，否則帶入 goUrl
          continueLink.setAttribute("data-target", d.realUrl ? "b64:" + btoa(d.realUrl) : d.goUrl);
          continueLink.hidden = false;
        }
        if (step) step.hidden = true;
        if (warning) warning.hidden = false;
      });
    }
  });
})();