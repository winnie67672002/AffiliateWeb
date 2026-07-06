import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: '3C 生產力設備推薦｜滑鼠、鍵盤、行動電源選購指南',
  description:
    '3C 生產力設備專區：滑鼠、鍵盤、行動電源選購指南與實測推薦，幫上班族、工程師與設計師找到最適合的辦公周邊。',
  keywords: ['3C推薦', '生產力設備', '辦公設備推薦', '滑鼠鍵盤推薦'],
  alternates: {
    canonical: '/3c',
  },
  openGraph: {
    title: '3C 生產力設備推薦｜滑鼠、鍵盤、行動電源選購指南',
    description: '滑鼠、鍵盤、行動電源選購指南與實測推薦，幫你找到最適合的辦公周邊。',
    type: 'website',
  },
}

const LIVE_CATEGORIES = [
  {
    icon: '🖱️',
    title: '滑鼠',
    desc: 'DPI 是什麼、上班族怎麼選、Mac 相容性、滑鼠 vs 觸控板，完整選購指南 + 5 款實測比較。',
    href: '/mouse',
    cta: '進入滑鼠專區 →',
  },
  {
    icon: '⌨️',
    title: '鍵盤',
    desc: '機械鍵盤軸體、配列與預算怎麼選，從入門到進階的完整拆解。',
    href: '/mechanical-keyboard-guide',
    cta: '閱讀鍵盤選購指南 →',
  },
  {
    icon: '🔋',
    title: '行動電源',
    desc: 'MagSafe 磁吸、快充、飛機攜帶規範一次整理，實測 12+ 款 iPhone 行動電源。',
    href: '/best-power-bank-iphone-2026',
    cta: '查看行動電源推薦 →',
  },
]

const PLANNED_CATEGORIES = ['USB Hub', '螢幕', '筆電配件', '人體工學周邊', '辦公桌設備']

export default function ThreeCHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema items={[{ name: '首頁', url: '/' }, { name: '3C', url: '/3c' }]} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">3C</span>
      </nav>

      <header className="mb-12">
        <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full bg-white mb-4">
          3C 生產力設備
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          辦公桌上的每一件周邊，<br />
          <span className="text-gray-400 font-bold">都值得選對。</span>
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
          這裡整理滑鼠、鍵盤、行動電源等生產力周邊的選購指南與實測推薦，依你最常遇到的問題分類，
          不用從頭讀完整篇規格文章也能快速找到答案。
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          目前已整理的分類
        </h2>
        <div className="space-y-4">
          {LIVE_CATEGORIES.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="flex gap-4 p-5 rounded-2xl border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <span className="text-3xl shrink-0">{cat.icon}</span>
              <div className="flex-1">
                <p className="font-semibold text-gray-900 mb-1 group-hover:text-gray-600 transition-colors">
                  {cat.title}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed mb-2">{cat.desc}</p>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                  {cat.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          規劃中的分類
        </h2>
        <div className="flex flex-wrap gap-2">
          {PLANNED_CATEGORIES.map((cat) => (
            <span
              key={cat}
              className="text-sm text-gray-400 border border-dashed border-gray-200 px-4 py-1.5 rounded-full bg-gray-50"
            >
              {cat}（尚未發布）
            </span>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-4">
          這些分類我們還在測試與比較產品，暫時沒有足夠實測資料可以推薦，之後會陸續補上。
        </p>
      </section>

      <footer className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">所有文章</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>
    </div>
  )
}
