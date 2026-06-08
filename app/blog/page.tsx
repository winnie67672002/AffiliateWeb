import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = {
  title: '所有文章',
  description: '瀏覽 Good Picks Lab 所有好物推薦與產品評測文章。',
}

const CATEGORIES = ['3C產品', '生產力工具', '居家用品', '辦公設備', 'AI工具']

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const { category } = await searchParams
  const allPosts = getAllPosts()
  const posts = category
    ? allPosts.filter((p) => p.category === category)
    : allPosts

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">文章列表</h1>
        <p className="text-sm text-gray-400">{allPosts.length} 篇評測與推薦</p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/blog"
          className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
            !category
              ? 'bg-gray-900 text-white border-gray-900'
              : 'text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
          }`}
        >
          全部
        </Link>
        {CATEGORIES.map((cat) => (
          <Link
            key={cat}
            href={`/blog?category=${encodeURIComponent(cat)}`}
            className={`text-sm px-4 py-1.5 rounded-full border transition-colors ${
              category === cat
                ? 'bg-gray-900 text-white border-gray-900'
                : 'text-gray-500 border-gray-200 hover:border-gray-400 hover:text-gray-700'
            }`}
          >
            {cat}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-20 text-gray-300">
          <p className="text-4xl mb-3">📭</p>
          <p className="text-sm">此分類目前沒有文章</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  )
}
