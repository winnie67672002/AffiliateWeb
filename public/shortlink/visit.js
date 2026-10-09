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

      const rawTarget = continueBtn.getAttribute("data-target") || continueBtn.getAttribute("href");
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      let finalUrl = rawTarget;
      if (rawTarget && rawTarget.startsWith("b64:")) {
        try {
          finalUrl = decodeURIComponent(escape(atob(rawTarget.slice(4))));
        } catch {
          finalUrl = rawTarget;
        }
      }

      if (!finalUrl || finalUrl === "#") return;

      // 1. 先觸發蝦皮喚起（使用者點擊主觸發）
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      // 2. 利用 requestAnimationFrame 切換執行續，確保 Threads WebView 處理完 window.open 後才執行頁面替換
      requestAnimationFrame(function () {
        setTimeout(function () {
          window.location.replace(finalUrl);
        }, 150);
      });
    }
  });
})();