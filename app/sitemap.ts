import type { MetadataRoute } from 'next'
import { getAllSlugs, getAllPosts } from '@/lib/posts'
import { getAllLandingPageSlugs } from '@/content/landing'

const BASE_URL = 'https://goodpickslab.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  // ── 靜態頁面 ──────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL,               lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE_URL}/blog`,     lastModified: now, changeFrequency: 'weekly',  priority: 0.8 },
    { url: `${BASE_URL}/about`,    lastModified: now, changeFrequency: 'monthly', priority: 0.4 },
    { url: `${BASE_URL}/contact`,  lastModified: now, changeFrequency: 'monthly', priority: 0.3 },
    // 獨立靜態 landing page（行動電源推薦，主版本）
    {
      url: `${BASE_URL}/best-power-bank-iphone-2026`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
  ]

  // ── 動態 landing pages（/p/[slug]）────────────────────────
  // best-power-bank-iphone-2026 已有靜態主版本，canonical 指向它
  // 仍然列入 sitemap 讓 Google 發現 canonical 關係
  const landingPages: MetadataRoute.Sitemap = getAllLandingPageSlugs().map((slug) => ({
    url: `${BASE_URL}/p/${slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }))

  // ── Blog 文章（/[slug]）──────────────────────────────────
  const posts = getAllPosts()
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${BASE_URL}/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...staticPages, ...landingPages, ...blogPages]
}
