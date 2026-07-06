import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-6xl mb-6">🔍</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-3">找不到這個頁面</h1>
      <p className="text-sm text-gray-500 mb-8">
        這個網址可能已經失效或搬移了。你可以回到首頁，或看看下面幾個常見入口。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow hover:bg-gray-700 transition-all duration-150"
        >
          回到首頁 →
        </Link>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
        >
          瀏覽所有文章
        </Link>
        <Link
          href="/3c"
          className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
        >
          3C 專區
        </Link>
      </div>
    </div>
  )
}
