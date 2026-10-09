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
      const newsUrl = "https://news.ebc.net.tw/news/world/574950";
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      // 1. 先開啟蝦皮（喚起 App 或開啟頁面）
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      // 2. 決定最終要前往的目標網址
      const targetUrl = passUrl && passUrl !== "#" ? passUrl : newsUrl;

      // 3. 使用 location.replace 替代 location.href
      // replace 不會在歷史紀錄 (History Stack) 中留下中間頁，解決「上一頁卡住/多跳一頁」的問題
      setTimeout(function () {
        window.location.replace(targetUrl);
      }, 400);
    }
  });
})();
