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

  /** 只接受本站 /go/<token>，拒絕完整網址等任何其他值 */
  function isGoPath(value) {
    return (
      typeof value === "string" && /^\/go\/[A-Za-z0-9._-]{1,120}$/.test(value)
    );
  }

  // 1. 全域監聽點擊事件：無論是「有密碼」還是「無密碼」，點擊 #continue 時都會開新分頁
  document.addEventListener("click", function (e) {
    const continueBtn = e.target.closest("#continue");
    if (continueBtn) {
      // 在新分頁開啟蝦皮/Google 連結
      window.open("https://s.shopee.tw/Lno99WAQZ", "_blank", "noopener,noreferrer");
      // 原本的 <a> 標籤仍會依照 href="..." 的網址在「當前頁面」跳轉
    }
  });

  // 2. DOM 載入後僅處理「需要解鎖」的密碼表單邏輯
  document.addEventListener("DOMContentLoaded", function () {
    const data = window.SL.readData();
    // 沒有密碼/不需要解鎖的頁面到這裡直接結束，全域 click 監聽依然會生效
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
