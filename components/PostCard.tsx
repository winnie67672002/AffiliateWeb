import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
  /** 顯示導購 badge（Best Pick 等）*/
  badge?: 'best' | 'editor' | 'recommended' | 'top' | 'new'
  /** 首頁 featured 大卡片模式 */
  featured?: boolean
}

const CATEGORY_COLORS: Record<string, string> = {
  '3C產品':   'bg-blue-50   text-blue-600   ring-1 ring-blue-100',
  '生產力工具': 'bg-violet-50 text-violet-600 ring-1 ring-violet-100',
  '居家用品':  'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100',
  '辦公設備':  'bg-amber-50  text-amber-600  ring-1 ring-amber-100',
  'AI工具':   'bg-rose-50   text-rose-600   ring-1 ring-rose-100',
}

const BADGE_STYLES: Record<string, { label: string; className: string }> = {
  best:        { label: '✦ Best Pick',       className: 'bg-amber-50  text-amber-700  ring-1 ring-amber-200'   },
  editor:      { label: "✦ Editor's Choice", className: 'bg-violet-50 text-violet-700 ring-1 ring-violet-200'  },
  recommended: { label: '✦ Recommended',     className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  top:         { label: '#1 Pick',           className: 'bg-rose-50   text-rose-700   ring-1 ring-rose-200'    },
  new:         { label: '✦ New',             className: 'bg-sky-50    text-sky-700    ring-1 ring-sky-200'     },
}

export default function PostCard({ post, badge, featured = false }: PostCardProps) {
  const dateStr = new Date(post.date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-50 text-gray-500 ring-1 ring-gray-100'

  if (featured) {
    return (
      <article className="
        group rounded-2xl border border-gray-200 bg-white
        shadow-sm hover:shadow-md
        hover:-translate-y-1
        transition-all duration-200
        overflow-hidden
      ">
        <Link href={`/${post.slug}`} className="flex flex-col p-6 h-full">
          <div className="flex items-center gap-2 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
              {post.category}
            </span>
            {badge && (
              <span className={`text-[0.65rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${BADGE_STYLES[badge]?.className}`}>
                {BADGE_STYLES[badge]?.label}
              </span>
            )}
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-600 transition-colors leading-snug">
            {post.title}
          </h2>
          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-5 flex-1">
            {post.description}
          </p>
          <div className="flex items-center justify-between mt-auto">
            <time className="text-xs text-gray-300">{dateStr}</time>
            <span className="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
              閱讀全文 →
            </span>
          </div>
        </Link>
      </article>
    )
  }

  return (
    <article className="
      group rounded-2xl border border-gray-200 bg-white
      shadow-[0_1px_4px_rgba(0,0,0,0.06)]
      hover:shadow-[0_6px_20px_rgba(0,0,0,0.09)]
      hover:-translate-y-1
      transition-all duration-200
      overflow-hidden flex flex-col
    ">
      <Link href={`/${post.slug}`} className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colorClass}`}>
            {post.category}
          </span>
          {badge && (
            <span className={`text-[0.65rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${BADGE_STYLES[badge]?.className}`}>
              {BADGE_STYLES[badge]?.label}
            </span>
          )}
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors leading-snug flex-1">
          {post.title}
        </h2>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <time className="text-xs text-gray-300">{dateStr}</time>
          <span className="text-xs font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
            閱讀 →
          </span>
        </div>
      </Link>
    </article>
  )
}
