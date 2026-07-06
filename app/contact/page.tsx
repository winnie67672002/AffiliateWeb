import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: 'Contact',
  description: '有任何問題、合作洽詢或內容建議，歡迎透過 email 聯絡 Good Picks Lab。',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Contact | Good Picks Lab',
    description: '有任何問題、合作洽詢或內容建議，歡迎透過 email 聯絡 Good Picks Lab。',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-14">

      <BreadcrumbSchema items={[{ name: '首頁', url: '/' }, { name: '聯絡我們', url: '/contact' }]} />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">聯絡我們</span>
      </nav>

      {/* Header */}
      <header className="mb-12">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">
          Contact
        </p>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight mb-5">
          聯絡 Good Picks Lab
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
          有問題、建議或合作提案嗎？我們很樂意聽取你的意見。
        </p>
      </header>

      {/* Contact card */}
      <section className="mb-10">
        <div className="rounded-2xl border border-gray-200 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] p-8">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
            Email
          </p>
          <a
            href="mailto:contact@goodpickslab.com"
            className="inline-flex items-center gap-3 text-lg font-semibold text-gray-900 hover:text-gray-600 transition-colors group"
          >
            <span className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-xl group-hover:bg-gray-200 transition-colors">
              ✉️
            </span>
            contact@goodpickslab.com
          </a>

          <div className="mt-8 pt-6 border-t border-gray-100 space-y-3 text-sm text-gray-500">
            <p>
              <span className="font-medium text-gray-700">回覆時間：</span>
              通常在 2–3 個工作天內回覆。
            </p>
            <p>
              <span className="font-medium text-gray-700">適合聯絡的情況：</span>
              內容錯誤回報、產品建議、媒體或合作洽詢。
            </p>
            <p>
              <span className="font-medium text-gray-700">不適合的情況：</span>
              我們不接受付費業配或置入性行銷委託。
            </p>
          </div>
        </div>
      </section>

      {/* Topics */}
      <section className="mb-12">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">
          常見聯絡原因
        </h2>
        <div className="grid sm:grid-cols-2 gap-3">
          {[
            { icon: '📝', label: '內容錯誤或過時回報' },
            { icon: '💡', label: '產品推薦建議' },
            { icon: '🤝', label: '媒體與合作洽詢' },
            { icon: '🔍', label: '網站技術問題回報' },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-600"
            >
              <span className="text-lg">{item.icon}</span>
              {item.label}
            </div>
          ))}
        </div>
      </section>

      {/* Footer nav */}
      <footer className="pt-8 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <Link href="/about" className="hover:text-gray-700 transition-colors">關於我們</Link>
        <Link href="/privacy-policy" className="hover:text-gray-700 transition-colors">隱私權政策</Link>
        <Link href="/terms" className="hover:text-gray-700 transition-colors">使用條款</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>

    </div>
  )
}
