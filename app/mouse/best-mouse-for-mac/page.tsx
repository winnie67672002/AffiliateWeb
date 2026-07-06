import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import FaqBlock from '@/components/FaqBlock'

const FAQS = [
  {
    q: 'Windows 滑鼠可以直接用在 Mac 上嗎？',
    a: '大部分無線滑鼠都可以透過藍牙或通用接收器連接 Mac，基本的移動、左右鍵、滾輪都能正常使用。但部分品牌的進階功能（例如自訂側鍵、手勢操作）需要安裝對應的 macOS 版本軟體才能完整設定，購買前建議確認廠商是否提供 Mac 版驅動程式。',
  },
  {
    q: 'MX Master 3S 在 Mac 上好用嗎？',
    a: '很好用。Logitech 提供完整的 Logi Options+ macOS 版本，可以自訂側鍵功能、手勢操作，電磁滾輪與靜音點擊等核心體驗與 Windows 版本一致，是 Mac 使用者詢問度最高的無線滑鼠之一。',
  },
  {
    q: 'Mac 用滑鼠需要特別注意什麼？',
    a: '主要注意兩點：一是連接方式，Mac 機型（尤其是 MacBook）USB-A 埠有限，優先選擇支援藍牙或使用 USB-C 接收器的滑鼠；二是軟體支援，確認廠商官網有提供 macOS 版本的設定軟體，才能使用完整的自訂功能。',
  },
  {
    q: 'MacBook 需要外接滑鼠嗎？',
    a: '如果只是輕度使用，MacBook 的觸控板已經做得相當完整（可參考「滑鼠 vs 觸控板」的比較）。但如果你需要長時間辦公、精細操作或多視窗工作，外接一顆無線滑鼠通常能提升不少效率與舒適度。',
  },
]

export const metadata: Metadata = {
  title: 'Mac 滑鼠怎麼選？2026 相容性與推薦整理',
  description:
    'Mac 滑鼠怎麼選？整理 Windows 滑鼠在 Mac 上的相容性重點、macOS 驅動程式支援情況，以及 2026 年 Mac 使用者詢問度最高的無線滑鼠推薦。',
  keywords: ['Mac滑鼠推薦', 'MacBook滑鼠推薦', 'Mac無線滑鼠', 'MX Master Mac'],
  alternates: {
    canonical: '/mouse/best-mouse-for-mac',
  },
  openGraph: {
    title: 'Mac 滑鼠怎麼選？2026 相容性與推薦整理',
    description: '整理 Windows 滑鼠在 Mac 上的相容性重點與 2026 年 Mac 使用者推薦滑鼠。',
    type: 'article',
    images: [{ url: '/images/mx-master-3s.jpg' }],
  },
}

export default function BestMouseForMacPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '3C', url: '/3c' },
          { name: '滑鼠', url: '/mouse' },
          { name: 'Mac 滑鼠怎麼選', url: '/mouse/best-mouse-for-mac' },
        ]}
      />
      <FaqSchema faqs={FAQS} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/mouse" className="hover:text-gray-700 transition-colors">滑鼠</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">Mac 滑鼠怎麼選</span>
      </nav>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            Mac 滑鼠怎麼選？2026 相容性與推薦整理
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
            大部分無線滑鼠標榜的是 Windows 環境，Mac 使用者常常搞不清楚哪些功能能不能用。這篇整理 Mac 上
            該注意的相容性重點，以及 macOS 使用者詢問度最高的選擇。
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>Mac 選滑鼠前，先確認這兩件事</h2>

          <h3>1. 連接方式：藍牙優先，注意接收器孔位</h3>
          <p>
            現行 MacBook 系列 USB-A 連接埠有限（部分機型甚至完全沒有），如果滑鼠只能透過傳統 USB 接收器連接，
            會需要額外攜帶 USB-C 轉接頭。建議優先選擇支援藍牙直連的滑鼠，或是接收器本身就是 USB-C 接頭
            （例如 Logitech Logi Bolt 部分機型有提供 USB-C 轉接器）。
          </p>

          <h3>2. 軟體支援：確認有沒有 macOS 版本的設定工具</h3>
          <p>
            滑鼠的基本功能（移動、左右鍵、滾輪）在 Mac 上通常不需要安裝任何軟體就能使用。但如果想自訂側鍵功能、
            調整 DPI（可參考
            {' '}<Link href="/mouse/what-is-dpi">滑鼠 DPI 是什麼</Link>）、或使用進階手勢，就需要廠商提供對應的
            macOS 版本軟體。Logitech 的 Logi Options+、Razer 的 Razer Synapse 都有完整的 macOS 版本，這類主流
            品牌在 Mac 上的支援度會比小眾品牌更完整。
          </p>

          <h2>Mac 使用者詢問度最高的選擇</h2>
          <p>
            <strong>Logitech MX Master 3S</strong> 是 Mac 使用者詢問度最高的無線滑鼠之一。它透過 Logi Bolt 或
            藍牙都能連接 Mac，Logi Options+ 提供完整的 macOS 版本設定介面，側鍵、手勢、電磁滾輪等功能都能正常
            自訂，體驗與 Windows 版本幾乎一致。如果你需要更輕巧、方便帶著 MacBook 到處跑的版本，可以考慮
            尺寸更小的 MX Anywhere 3S，同樣支援完整的 macOS 驅動程式。
          </p>
          <p>
            兩款詳細規格與其他 3 款推薦（工程師多設備切換、設計師高精度、學生預算款），可以參考完整版的
            {' '}<Link href="/best-wireless-mouse-productivity-2026">2026 無線滑鼠推薦評測</Link>。
          </p>
        </div>

        <FaqBlock faqs={FAQS} />

        <section className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">延伸閱讀</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/mouse/mouse-vs-trackpad" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              滑鼠 vs 觸控板：該選哪個？ →
            </Link>
            <Link href="/mouse/best-mouse-for-office" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              上班族滑鼠推薦 →
            </Link>
          </div>
        </section>

        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link href="/mouse" className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors">
            ← 返回滑鼠選購指南
          </Link>
        </div>
      </article>
    </div>
  )
}
