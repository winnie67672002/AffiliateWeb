import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Good Picks Lab 是一個專注於產品研究與真實評測的內容部落格，幫助你找到值得購買的商品。',
}

const PILLARS = [
  {
    title: '真實研究',
    body: '每篇文章都經過資料蒐集、規格比較與市場調查，我們不依賴廠商提供的行銷稿。',
  },
  {
    title: '客觀評估',
    body: '我們指出每款產品的優缺點，幫你做出符合需求的決策，而不是一味推銷。',
  },
  {
    title: '持續更新',
    body: '市場快速變化，我們會定期複查文章，確保內容與推薦的準確性。',
  },
]

export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">關於我們</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          About Good Picks Lab
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
          我們幫你找到<br />真正值得買的東西。
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
          Good Picks Lab 是一個以內容為核心的產品評測部落格。我們花時間研究市場、比較規格、
          整理使用者回饋，讓你在購買前就能做出有根據的決定。
        </p>
      </header>

      {/* Mission */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          我們的使命
        </h2>
        <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 space-y-4 text-gray-600 leading-relaxed">
          <p>
            網路上充斥著大量的產品資訊，但真正有用的深度評測卻很少。
            我們的目標是填補這個空缺——提供結構清晰、立場公正的產品分析，
            幫助讀者把時間花在刀口上。
          </p>
          <p>
            我們不接受廠商贊助撰寫特定立場的文章。文章中出現的推薦，
            都是基於研究與評估後真心認為值得的產品。
          </p>
        </div>
      </section>

      {/* Pillars */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          我們怎麼做
        </h2>
        <div className="space-y-4">
          {PILLARS.map((p) => (
            <div
              key={p.title}
              className="flex gap-4 p-5 rounded-2xl border border-gray-200 bg-white shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            >
              <div className="mt-0.5 w-1.5 h-1.5 rounded-full bg-gray-900 shrink-0 mt-2" />
              <div>
                <p className="font-semibold text-gray-900 mb-1">{p.title}</p>
                <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Affiliate disclosure */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          Affiliate 聲明
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed bg-amber-50 border border-amber-100 rounded-xl p-5">
          本站部分連結為 affiliate 聯盟行銷連結。當你透過這些連結購買商品時，
          我們可能會獲得少量佣金，但這不會影響你的購買價格，
          也不影響我們對產品的評估立場。我們只推薦真正認為值得的產品。
        </p>
      </section>

      {/* Footer nav */}
      <footer className="pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <Link href="/contact" className="hover:text-gray-700 transition-colors">聯絡我們</Link>
        <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">隱私權政策</Link>
        <Link href="/terms" className="hover:text-gray-700 transition-colors">使用條款</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>

    </div>
  )
}
