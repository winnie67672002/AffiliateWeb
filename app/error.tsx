'use client'

import { useEffect } from 'react'
import Link from 'next/link'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-24 text-center">
      <p className="text-6xl mb-6">⚠️</p>
      <h1 className="text-2xl font-extrabold text-gray-900 mb-3">發生了一點問題</h1>
      <p className="text-sm text-gray-500 mb-8">
        這個頁面暫時無法載入，你可以重試一次，或回到首頁繼續瀏覽。
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-semibold px-6 py-3 rounded-xl shadow-sm hover:shadow hover:bg-gray-700 transition-all duration-150"
        >
          重新載入
        </button>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-white text-gray-700 text-sm font-medium px-6 py-3 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-150"
        >
          回到首頁
        </Link>
      </div>
    </div>
  )
}
