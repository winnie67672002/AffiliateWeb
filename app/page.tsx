import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

// 注意：只列出目前「已發布至少一篇文章」的分類。
// 生產力工具／辦公設備／AI工具目前底下全是草稿（published: false），
// 在那些分類真正有文章上線前，不放進這裡，避免導去空的分類頁。
const CATEGORIES = [
  { label: '3C產品',   icon: '💻', color: 'hover:border-blue-200   hover:bg-blue-50/50'   },
  { label: '生活用品推薦',  icon: '🏠', color: 'hover:border-emerald-200 hover:bg-emerald-50/50' },
]

const FEATURED_PICKS = [
  {
    icon: '🖱️',
    title: '滑鼠選購指南',
    desc: 'DPI、辦公室怎麼選、Mac 相容性、滑鼠 vs 觸控板，完整整理 + 5 款實測比較。',
    href: '/mouse',
    cta: '進入滑鼠專區',
  },
  {
    icon: '🔋',
    title: 'iPhone 行動電源推薦',
    desc: '實測 12+ 款 MagSafe 磁吸行動電源，Top 3 完整評比。',
    href: '/best-power-bank-iphone-2026',
    cta: '查看行動電源推薦',
  },
  {
    icon: '🖥️',
    title: '3C 生產力設備專區',
    desc: '滑鼠、鍵盤、行動電源選購指南總覽，依你的問題快速找到答案。',
    href: '/3c',
    cta: '進入 3C 專區',
  },
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
                href="/mouse"
                className="
                  inline-flex items-center gap-2
                  bg-white text-gray-700 text-sm font-medium
                  px-6 py-3 rounded-xl
                  border border-gray-200
                  hover:border-gray-300 hover:bg-gray-50
                  transition-all duration-150
                "
              >
                🖱️ 滑鼠選購指南
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

        {/* ── 精選導購（3C 主要 hub / pillar 頁）──────────────── */}
        <section className="py-12 border-b border-gray-100">
          <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
            精選導購
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {FEATURED_PICKS.map((pick) => (
              <Link
                key={pick.href}
                href={pick.href}
                className="
                  group flex flex-col gap-2 p-5
                  rounded-2xl border border-gray-200 bg-white
                  shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                  hover:shadow-md hover:-translate-y-0.5
                  transition-all duration-150
                "
              >
                <span className="text-2xl">{pick.icon}</span>
                <span className="font-semibold text-gray-900 text-sm group-hover:text-gray-600 transition-colors">
                  {pick.title}
                </span>
                <span className="text-xs text-gray-500 leading-relaxed flex-1">
                  {pick.desc}
                </span>
                <span className="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
                  {pick.cta} →
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
