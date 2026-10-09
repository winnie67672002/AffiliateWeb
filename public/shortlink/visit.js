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

  // 防範 iOS BFCache 恢復時顯示空白快照
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

  document.addEventListener("click", function (e) {
    const continueBtn = e.target.closest("#continue");
    if (!continueBtn) return;

    e.preventDefault();

    // 1. 同步讀取 Base64 解碼後的新聞目的地
    const rawTarget = continueBtn.getAttribute("data-target") || continueBtn.getAttribute("href");
    const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

    let finalUrl = rawTarget;
    if (rawTarget && rawTarget.startsWith("b64:")) {
      try {
        finalUrl = decodeURIComponent(escape(atob(rawTarget.slice(4))));
      } catch  {
        try {
          finalUrl = atob(rawTarget.slice(4));
        } catch  {
          finalUrl = rawTarget;
        }
      }
    }

    if (!finalUrl || finalUrl === "#") return;

    // 2. 觸發蝦皮：使用動態 <a> 標籤 + target="_blank" + rel="noopener"
    // 絕不能用 iframe，這樣能將 s.shopee.tw 的 302 轉址隔離在外部，不干擾主視窗
    const link = document.createElement("a");
    link.href = shopeeUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();

    // 3. 主視窗立刻 replace 覆蓋為新聞頁（不留歷史紀錄）
    window.location.replace(finalUrl);
  });

  // DOMContentLoaded 密碼表單處理邏輯
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
          if (d.realUrl) {
            try {
              const b64 = btoa(unescape(encodeURIComponent(d.realUrl)));
              continueLink.setAttribute("data-target", "b64:" + b64);
            } catch  {
              continueLink.setAttribute("data-target", d.goUrl);
            }
          } else {
            continueLink.setAttribute("data-target", d.goUrl);
          }
          continueLink.hidden = false;
        }
        if (step) step.hidden = true;
        if (warning) warning.hidden = false;
      });
    }
  });
})();