import Link from 'next/link'
import type { PostMeta } from '@/lib/posts'

interface PostCardProps {
  post: PostMeta
}

const CATEGORY_COLORS: Record<string, string> = {
  '3C產品': 'bg-blue-50 text-blue-600',
  '生產力工具': 'bg-violet-50 text-violet-600',
  '居家用品': 'bg-green-50 text-green-600',
  '辦公設備': 'bg-amber-50 text-amber-600',
  'AI工具': 'bg-rose-50 text-rose-600',
}

export default function PostCard({ post }: PostCardProps) {
  const dateStr = new Date(post.date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-50 text-gray-500'

  return (
    <article className="group rounded-2xl border border-gray-100 bg-white hover:border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col">
      <Link href={`/blog/${post.slug}`} className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${colorClass}`}>
            {post.category}
          </span>
        </div>
        <h2 className="text-base font-semibold text-gray-900 mb-2 group-hover:text-gray-600 transition-colors leading-snug flex-1">
          {post.title}
        </h2>
        <p className="text-sm text-gray-400 leading-relaxed line-clamp-2 mb-4">
          {post.description}
        </p>
        <time className="text-xs text-gray-300 mt-auto">{dateStr}</time>
      </Link>
    </article>
  )
}
