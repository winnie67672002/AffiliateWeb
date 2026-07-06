import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'
import BreadcrumbSchema from '@/components/schema/BreadcrumbSchema'

export const metadata: Metadata = {
  title: '所有文章',
  description: '瀏覽 Good Picks Lab 所有好物推薦與產品評測文章，涵蓋 3C、生產力工具、生活用品與 AI 工具評測。',
  keywords: ['好物推薦', '產品評測', '3C推薦', '生活用品推薦'],
  alternates: {
    // ?category= 只是同一份內容的篩選檢視，canonical 統一指回 /blog，避免參數頁被視為重複內容
    canonical: '/blog',
  },
  openGraph: {
    title: '所有文章 | Good Picks Lab',
    description: '瀏覽 Good Picks Lab 所有好物推薦與產品評測文章。',
    type: 'website',
  },
}

const CATEGORIES = ['3C產品', '生產力工具', '生活用品推薦', '辦公設備', 'AI工具']

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allPosts = getAllPosts()
  const posts = category ? allPosts.filter((p) => p.category === category) : allPosts

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">

      <BreadcrumbSchema items={[{ name: '首頁', url: '/' }, { name: '文章', url: '/blog' }]} />

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">
          {category ?? '所有文章'}
        </h1>
        <p className="text-sm text-gray-400">
          {posts.length} 篇評測與推薦
        </p>
      </div>

      {/* Category Filter Pills */}
      <div className="flex flex-wrap gap-2 mb-10 pb-8 border-b border-gray-100">
        <Link
          href="/blog"
          className={`
            text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-150
            ${!category
              ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
              : 'text-gray-500 border-gray-200 bg-white hover:border-gray-400 hover:text-gray-800 hover:shadow-sm'}
          `}
        >
          全部
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={`
              text-sm font-medium px-4 py-1.5 rounded-full border transition-all duration-150
              ${category === cat
                ? 'bg-gray-900 text-white border-gray-900 shadow-sm'
                : 'text-gray-500 border-gray-200 bg-white hover:border-gray-400 hover:text-gray-800 hover:shadow-sm'}
            `}
          >
            {cat}
          </Link>
        ))}
      </div>

      {/* Posts */}
      {posts.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-5xl mb-4">📭</p>
          <p className="text-gray-400 text-sm">此分類目前沒有文章</p>
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard
              key={post.slug}
              post={post}
              badge={i === 0 ? 'best' : i === 1 ? 'recommended' : undefined}
            />
          ))}
        </div>
      )}

    </div>
  )
}
