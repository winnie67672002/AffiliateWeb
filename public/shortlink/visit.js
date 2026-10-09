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

  document.addEventListener("click", async function (e) {
    const continueBtn = e.target.closest("#continue");
    if (continueBtn) {
      e.preventDefault();

      const goHref = continueBtn.getAttribute("href");
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      // 1. 喚起/開啟蝦皮
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      if (goHref && goHref !== "#") {
        try {
          // 2. 向背景請求通行證 API，取得「真實新聞目的地網址」
          // 注意：搭配 fetch 加上 headers 要求 API 回傳 JSON（目的地網址）而非直接 302
          const res = await fetch(goHref, {
            headers: { "X-Requested-With": "XMLHttpRequest" }
          });
          const data = await res.json();

          // 3. 取得新聞網址後，直接 location.replace 到新聞網！
          // 完全繞過 302 產生的多餘歷史紀錄！
          const finalNewsUrl = data.url || goHref;
          setTimeout(function () {
            window.location.replace(finalNewsUrl);
          }, 300);
        } catch {
          // 備用防護：若 API 失敗，直接導向 goHref
          setTimeout(function () {
            window.location.replace(goHref);
          }, 300);
        }
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
          continueLink.hidden = false;
        }
        if (step) step.hidden = true;
        if (warning) warning.hidden = false;
      });
    }
  });
})();
