import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import FaqBlock from '@/components/FaqBlock'
import AffiliateButton from '@/components/AffiliateButton'

const FAQS = [
  {
    q: '上班族滑鼠最重要的規格是什麼？',
    a: '比起高 DPI，上班族更該優先看「人體工學設計」和「靜音點擊」。每天使用 6 小時以上，手腕角度和點擊噪音對長期使用體驗的影響，遠比滑鼠的最高 DPI 數字更明顯。',
  },
  {
    q: '開放式辦公室適合用靜音滑鼠嗎？',
    a: '非常適合。開放式辦公室最常見的困擾就是滑鼠點擊聲音打擾旁邊同事，選擇像 Logitech MX Master 3S 這類主打靜音點擊的滑鼠，可以明顯降低環境噪音，也比較不會影響到自己專注。',
  },
  {
    q: '需要同時操作桌機和筆電，滑鼠該怎麼選？',
    a: '建議選擇支援多設備快速切換的滑鼠，例如 Logitech M720 Triathlon 或 MX Master 3S，都支援最多 3 台裝置一鍵切換，不需要為每台電腦各買一顆滑鼠。',
  },
  {
    q: '手腕容易痠，換人體工學滑鼠真的有幫助嗎？',
    a: '有明顯幫助。一般平放式滑鼠會讓手腕長時間內旋，累積壓力在腕管附近。人體工學滑鼠的握持角度讓手腕保持接近自然握手的姿勢，長時間使用下來疲勞感差距很大，如果已經有手腕不適，優先考慮更換。',
  },
]

export const metadata: Metadata = {
  title: '上班族滑鼠推薦：辦公室滑鼠怎麼選？2026 版',
  description:
    '上班族滑鼠推薦怎麼選？從人體工學、靜音點擊到多設備切換，整理辦公室使用最需要注意的重點，並推薦 2026 年最適合長時間辦公的無線滑鼠。',
  keywords: ['上班族滑鼠推薦', '辦公室滑鼠推薦', '人體工學滑鼠', '靜音滑鼠推薦'],
  alternates: {
    canonical: '/mouse/best-mouse-for-office',
  },
  openGraph: {
    title: '上班族滑鼠推薦：辦公室滑鼠怎麼選？',
    description: '從人體工學、靜音點擊到多設備切換，整理辦公室使用最需要注意的重點。',
    type: 'article',
    images: [{ url: '/images/mx-master-3s.jpg' }],
  },
}

export default function BestMouseForOfficePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '3C', url: '/3c' },
          { name: '滑鼠', url: '/mouse' },
          { name: '上班族滑鼠推薦', url: '/mouse/best-mouse-for-office' },
        ]}
      />
      <FaqSchema faqs={FAQS} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/mouse" className="hover:text-gray-700 transition-colors">滑鼠</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">上班族滑鼠推薦</span>
      </nav>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            上班族滑鼠推薦：辦公室滑鼠怎麼選？
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
            每天用電腦超過 6 小時，滑鼠選錯真的會反映在手腕和專注力上。這篇整理上班族最該優先考慮的三個重點，
            幫你快速縮小選擇範圍。
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>上班族選滑鼠的三個優先順序</h2>
          <p>
            比起規格表上最亮眼的數字，長時間辦公使用者真正該在意的其實是下面三件事，順序也大致按重要性排列：
          </p>
          <ol>
            <li>
              <strong>人體工學設計：</strong>每天使用 6 小時以上，手腕角度是否自然，會直接影響一整天下來的疲勞感。
              平放式握持容易讓手腕長時間內旋，累積壓力在腕管附近；有傾斜握持設計的滑鼠可以明顯改善這個問題。
            </li>
            <li>
              <strong>靜音點擊：</strong>開放式辦公室是台灣多數公司的常態，滑鼠點擊聲音會影響旁邊同事，也會讓自己
              在意周遭眼光而不敢隨意點擊。靜音點擊設計對辦公環境的舒適度影響比想像中大。
            </li>
            <li>
              <strong>多設備切換：</strong>如果你需要同時操作公司電腦和個人筆電，支援 2–3 台裝置快速切換的滑鼠，
              可以省去每次插拔接收器或重新配對藍牙的麻煩。
            </li>
          </ol>

          <h2>編輯推薦：Logitech MX Master 3S</h2>
          <p>
            綜合以上三點，<strong>Logitech MX Master 3S</strong> 是目前辦公滑鼠裡評分最全面的選擇：人體工學拇指托
            設計、真正安靜的靜音點擊、支援最多 3 台裝置一鍵切換，加上約 70 天的電池續航，幾乎不需要頻繁充電。
            唯一的取捨是體積偏大，不適合當作攜帶用滑鼠——如果你常出差，可以參考更輕巧的 MX Anywhere 3S。
          </p>
        </div>

        <div className="not-prose my-8 rounded-2xl border-2 border-amber-200 bg-amber-50 p-6 sm:p-8 text-center">
          <p className="text-xs font-semibold text-amber-700 uppercase tracking-widest mb-2">編輯推薦</p>
          <h3 className="text-xl font-extrabold text-gray-900 mb-2">Logitech MX Master 3S</h3>
          <p className="text-sm text-gray-600 mb-5 max-w-md mx-auto">
            人體工學、靜音點擊、多設備切換三項全能，是長時間辦公最穩妥的選擇。
          </p>
          <AffiliateButton
            href="https://www.logitech.com/zh-tw/products/mice/mx-master-3s.910-006559.html"
            productName="Logitech MX Master 3S"
            className="mx-auto"
          >
            查看 MX Master 3S 最新價格 →
          </AffiliateButton>
        </div>

        <div className="prose prose-gray max-w-none">
          <p>
            想看更多規格細節與其他 4 款針對不同族群（工程師、設計師、商務出差、學生）的推薦，可以參考完整版的
            {' '}<Link href="/best-wireless-mouse-productivity-2026">2026 無線滑鼠推薦評測</Link>。
          </p>
        </div>

        <FaqBlock faqs={FAQS} />

        <section className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">延伸閱讀</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/mouse/what-is-dpi" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              滑鼠 DPI 是什麼？多少才夠用？ →
            </Link>
            <Link href="/mouse/mouse-vs-trackpad" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              滑鼠 vs 觸控板：該選哪個？ →
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
