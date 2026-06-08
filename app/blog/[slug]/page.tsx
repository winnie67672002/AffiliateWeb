import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs } from '@/lib/posts'

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

const CATEGORY_COLORS: Record<string, string> = {
  '3C產品': 'bg-blue-50 text-blue-600',
  '生產力工具': 'bg-violet-50 text-violet-600',
  '居家用品': 'bg-green-50 text-green-600',
  '辦公設備': 'bg-amber-50 text-amber-600',
  'AI工具': 'bg-rose-50 text-rose-600',
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const dateStr = new Date(post.date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-50 text-gray-500'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span>/</span>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <span>/</span>
        <span className="text-gray-600 truncate max-w-[200px]">{post.title}</span>
      </nav>

      <article>
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
              {post.category}
            </span>
            <time className="text-sm text-gray-400">{dateStr}</time>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 leading-tight tracking-tight mb-4">
            {post.title}
          </h1>
          <p className="text-lg text-gray-500 leading-relaxed border-l-4 border-gray-100 pl-4">
            {post.description}
          </p>
        </header>

        {/* Content */}
        <div className="prose" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-12 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-3 uppercase tracking-widest">標籤</p>
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs text-gray-500 bg-gray-50 border border-gray-100 px-3 py-1 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </footer>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-900 transition-colors"
          >
            ← 返回文章列表
          </Link>
        </div>
      </article>
    </div>
  )
}
