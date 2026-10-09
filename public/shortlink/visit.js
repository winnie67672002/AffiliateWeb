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

  // 【核心修正 1】如果使用者按「上一頁」回到本頁，監測到 BFCache 恢復時強制自動跳過或重繪
  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      window.location.reload();
    }
  });

  document.addEventListener("click", function (e) {
    const continueBtn = e.target.closest("#continue");
    if (!continueBtn) return;

    e.preventDefault();

    // 1. 同步讀取 Base64 解碼後的目的地網址
    const rawTarget = continueBtn.getAttribute("data-target") || continueBtn.getAttribute("href");
    const shopeeUrl = "https://s.shopee.tw/Lno99WAQZ";

    let finalUrl = rawTarget;
    if (rawTarget && rawTarget.startsWith("b64:")) {
      try {
        finalUrl = decodeURIComponent(escape(atob(rawTarget.slice(4))));
      } catch  {
        try {
          finalUrl = atob(rawTarget.slice(4));
        } catch {
          finalUrl = rawTarget;
        }
      }
    }

    if (!finalUrl || finalUrl === "#") return;

    // 【核心修正 2】使用隱藏的 iframe 觸發蝦皮喚起，避免搶奪主視窗的渲染 Thread 導致白屏
    try {
      const iframe = document.createElement("iframe");
      iframe.style.display = "none";
      iframe.src = shopeeUrl;
      document.body.appendChild(iframe);
    } catch  {}

    // 同時呼叫 window.open 作為相容備援
    try {
      window.open(shopeeUrl, "_blank", "noopener,noreferrer");
    } catch  {}

    // 【核心修正 3】主視窗立刻 replacement 到新聞網，無 Threads 鎖定衝突
    window.location.replace(finalUrl);
  });

  // ... 密碼解鎖解鎖邏輯保持不變 ...
})();