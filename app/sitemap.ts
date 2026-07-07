import type { MetadataRoute } from 'next'
import {  getAllPosts } from '@/lib/posts'
import { MOUSE_CLUSTER_PAGES } from '@/lib/mouseCluster'

const BASE_URL = 'https://goodpickslab.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── 靜態頁面 ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`,  lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacy-policy`, lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${BASE_URL}/terms`,    lastModified: now, changeFrequency: 'yearly', priority: 0.2 },
    // 獨立靜態 landing page（行動電源推薦，主版本）
    {
      url: `${BASE_URL}/best-power-bank-iphone-2026`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    // ── 3C Topic Cluster：hub page ──────────────────────────
    { url: `${BASE_URL}/3c`,    lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/mouse`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  // ── 滑鼠 Topic Cluster 子頁（/mouse/[slug]）────────────────
  const mouseClusterPages: MetadataRoute.Sitemap = MOUSE_CLUSTER_PAGES.map((p) => ({
    url: `${BASE_URL}/mouse/${p.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // 注意：/p/[slug] 這個路由已經完全移除（改成 301/410 的 route handler），
  // 這裡不再輸出任何 /p/ 網址。原本兩個有實際內容的 slug
  // （best-power-bank-iphone-2026、best-wireless-mouse-productivity-2026）
  // 已經分別包含在上面的 staticPages 和下面的 blogPages 裡，canonical URL 不會漏掉。

  // ── Blog 文章（/[slug]）──────────────────────────────────
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const d = post.date ? new Date(post.date) : null
    return {
      url: `${BASE_URL}/${post.slug}`,
      lastModified: d && !isNaN(d.getTime()) ? d : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...mouseClusterPages, ...blogPages]
}
