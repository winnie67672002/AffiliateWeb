import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

const CATEGORIES = [
  { label: '3C產品', icon: '💻' },
  { label: '生產力工具', icon: '⚡' },
  { label: '居家用品', icon: '🏠' },
  { label: '辦公設備', icon: '🖥️' },
  { label: 'AI工具', icon: '🤖' },
]

export default function HomePage() {
  const recentPosts = getAllPosts().slice(0, 5)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-gray-50 via-white to-gray-100 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-xl">
            <span className="inline-block text-xs font-semibold tracking-widest text-gray-400 uppercase mb-4">
              Good Picks Lab
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 leading-tight tracking-tight mb-5">
              真實體驗，<br />
              <span className="text-gray-400">值得購買</span>的好物。
            </h1>
            <p className="text-lg text-gray-500 leading-relaxed mb-8">
              透過真實使用與研究比較，幫助你快速找到 3C、工具、生活好物中最值得入手的選擇。
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 bg-gray-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-gray-700 transition-colors"
              >
                瀏覽所有文章
                <span>→</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Categories */}
        <section className="py-12 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            分類瀏覽
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/blog?category=${encodeURIComponent(cat.label)}`}
                className="flex flex-col items-center gap-2 p-4 rounded-xl border border-gray-100 bg-white hover:border-gray-300 hover:shadow-sm transition-all group"
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors text-center">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
              最新文章
            </h2>
            <Link
              href="/blog"
              className="text-sm text-gray-400 hover:text-gray-700 transition-colors font-medium"
            >
              全部 →
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
