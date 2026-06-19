import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Privacy Policy',
  description: 'Good Picks Lab 隱私權政策——說明我們如何收集、使用及保護你的資料。',
}

const LAST_UPDATED = '2026-06-12'

export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">隱私權政策</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Privacy Policy
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          隱私權政策
        </h1>
        <p className="text-sm text-gray-400">最後更新：{LAST_UPDATED}</p>
      </header>

      <div className="space-y-10 text-gray-600 leading-relaxed">

        {/* Intro */}
        <section>
          <p>
            本隱私權政策說明 Good Picks Lab（以下簡稱「本站」，網址：
            <span className="font-medium text-gray-700">goodpickslab.com</span>）
            如何收集、使用及保護你在使用本站時所產生的資料。
            使用本站即表示你同意本政策所述之條款。
          </p>
        </section>

        {/* Analytics */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">1. 我們收集哪些資料</h2>
          <p className="mb-3">本站不主動蒐集你的姓名、電話或其他可識別個人身份的敏感資料。我們透過以下第三方服務自動收集匿名化的使用行為資料：</p>
          <ul className="space-y-2 pl-4">
            {[
              {
                name: 'Google Analytics / Google Ads (gtag.js)',
                detail: '收集頁面瀏覽、停留時間、流量來源等匿名統計資料，以及廣告轉換事件。追蹤 ID：AW-411628672。',
              },
              {
                name: 'Vercel Analytics',
                detail: '收集頁面載入效能與匿名瀏覽統計，不含個人識別資訊。',
              },
              {
                name: 'Affiliate 連結追蹤',
                detail: '當你點擊本站的聯盟行銷連結時，第三方平台（如蝦皮、Amazon）可能透過 cookie 或 URL 參數記錄點擊行為，以計算佣金。這些資料由該平台收集，不由本站直接保存。',
              },
            ].map((item) => (
              <li key={item.name} className="flex gap-3 p-4 rounded-xl bg-gray-50 border border-gray-100 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0 mt-2" />
                <div>
                  <p className="font-medium text-gray-800 mb-0.5">{item.name}</p>
                  <p className="text-gray-500">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* Cookies */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">2. Cookies</h2>
          <p>
            本站使用 cookies 與類似技術來提升使用體驗及進行流量分析。
            Google Analytics 與 Google Ads 會在你的瀏覽器中設置 cookies 以識別回訪行為。
            你可以透過瀏覽器設定拒絕或刪除 cookies，但部分功能可能因此受到影響。
          </p>
        </section>

        {/* Data use */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">3. 資料用途</h2>
          <p>所收集的匿名資料僅用於以下目的：</p>
          <ul className="mt-3 space-y-1.5 pl-4 text-sm">
            {[
              '了解讀者興趣，改善內容品質',
              '分析哪些頁面或主題最受歡迎',
              '衡量廣告效益與聯盟行銷成效',
              '監控網站技術效能',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4">我們不會出售、出租或交換任何使用者資料給第三方。</p>
        </section>

        {/* Third party */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">4. 第三方連結</h2>
          <p>
            本站包含連結至外部網站的連結（包括商品購買頁面）。
            這些網站有其獨立的隱私權政策，本站對其資料處理方式不負任何責任。
            建議你在前往外部網站前閱讀其隱私政策。
          </p>
        </section>

        {/* GDPR */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">5. 你的權利（GDPR）</h2>
          <p>
            若你位於歐盟或英國，你有權要求查閱、更正或刪除我們可能持有的與你相關之資料，
            以及反對或限制特定類型的資料處理。如需行使上述權利，請透過{' '}
            <a href="mailto:contact@goodpickslab.com" className="text-gray-900 underline hover:text-gray-600">
              contact@goodpickslab.com
            </a>{' '}
            與我們聯絡。
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">6. 政策更新</h2>
          <p>
            本政策可能不定期更新。重大變更時，我們會更新頁面頂部的「最後更新」日期。
            建議定期查閱本頁以獲取最新資訊。
          </p>
        </section>

      </div>

      {/* Footer nav */}
      <footer className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <Link href="/about" className="hover:text-gray-700 transition-colors">關於我們</Link>
        <Link href="/contact" className="hover:text-gray-700 transition-colors">聯絡我們</Link>
        <Link href="/terms" className="hover:text-gray-700 transition-colors">使用條款</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>

    </div>
  )
}
