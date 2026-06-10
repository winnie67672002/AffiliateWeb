import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

const CATEGORIES = [
  { label: '3C產品',   icon: '💻', color: 'hover:border-blue-200   hover:bg-blue-50/50'   },
  { label: '生產力工具', icon: '⚡', color: 'hover:border-violet-200 hover:bg-violet-50/50' },
  { label: '居家用品',  icon: '🏠', color: 'hover:border-emerald-200 hover:bg-emerald-50/50' },
  { label: '辦公設備',  icon: '🖥️', color: 'hover:border-amber-200  hover:bg-amber-50/50'  },
  { label: 'AI工具',   icon: '🤖', color: 'hover:border-rose-200   hover:bg-rose-50/50'   },
]

export default function HomePage() {
  const allPosts    = getAllPosts()
  const [first, ...rest] = allPosts
  const morePosts   = rest.slice(0, 4)

  return (
    <div>
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100">
        {/* subtle dot grid background */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-20 sm:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-widest text-gray-400 uppercase mb-5 border border-gray-200 px-3 py-1 rounded-full bg-white">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
              Good Picks Lab
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-[1.15] tracking-tight mb-5">
              真實體驗過的<br />
              <span className="text-gray-400 font-bold">好物推薦。</span>
            </h2>
            <p className="text-lg text-gray-500 leading-relaxed mb-8 max-w-lg">
              3C、生產力工具、居家好物——透過客觀的比較分析，幫你找到真正值得買的選擇。
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/blog"
                className="
                  inline-flex items-center gap-2
                  bg-gray-900 text-white text-sm font-semibold
                  px-6 py-3 rounded-xl
                  shadow-sm hover:shadow
                  hover:bg-gray-700
                  transition-all duration-150
                "
              >
                瀏覽所有評測
                <span>→</span>
              </Link>
              <Link
                href="/blog?category=AI工具"
                className="
                  inline-flex items-center gap-2
                  bg-white text-gray-700 text-sm font-medium
                  px-6 py-3 rounded-xl
                  border border-gray-200
                  hover:border-gray-300 hover:bg-gray-50
                  transition-all duration-150
                "
              >
                🤖 AI 工具推薦
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6">

        {/* ── Categories ───────────────────────────────────── */}
        <section className="py-12 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            分類瀏覽
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.label}
                href={`/blog?category=${encodeURIComponent(cat.label)}`}
                className={`
                  flex flex-col items-center gap-2.5 p-4
                  rounded-2xl border border-gray-200 bg-white
                  shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                  hover:shadow-sm hover:-translate-y-0.5
                  transition-all duration-150 group
                  ${cat.color}
                `}
              >
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-xs text-gray-600 font-medium group-hover:text-gray-900 transition-colors text-center leading-tight">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* ── Featured Post ─────────────────────────────────── */}
        {first && (
          <section className="py-12 border-b border-gray-100">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                編輯精選
              </h2>
            </div>
            <PostCard post={first} featured badge="editor" />
          </section>
        )}

        {/* ── Recent Posts grid ─────────────────────────────── */}
        {morePosts.length > 0 && (
          <section className="py-12">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                最新文章
              </h2>
              <Link
                href="/blog"
                className="text-sm text-gray-400 hover:text-gray-700 font-medium transition-colors"
              >
                全部文章 →
              </Link>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {morePosts.map((post, i) => (
                <PostCard key={post.slug} post={post} badge={i === 0 ? 'best' : undefined} />
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
