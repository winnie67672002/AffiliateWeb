import type { Metadata } from 'next'
import { getAllPosts } from '@/lib/posts'
import PostVisibilityManager from '@/components/PostVisibilityManager'

export const metadata: Metadata = {
  title: '文章顯示管理',
  robots: { index: false, follow: false },
}

// 這個頁面會即時讀取檔案系統，不要快取
export const dynamic = 'force-dynamic'

export default function AdminPostsPage() {
  const posts = getAllPosts({ includeUnpublished: true }).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    published: p.published !== false,
  }))

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-1">文章顯示管理</h1>
        <p className="text-sm text-gray-400">
          切換開關來決定文章要不要顯示在網站上。關閉後文章會從列表消失，網址也無法開啟。
        </p>
        <p className="text-xs text-gray-300 mt-2">
          共 {posts.length} 篇，{posts.filter((p) => p.published).length} 篇顯示中
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-sm text-gray-400">content/posts 資料夾裡還沒有任何文章。</p>
      ) : (
        <PostVisibilityManager initialPosts={posts} />
      )}
    </div>
  )
}
