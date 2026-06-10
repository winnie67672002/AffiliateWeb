import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
            G
          </span>
          <span className="font-semibold text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors">
            選好研究所 Good Picks Lab
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-md"
          >
            文章
          </Link>
        </nav>
      </div>
    </header>
  )
}
