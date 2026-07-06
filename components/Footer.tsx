import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="font-semibold text-gray-900 text-sm mb-1 block">
              Good Picks Lab
            </Link>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              分享實際使用過的好物、工具與數位產品。
            </p>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">分類</span>
              <Link href="/3c" className="hover:text-gray-900 transition-colors text-xs">3C 專區</Link>
              <Link href="/mouse" className="hover:text-gray-900 transition-colors text-xs">滑鼠選購指南</Link>
              <Link href="/blog?category=3C產品" className="hover:text-gray-900 transition-colors text-xs">3C產品</Link>
                  <Link href="/blog?category=生活用品推薦" className="hover:text-gray-900 transition-colors text-xs">生活用品推薦</Link>
              <Link href="/blog?category=生產力工具" className="hover:text-gray-900 transition-colors text-xs">生產力工具</Link>
              <Link href="/blog?category=AI工具" className="hover:text-gray-900 transition-colors text-xs">AI工具</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">關於</span>
              <Link href="/about" className="hover:text-gray-900 transition-colors text-xs">關於我們</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors text-xs">聯絡我們</Link>
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors text-xs">隱私權政策</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors text-xs">使用條款</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Good Picks Lab
          </p>
          <p className="text-xs text-gray-300">
            本站部分連結為聯盟行銷連結，購買時不影響您的價格。
          </p>
        </div>
      </div>
    </footer>
  )
}
