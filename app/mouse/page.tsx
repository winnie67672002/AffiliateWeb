import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import { MOUSE_PRODUCTS, MOUSE_CLUSTER_PAGES } from '@/lib/mouseCluster'

export const metadata: Metadata = {
  title: '滑鼠選購指南 2026｜DPI、辦公、Mac、觸控板一次搞懂',
  description:
    '滑鼠怎麼選？這裡整理了 DPI 是什麼、上班族滑鼠推薦、Mac 滑鼠怎麼選、滑鼠 vs 觸控板等常見搜尋問題，幫你找到最適合的無線滑鼠。',
  keywords: ['滑鼠推薦', '滑鼠怎麼選', '無線滑鼠推薦2026', 'DPI是什麼', 'Mac滑鼠推薦'],
  alternates: {
    canonical: '/mouse',
  },
  openGraph: {
    title: '滑鼠選購指南 2026｜DPI、辦公、Mac、觸控板一次搞懂',
    description: '滑鼠怎麼選？從 DPI、辦公使用到 Mac 相容性，一次整理常見搜尋問題。',
    type: 'website',
    images: [{ url: '/images/wireless-mouse-2026.jpg' }],
  },
}

export default function MouseHubPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '3C', url: '/3c' },
          { name: '滑鼠', url: '/mouse' },
        ]}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/3c" className="hover:text-gray-700 transition-colors">3C</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">滑鼠</span>
      </nav>

      {/* Hero */}
      <header className="mb-12">
        <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-widest border border-gray-200 px-3 py-1 rounded-full bg-white mb-4">
          滑鼠選購指南
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
          滑鼠怎麼選？<br />
          <span className="text-gray-400 font-bold">從 DPI 到 Mac 相容性一次搞懂</span>
        </h1>
        <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
          很多人買滑鼠只看外型和價格，用了才發現手腕痠、DPI 不夠精準，或是接上 Mac 之後某些按鍵失靈。
          這個專區把「滑鼠 DPI 是什麼」「上班族該買哪款」「Mac 適不適用」「滑鼠跟觸控板差在哪」這幾個最常被搜尋的問題整理成獨立文章，
          讀完可以直接對照下方的 2026 完整比較評測下單。
        </p>
      </header>

      {/* Cluster nav */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
          常見問題快速導覽
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {MOUSE_CLUSTER_PAGES.map((p) => (
            <Link
              key={p.slug}
              href={`/mouse/${p.slug}`}
              className="flex flex-col gap-1.5 p-5 rounded-2xl border border-gray-200 bg-white hover:shadow-md hover:-translate-y-0.5 transition-all duration-150 group"
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-gray-600 transition-colors leading-snug">
                {p.title}
              </span>
              <span className="text-xs text-gray-400 group-hover:text-gray-700 transition-colors">
                閱讀完整說明 →
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Quick product reference */}
      <section className="mb-16">
        <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">
          2026 無線滑鼠推薦一覽
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          以下規格整理自我們的完整實測評測文章，5 款滑鼠依使用情境分類。
        </p>
        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">款式</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">DPI</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">最適合</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">參考售價</th>
                </tr>
              </thead>
              <tbody>
                {MOUSE_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.dpi}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.bestFor}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <Link
          href="/best-wireless-mouse-productivity-2026"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow hover:bg-gray-700 transition-all duration-150"
        >
          看完整 5 款實測比較 →
        </Link>
      </section>

      {/* Footer nav */}
      <footer className="pt-6 border-t border-gray-100 flex flex-wrap gap-4 text-sm text-gray-400">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <Link href="/3c" className="hover:text-gray-700 transition-colors">3C 專區</Link>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">所有文章</Link>
        <span className="ml-auto text-gray-300">Good Picks Lab</span>
      </footer>
    </div>
  )
}
