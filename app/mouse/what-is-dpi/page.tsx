import type { Metadata } from 'next'
import Link from 'next/link'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'
import FaqSchema from '@/components/schema/FaqSchema'
import FaqBlock from '@/components/FaqBlock'
import { MOUSE_PRODUCTS } from '@/lib/mouseCluster'

const FAQS = [
  {
    q: '滑鼠 DPI 越高越好嗎？',
    a: '不是。DPI 只代表游標移動的靈敏度，不是精準度或畫質。日常辦公 800–1,600 DPI 已經足夠；文書排版、瀏覽網頁不需要追求高 DPI。只有設計、修圖、高解析度多螢幕環境才需要 4,000 DPI 以上。',
  },
  {
    q: '辦公用滑鼠需要多少 DPI？',
    a: '一般辦公室使用建議 800–1,600 DPI，例如 Logitech MX Master 3S（200–8,000 DPI 可調）在辦公情境通常只需要設定在這個區間，太高的 DPI 反而會讓游標移動過於敏感、不好對齊視窗或按鈕。',
  },
  {
    q: 'DPI 和滑鼠感測器精度是同一件事嗎？',
    a: '不完全是。DPI 是「移動 1 英吋滑鼠、游標移動多少像素」的靈敏度設定，感測器精度（sensor accuracy）則是滑鼠實際追蹤移動軌跡的準確程度。高階感測器（如 Razer Pro Click V2 的 Focus Pro）在同樣 DPI 下，追蹤穩定度會比入門感測器更好。',
  },
  {
    q: '設計師或修圖需要多高的 DPI？',
    a: '從事 UI/UX 設計、修圖或影像剪輯的使用者，建議選擇 4,000 DPI 以上、且感測器等級較高的滑鼠，例如 Razer Pro Click V2（最高 30,000 DPI）。高 DPI 搭配高解析度螢幕，可以讓細部游標移動更精準，減少來回校正的次數。',
  },
]

export const metadata: Metadata = {
  title: '滑鼠 DPI 是什麼？多少才夠用？2026 完整說明',
  description:
    '滑鼠 DPI 是什麼？辦公、設計、遊戲分別需要多少 DPI？這篇用實際情境說明 DPI 的意義，並整理 2026 熱門無線滑鼠的 DPI 規格比較。',
  keywords: ['DPI是什麼', '滑鼠DPI推薦', '滑鼠靈敏度', '辦公滑鼠DPI'],
  alternates: {
    canonical: '/mouse/what-is-dpi',
  },
  openGraph: {
    title: '滑鼠 DPI 是什麼？多少才夠用？',
    description: '用實際使用情境說明滑鼠 DPI 的意義，並整理辦公、設計、遊戲各自建議的 DPI 範圍。',
    type: 'article',
  },
}

export default function WhatIsDpiPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <BreadcrumbSchema
        items={[
          { name: '首頁', url: '/' },
          { name: '3C', url: '/3c' },
          { name: '滑鼠', url: '/mouse' },
          { name: 'DPI 是什麼', url: '/mouse/what-is-dpi' },
        ]}
      />
      <FaqSchema faqs={FAQS} />

      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/mouse" className="hover:text-gray-700 transition-colors">滑鼠</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500">DPI 是什麼</span>
      </nav>

      <article>
        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            滑鼠 DPI 是什麼？多少才夠用？
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
            「這台滑鼠 8,000 DPI」聽起來很厲害，但大部分人其實完全用不到。這篇用實際使用情境說明 DPI 到底是什麼、
            怎麼影響操作體驗，以及辦公、設計、日常使用分別該注意什麼。
          </p>
        </header>

        <div className="prose prose-gray max-w-none">
          <h2>DPI 到底是什麼？</h2>
          <p>
            DPI（Dots Per Inch）是滑鼠感測器的靈敏度單位，代表「滑鼠移動 1 英吋，游標在螢幕上移動多少像素」。
            DPI 數字越高，代表滑鼠移動同樣距離時，游標移動的幅度越大、越靈敏；DPI 越低，則需要移動更長的實際距離，
            游標才會移動同樣的畫面距離。
          </p>
          <p>
            這跟「精準度」是兩件不同的事。DPI 只決定靈敏度，滑鼠實際追蹤移動軌跡準不準，取決於感測器本身的品質
            （sensor accuracy），跟 DPI 數字高低沒有直接關係。一顆便宜滑鼠即使標示 6,400 DPI，追蹤穩定度也不一定
            贏過中階滑鼠的 1,600 DPI。
          </p>

          <h2>不同使用情境該設定多少 DPI？</h2>
          <ul>
            <li><strong>一般辦公、文書處理：</strong>800–1,600 DPI 已經足夠，太高的 DPI 反而會讓游標難以精準停在小按鈕或視窗邊緣上。</li>
            <li><strong>多螢幕、高解析度環境：</strong>螢幕解析度越高，建議 DPI 也適度提高（約 1,600–3,200），減少移動滑鼠的距離。</li>
            <li><strong>設計、修圖、影像剪輯：</strong>建議 4,000 DPI 以上，並優先選擇感測器等級較高的滑鼠，細部操作會更穩定。</li>
            <li><strong>電競、快速反應遊戲：</strong>DPI 通常會依遊戲類型調整，同時更在意輪詢率與延遲，不在本篇辦公滑鼠的討論範圍內。</li>
          </ul>

          <h2>2026 熱門無線滑鼠 DPI 一覽</h2>
          <p>以下是我們實測比較過的 5 款無線滑鼠，DPI 範圍差異其實反映了它們鎖定的不同使用族群：</p>
        </div>

        <div className="rounded-2xl border border-gray-200 overflow-hidden shadow-sm my-6 not-prose">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">款式</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">DPI 範圍</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">適合情境</th>
                </tr>
              </thead>
              <tbody>
                {MOUSE_PRODUCTS.map((p, i) => (
                  <tr key={p.name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 text-xs font-medium text-gray-800">{p.name}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.dpi}</td>
                    <td className="px-4 py-3 text-xs text-gray-600">{p.bestFor}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="prose prose-gray max-w-none">
          <p>
            如果你只是一般辦公使用，不需要特別追求高 DPI 數字——先確認人體工學設計和靜音點擊是否符合需求，
            DPI 只要落在 800–1,600 這個常用區間就足夠。想看完整的產品推薦與實測比較，可以參考
            {' '}<Link href="/best-wireless-mouse-productivity-2026">2026 無線滑鼠推薦完整評測</Link>。
          </p>
        </div>

        <FaqBlock faqs={FAQS} />

        <section className="mt-12 pt-8 border-t border-gray-100">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">延伸閱讀</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Link href="/mouse/best-mouse-for-office" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              上班族滑鼠推薦：辦公室滑鼠怎麼選？ →
            </Link>
            <Link href="/mouse/best-mouse-for-mac" className="p-4 rounded-xl border border-gray-200 bg-white hover:shadow-sm transition-all text-sm font-medium text-gray-700 hover:text-gray-900">
              Mac 滑鼠怎麼選？ →
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
