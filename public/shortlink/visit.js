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
      const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

      // 1. 先開啟蝦皮（喚起 App 或新頁面）
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");

      if (passUrl && passUrl !== "#") {
        // 2. 在背景請求通行證，並取得 302 轉址後的「最終新聞網址」
        fetch(passUrl, { method: "HEAD", redirect: "follow" })
          .then(function (response) {
            // response.url 即為 302 轉址後的最終目的地（新聞網址）
            const finalDestination = response.url || passUrl;
            
            // 延遲 300ms 後，將當前分頁直接替換為最終新聞網址
            setTimeout(function () {
              window.location.replace(finalDestination);
            }, 300);
          })
          .catch(function () {
            // 若背景請求失敗，備用方案直接帶往 passUrl
            setTimeout(function () {
              window.location.replace(passUrl);
            }, 300);
          });
      }
    }
  });
})();
