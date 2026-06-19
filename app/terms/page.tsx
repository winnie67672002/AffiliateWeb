import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Terms of Service',
  description: 'Good Picks Lab 使用條款——使用本站前請詳閱相關規定與免責聲明。',
}

const LAST_UPDATED = '2026-06-12'

export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">使用條款</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Terms of Service
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
          使用條款
        </h1>
        <p className="text-sm text-gray-400">最後更新：{LAST_UPDATED}</p>
      </header>

      <div className="space-y-10 text-gray-600 leading-relaxed">

        {/* Acceptance */}
        <section>
          <p>
            歡迎使用 Good Picks Lab（網址：
            <span className="font-medium text-gray-700">goodpickslab.com</span>）。
            存取或使用本站，即表示你同意以下使用條款。若你不同意，請勿使用本站。
          </p>
        </section>

        {/* Content disclaimer */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">1. 內容性質與免責聲明</h2>
          <div className="bg-amber-50 border border-amber-100 rounded-xl p-5 text-sm text-amber-900 mb-4">
            本站所有內容（包括產品評測、比較、推薦）均僅供參考，不構成專業購買建議。
            我們盡力確保資訊準確，但不保證內容完整性、時效性或適合特定用途。
          </div>
          <ul className="space-y-2 text-sm pl-4">
            {[
              '產品規格、價格與庫存可能隨時變動，本站資訊未必反映最新狀態。',
              '購買決策應由你自行評估，本站不對因參考本站內容所做的決定負責。',
              '本站內容不構成財務、法律或醫療建議。',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-amber-400 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Affiliate disclosure */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">2. Affiliate 聯盟行銷聲明</h2>
          <p className="mb-3">
            本站參與聯盟行銷計畫。文章中部分連結為 affiliate 連結，當你透過這些連結購買商品時，
            本站可能獲得佣金，但這不會增加你的購買成本。
          </p>
          <p>
            聯盟關係不影響我們的編輯立場。我們僅推薦經過評估後認為真正有價值的產品，
            且所有 affiliate 連結均會以適當方式標示或聲明。
          </p>
        </section>

        {/* Third party links */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">3. 第三方連結責任</h2>
          <p>
            本站包含連結至蝦皮、Amazon 等第三方平台的連結。這些網站由獨立第三方營運，
            本站對其內容、隱私政策、服務品質或商品品質不負任何責任。
            進入第三方網站後，你將受該平台的條款與政策約束。
          </p>
        </section>

        {/* Intellectual property */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">4. 智慧財產權</h2>
          <p>
            本站所有原創文章、圖片及設計均受著作權保護，版權歸 Good Picks Lab 所有。
            未經書面授權，不得複製、轉載或以任何形式重製本站內容。
            引用請標明出處並附上原文連結。
          </p>
        </section>

        {/* User conduct */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">5. 使用者責任</h2>
          <p>使用本站時，你同意：</p>
          <ul className="mt-3 space-y-1.5 pl-4 text-sm">
            {[
              '不以任何方式損害本站或其他使用者的利益',
              '不嘗試未授權存取本站系統或資料',
              '不散布垃圾郵件、惡意軟體或非法內容',
              '遵守所有適用的法律法規',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="w-1 h-1 rounded-full bg-gray-400 shrink-0 mt-2" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* Limitation of liability */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">6. 責任限制</h2>
          <p>
            在法律允許的最大範圍內，Good Picks Lab 對於因使用或無法使用本站所造成的任何直接、
            間接、附帶或後果性損害，均不承擔賠償責任。本站服務以「現況」提供，
            不提供任何形式的明示或暗示保證。
          </p>
        </section>

        {/* Changes */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">7. 條款變更</h2>
          <p>
            我們保留隨時修改本使用條款的權利，修改後條款將於本頁發布後立即生效。
            建議定期查閱本頁以了解最新條款。繼續使用本站即視為接受修改後的條款。
          </p>
        </section>

        {/* Contact */}
        <section>
          <h2 className="text-base font-semibold text-gray-900 mb-3">8. 聯絡方式</h2>
          <p>
            如對本使用條款有任何疑問，請透過{' '}
            <a href="mailto:contact@goodpickslab.com" className="text-gray-900 underline hover:text-gray-600">
              contact@goodpickslab.com
            </a>{' '}
            與我們聯絡。
          </p>
        </section>

      </div>

      {/* Footer nav */}
      <footer className="mt-14 pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <Link href="/about" className="hover:text-gray-700 transition-colors">關於我們</Link>
        <Link href="/contact" className="hover:text-gray-700 transition-colors">聯絡我們</Link>
        <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">隱私權政策</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>

    </div>
  )
}
