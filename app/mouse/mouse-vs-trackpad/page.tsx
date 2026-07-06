import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import FaqBlock from '@/components/FaqBlock'

const FAQS = [
  {
    q: '觸控板可以完全取代滑鼠嗎？',
    a: '對輕度使用者可以，但對長時間文書工作、多視窗操作或設計工作來說，滑鼠通常還是效率更高。觸控板的優勢在於免帶配件、手勢操作直覺，滑鼠的優勢在於精準度與長時間使用的手腕舒適度。',
  },
  {
    q: '設計工作適合用觸控板嗎？',
    a: '不建議。UI 設計、修圖、影像剪輯這類需要精細游標控制的工作，滑鼠（尤其是高 DPI、高精度感測器的款式）能提供比觸控板更穩定精準的操作體驗，觸控板容易出現手指誤觸或移動不夠細膩的狀況。',
  },
  {
    q: '筆電外接滑鼠會不會反而不方便？',
    a: '如果是常態辦公桌使用，外接無線滑鼠不會造成不便，反而能大幅提升操作效率與舒適度。真正需要考慮攜帶便利性的情境，是經常在外移動辦公，這時可以選擇像 MX Anywhere 3S 這類體積小巧的隨身滑鼠。',
  },
  {
    q: '觸控板對手腕比較好嗎？',
    a: '不一定。長時間使用觸控板需要手指反覆點按和滑動，對手指關節的負擔不小；滑鼠如果搭配人體工學設計，手腕反而能維持更自然的姿勢。兩者各有不同的疲勞部位，沒有絕對哪個比較好，取決於個人使用習慣。',
  },
]

export const metadata: Metadata = {
  title: '滑鼠 vs 觸控板：辦公室、設計工作該選哪個？',
  description:
    '滑鼠和觸控板到底該選哪個？從精準度、手腕負擔、攜帶便利性三個角度比較，並針對辦公、設計、筆電族分別給出建議。',
  keywords: ['滑鼠vs觸控板', '觸控板還是滑鼠', '筆電滑鼠推薦', '設計工作滑鼠'],
  alternates: {
    canonical: '/mouse/mouse-vs-trackpad',
  },
  openGraph: {
    title: '滑鼠 vs 觸控板：辦公室、設計工作該選哪個？',
    description: '從精準度、手腕負擔、攜帶便利性三個角度比較滑鼠與觸控板。',
    type: 'article',
  },
}

export default function MouseVsTrackpadPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '3C', url: '/3c' },
          { name: '滑鼠', url: '/mouse' },
          { name: '滑鼠 vs 觸控板', url: '/mouse/mouse-vs-trackpad' },
        ]}
      />
      <FaqSchema faqs={FAQS} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/mouse" className="hover:text-gray-700 transition-colors">滑鼠</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">滑鼠 vs 觸控板</span>
      </nav>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            滑鼠 vs 觸控板：辦公/設計工作該選哪個？
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
            筆電內建觸控板已經越做越好用，但這不代表它適合所有工作情境。這篇從三個實際使用角度比較，
            幫你判斷自己到底需不需要額外買一顆滑鼠。
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>三個關鍵比較點</h2>

          <h3>1. 精準度</h3>
          <p>
            滑鼠透過實體移動搭配感測器追蹤，精準度普遍優於觸控板的手指滑動辨識。這個差異在需要細部操作的場景會特別
            明顯，例如 Photoshop 修圖時的路徑選取、Figma 裡對齊像素、影片剪輯時抓取精確的時間軸位置。滑鼠也支援
            DPI 調整（可參考
            {' '}<Link href="/mouse/what-is-dpi">滑鼠 DPI 是什麼</Link>），能依需求切換靈敏度，這是觸控板做不到的。
          </p>

          <h3>2. 手腕與手指負擔</h3>
          <p>
            長時間使用觸控板需要手指反覆點按、雙指滾動，對手指關節與手腕背屈角度都有一定負擔。滑鼠如果選擇
            人體工學設計（可參考
            {' '}<Link href="/mouse/best-mouse-for-office">上班族滑鼠推薦</Link>），可以讓手腕維持更自然的握持角度，
            長時間使用下來的疲勞感通常較低。兩者的疲勞部位不同，沒有誰絕對比較好，但長時間辦公者換上人體工學滑鼠
            通常會有明顯感受。
          </p>

          <h3>3. 攜帶與空間便利性</h3>
          <p>
            這是觸控板真正的優勢——不需要額外攜帶配件，也不佔用桌面空間，在咖啡廳、飛機座位這類空間有限的場合特別
            實用。如果你經常需要移動辦公，又想兼顧滑鼠的精準度，可以考慮體積輕巧的隨身款滑鼠，出差時收進包包完全
            不佔空間。
          </p>

          <h2>結論：看你的主要工作場景</h2>
          <p>
            如果你大部分時間在固定的辦公桌工作，滑鼠幾乎都是效率更高、手腕更舒適的選擇；如果你經常在外移動、
            只是偶爾處理文書，觸控板的便利性可能更符合需求。兩者也可以並用——外出時用觸控板，回到座位就接上無線
            滑鼠，是很多筆電族實際的使用方式。
          </p>
        </div>

        <FaqBlock faqs={FAQS} />

        <section className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">延伸閱讀</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/mouse/best-mouse-for-mac" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              Mac 滑鼠怎麼選？ →
            </Link>
            <Link href="/best-wireless-mouse-productivity-2026" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              2026 無線滑鼠推薦完整評測 →
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
