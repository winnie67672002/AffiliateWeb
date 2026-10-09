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

      const passUrl = continueBtn.getAttribute("href");
      // 目的地東森新聞（若有 passUrl 亦可使用 passUrl）
      const newsUrl = "https://news.ebc.net.tw/news/world/574950";
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      // 1. 先開啟蝦皮（喚起 App 或開新分頁）
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      // 2. 延遲 400 毫秒後，將當前分頁替換為東森新聞
      // 給予 WebView 足夠時間反應 window.open，避免請求被強制中斷
      setTimeout(function () {
        window.location.href = passUrl && passUrl !== "#" ? passUrl : newsUrl;
      }, 400);
    }
  });
})();
