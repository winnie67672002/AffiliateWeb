'use client'

import { useState } from 'react'

export interface AdminPostRow {
  slug: string
  title: string
  date: string
  category: string
  published: boolean
}

export default function PostVisibilityManager({ initialPosts }: { initialPosts: AdminPostRow[] }) {
  const [posts, setPosts] = useState(initialPosts)
  const [pendingSlug, setPendingSlug] = useState<string | null>(null)
  const [errorSlug, setErrorSlug] = useState<string | null>(null)

  async function toggle(slug: string, next: boolean) {
    setPendingSlug(slug)
    setErrorSlug(null)

    // 樂觀更新
    setPosts((prev) => prev.map((p) => (p.slug === slug ? { ...p, published: next } : p)))

    try {
      const res = await fetch(`/api/admin/posts/${slug}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ published: next }),
      })
      if (!res.ok) throw new Error('update failed')
    } catch {
      // 失敗就還原
      setPosts((prev) => prev.map((p) => (p.slug === slug ? { ...p, published: !next } : p)))
      setErrorSlug(slug)
    } finally {
      setPendingSlug(null)
    }
  }

  const dateStr = (d: string) =>
    new Date(d).toLocaleDateString('zh-TW', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="space-y-3">
      {posts.map((post) => (
        <div
          key={post.slug}
          className="
            flex items-center justify-between gap-4 p-4
            rounded-2xl border border-gray-200 bg-white
            shadow-[0_1px_4px_rgba(0,0,0,0.05)]
          "
        >
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-50 text-gray-500 ring-1 ring-gray-100">
                {post.category}
              </span>
              <time className="text-xs text-gray-300">{dateStr(post.date)}</time>
            </div>
            <p className="text-sm font-semibold text-gray-900 truncate">{post.title}</p>
            <p className="text-xs text-gray-400 mt-0.5">/{post.slug}</p>
            {errorSlug === post.slug && (
              <p className="text-xs text-rose-500 mt-1">更新失敗，請再試一次</p>
            )}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={post.published}
            disabled={pendingSlug === post.slug}
            onClick={() => toggle(post.slug, !post.published)}
            className={`
              relative shrink-0 inline-flex h-7 w-12 items-center rounded-full
              transition-colors duration-200 disabled:opacity-50
              ${post.published ? 'bg-gray-900' : 'bg-gray-200'}
            `}
          >
            <span
              className={`
                inline-block h-5 w-5 transform rounded-full bg-white shadow
                transition-transform duration-200
                ${post.published ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      ))}
    </div>
  )
}
