# SEO 稽核原始資料彙整（Good Picks Lab / my-blog）

> 本文件僅蒐集、整理與 SEO 相關的程式碼、設定與檔案內容，不含分析或建議。
> 蒐集時間基準：專案目前狀態（2026-07）。

---

## 1. 專案資訊

- **Framework**：Next.js `16.2.7`（App Router，Turbopack）
- **UI Library**：React `19.2.4` / React DOM `19.2.4`
- **Router**：Next.js App Router（`app/` 目錄，非 Pages Router，專案中沒有 `pages/` 目錄）
- **渲染模式**：
  - 大部分頁面為 **Server Component**（預設），資料在伺服器端讀取檔案系統（`fs`）產生
  - 文章頁 `/[slug]` 與 landing page `/p/[slug]` 有 `generateStaticParams()` → 屬於 **SSG**（build time 產生靜態頁面），且未設定 `dynamicParams = false`，代表未在 `generateStaticParams` 名單中的路徑仍會在請求時動態產生（Next.js 預設 `dynamicParams: true`）
  - `/admin/posts` 明確設定 `export const dynamic = 'force-dynamic'`（每次請求即時讀取檔案系統，不快取）
  - `app/sitemap.ts`、`app/robots.ts` 為 Next.js 檔案慣例路由，執行期產生 `/sitemap.xml`、`/robots.txt`
  - 沒有使用 `revalidate`／ISR 設定（專案中未搜尋到 `revalidate` 關鍵字）
  - Client Component（`'use client'`）：`AnalyticsTracker.tsx`、`AdBanner.tsx`、`TrackedLink.tsx`、`AffiliateButton.tsx`、`PostVisibilityManager.tsx`
- **部署平台**：Vercel（依專案內 `朋友部署指南.md` 所述部署流程：`vercel` / `vercel --prod`）
- **Middleware**：專案中**沒有** `middleware.ts` 檔案

### package.json

```json
{
  "name": "my-blog",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@vercel/analytics": "^2.0.1",
    "gray-matter": "^4.0.3",
    "next": "16.2.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-markdown": "^10.1.0",
    "remark": "^15.0.1",
    "remark-directive": "^4.0.0",
    "remark-gfm": "^4.0.1",
    "remark-html": "^16.0.1",
    "unist-util-visit": "^5.1.0"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.7",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

export default nextConfig;
```

（沒有設定 `images`、`redirects`、`rewrites`、`headers`、`i18n` 等欄位，為 Next.js 預設空白設定檔）

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules"]
}
```

### Middleware

搜尋整個專案（含 `app/`、根目錄），**沒有找到** `middleware.ts` 或 `middleware.js` 檔案。

---

## 2. Head Metadata

### app/layout.tsx（Root Layout，含 root metadata）

```tsx
import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { Analytics } from '@vercel/analytics/react'

export const metadata: Metadata = {
  metadataBase: new URL('https://goodpickslab.com'),
  title: {
    default: 'Good Picks Lab',
    template: '%s | Good Picks Lab',
  },
  description: '分享實際使用過的好物、工具與數位產品，幫助你快速找到值得購買的商品。',
  keywords: ['好物推薦', '3C', '生產力工具', 'AI工具', '辦公設備'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Good Picks Lab',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<html lang="zh-TW" className="h-full">
  <body className="min-h-full flex flex-col bg-white">

    <Header />
    <main className="flex-1">{children}</main>
    <Footer />

    <Analytics />
    <AnalyticsTracker />

    {/* GA */}
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=AW-17789304314`}
      strategy="afterInteractive"
    />

    <Script id="gtag-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-17789304314', { send_page_view: false });
      `}
    </Script>

    {/* WebSite Schema（只留一個） */}
    <Script
      id="website-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "選好研究所",
          alternateName: "Good Picks Lab",
          url: "https://goodpickslab.com",
        }),
      }}
    />

    {/* Organization Schema */}
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "選好研究所",
          url: "https://goodpickslab.com",
          logo: "https://goodpickslab.com/logo.png",
        }),
      }}
    />

  </body>
</html>
  )
}
```

**沒有** `icons`、`alternates`、`canonical` 欄位設定。

### metadata / generateMetadata 各頁面清單

| 檔案 | 型式 | title | description | keywords | robots | canonical/alternates | openGraph | twitter | icons |
|---|---|---|---|---|---|---|---|---|---|
| `app/layout.tsx` | `export const metadata` | `{default:'Good Picks Lab', template:'%s \| Good Picks Lab'}` | ✅ | ✅ | ✅ `{index:true, follow:true}` | ❌ 無 | ✅（type/locale/siteName，無 title/description/images） | ✅（card only） | ❌ 無 |
| `app/page.tsx`（首頁） | 無 metadata export | 繼承 layout | 繼承 layout | 繼承 layout | 繼承 layout | 繼承 layout（無） | 繼承 layout | 繼承 layout | 無 |
| `app/blog/page.tsx` | `export const metadata` | `'所有文章'` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `app/[slug]/page.tsx`（文章頁） | `generateMetadata()` async | `post.title` | `post.description` | ❌ | ❌ | ❌ | ✅（title/description/type/publishedTime） | ❌ | ❌ |
| `app/blog/[slug]/page.tsx` | 純 redirect，無 metadata | - | - | - | - | - | - | - | - |
| `app/about/page.tsx` | `export const metadata` | `'About'` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `app/contact/page.tsx` | `export const metadata` | `'Contact'` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `app/privacy-policy/page.tsx` | `export const metadata` | `'Privacy Policy'` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `app/terms/page.tsx` | `export const metadata` | `'Terms of Service'` | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| `app/best-power-bank-iphone-2026/page.tsx` | `export const metadata` | ✅（自訂長標題） | ✅ | ✅（7 個關鍵字） | ❌ | ✅ `alternates: { canonical: '/best-power-bank-iphone-2026' }` | ✅（title/description/type） | ❌ | ❌ |
| `app/p/[slug]/page.tsx`（landing page） | `generateMetadata()` async | `page.title` | `page.description` | `page.keywords` | ❌ | ✅ `alternates: { canonical: page.canonicalOverride ?? '/p/${page.slug}' }` | ✅（title/description/type） | ❌ | ❌ |
| `app/admin/posts/page.tsx` | `export const metadata` | `'文章顯示管理'` | ❌ | ❌ | ✅ `{index:false, follow:false}` | ❌ | ❌ | ❌ | ❌ |

### app/[slug]/page.tsx 的 generateMetadata()

```tsx
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
```

### app/p/[slug]/page.tsx 的 generateMetadata()

```tsx
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLandingPage(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
    },
    alternates: {
      // 若 data 層設定了 canonicalOverride，優先指向該 URL（避免與同內容的靜態頁重複）
      canonical: page.canonicalOverride ?? `/p/${page.slug}`,
    },
  }
}
```

---

## 3. HTML Head（首頁）

因目前 sandbox 環境無法連線 `registry.npmjs.org` 下載 Next.js 16 Turbopack 所需的原生 SWC 執行檔（`next dev` 啟動後因缺少 `@next/swc-linux-x64-gnu` 而中斷），無法在此環境即時啟動伺服器擷取瀏覽器實際收到的 HTML。以下是**依照第 2 節蒐集到的 metadata 設定，依 Next.js Metadata API 解析規則推導出的首頁 `<head>` 內容**（非即時爬取結果）：

```html
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">

  <title>Good Picks Lab</title>
  <meta name="description" content="分享實際使用過的好物、工具與數位產品，幫助你快速找到值得購買的商品。">
  <meta name="keywords" content="好物推薦,3C,生產力工具,AI工具,辦公設備">
  <meta name="robots" content="index, follow">

  <!-- Open Graph（openGraph 未指定 title/description/images，Next 會 fallback 使用頁面 title/description） -->
  <meta property="og:title" content="Good Picks Lab">
  <meta property="og:description" content="分享實際使用過的好物、工具與數位產品，幫助你快速找到值得購買的商品。">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="zh_TW">
  <meta property="og:site_name" content="Good Picks Lab">
  <meta property="og:url" content="https://goodpickslab.com/">

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="Good Picks Lab">
  <meta name="twitter:description" content="分享實際使用過的好物、工具與數位產品，幫助你快速找到值得購買的商品。">

  <!-- favicon：沒有透過 metadata.icons 設定，Next.js 依檔案慣例抓 app/favicon.ico -->
  <link rel="icon" href="/favicon.ico" sizes="any">
</head>
```

**沒有出現在 `<head>` 的項目**：
- `<link rel="canonical">` — 首頁與 root layout 均未設定 `alternates.canonical`
- JSON-LD（WebSite / Organization schema）— 這兩段 `<script type="application/ld+json">` 是用 `next/script` 搭配 `strategy="afterInteractive"` 寫在 `app/layout.tsx` 的 `<body>` 內（Header/Footer 之後），**不在 `<head>` 裡**，且會在 hydration 後才被注入

---

## 4. Sitemap ／ Robots

### app/sitemap.ts

```ts
import type { MetadataRoute } from 'next'
import {  getAllPosts } from '@/lib/posts'
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
  const blogPages: MetadataRoute.Sitemap = posts.map((post) => {
    const d = post.date ? new Date(post.date) : null
    return {
      url: `${BASE_URL}/${post.slug}`,
      lastModified: d && !isNaN(d.getTime()) ? d : now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }
  })

  return [...staticPages, ...landingPages, ...blogPages]
}
```

備註：`getAllPosts()` 呼叫時**未帶 `includeUnpublished` 參數**，因此目前實作下，`published: false` 的文章不會出現在 sitemap 中。

### app/robots.ts

```ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: 'https://goodpickslab.com/sitemap.xml',
  }
}
```

### 靜態 sitemap.xml / robots.txt

專案目錄中**沒有**靜態的 `public/sitemap.xml` 或 `public/robots.txt` 檔案；兩者皆由上述 `app/sitemap.ts`、`app/robots.ts` 在請求時（或 build 時）由 Next.js 檔案慣例路由動態產生。

---

## 5. 結構化資料（Schema / JSON-LD）

專案中搜尋到的 JSON-LD 只有以下兩處檔案、共三種 `@type`：

### 5.1 WebSite Schema（`app/layout.tsx`，所有頁面共用）

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "選好研究所",
  "alternateName": "Good Picks Lab",
  "url": "https://goodpickslab.com"
}
```

### 5.2 Organization Schema（`app/layout.tsx`，所有頁面共用）

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "選好研究所",
  "url": "https://goodpickslab.com",
  "logo": "https://goodpickslab.com/logo.png"
}
```

### 5.3 Article Schema（含 nested Product/Offer，`app/[slug]/page.tsx`，每篇文章頁）

```tsx
<Script
  id="article-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      author: { '@type': 'Organization', name: 'Good Picks Lab' },
      mainEntity: post.affiliate?.map((item) => ({
        '@type': 'Product',
        name: item.name,
        description: item.description,
        offers: {
          '@type': 'Offer',
          url: item.href,
          price: item.price ?? '0',
          priceCurrency: 'TWD',
        },
      })),
    }),
  }}
/>
```

（此 `<Script>` 沒有指定 `strategy`，屬於 Next.js 預設策略）

### 5.4 沒有找到的 Schema 類型

以下類型在整個專案（`app/`、`components/`、`lib/`、`content/`）中**搜尋不到任何 JSON-LD 實作**：
- `BreadcrumbList`（各頁面雖有視覺化 `<nav>` 麵包屑，但沒有對應結構化資料）
- `FAQPage`（`best-power-bank-iphone-2026/page.tsx` 與 `LandingPageTemplate.tsx` 都有 `<details>` FAQ 區塊，但沒有 `FAQPage` JSON-LD）
- `LocalBusiness`
- 獨立的 `Product` 頂層 schema（目前 `Product` 只以 `mainEntity` 巢狀在 `Article` 內，`p/[slug]` landing page 與 `best-power-bank-iphone-2026` 頁面都沒有任何 JSON-LD）

---

## 6. 首頁：app/page.tsx（完整內容）

```tsx
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

const CATEGORIES = [
  { label: '3C產品',   icon: '💻', color: 'hover:border-blue-200   hover:bg-blue-50/50'   },
  { label: '生產力工具', icon: '⚡', color: 'hover:border-violet-200 hover:bg-violet-50/50' },
  { label: '生活用品推薦',  icon: '🏠', color: 'hover:border-emerald-200 hover:bg-emerald-50/50' },
  { label: '辦公設備',  icon: '🖥️', color: 'hover:border-amber-200  hover:bg-amber-50/50'  },
  { label: 'AI工具',   icon: '🤖', color: 'hover:border-rose-200   hover:bg-rose-50/50'   },
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
                href="/blog?category=AI工具"
                className="
                  inline-flex items-center gap-2
                  bg-white text-gray-700 text-sm font-medium
                  px-6 py-3 rounded-xl
                  border border-gray-200
                  hover:border-gray-300 hover:bg-gray-50
                  transition-all duration-150
                "
              >
                🤖 AI 工具推薦
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
```

（此頁沒有 `metadata` 或 `generateMetadata` export，`<head>` 完全繼承 root layout）

---

## 7. 文章頁

Blog 文章實際的渲染頁面是 `app/[slug]/page.tsx`（不是 `app/blog/[slug]/page.tsx`）。`app/blog/[slug]/page.tsx` 只是一個轉址頁。

### app/[slug]/page.tsx（完整內容，含 generateStaticParams 與 generateMetadata）

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import Script from 'next/script'
import { notFound } from 'next/navigation'
import { getPostBySlug, getAllSlugs, getRelatedPosts } from '@/lib/posts'
import PostContent from '@/components/PostContent'

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
  '3C產品':    'bg-blue-50   text-blue-600   ring-1 ring-blue-200',
  '生產力工具':  'bg-violet-50 text-violet-600 ring-1 ring-violet-200',
  '居家用品':   'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200',
  '辦公設備':   'bg-amber-50  text-amber-600  ring-1 ring-amber-200',
  'AI工具':    'bg-rose-50   text-rose-600   ring-1 ring-rose-200',
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const relatedPosts = getRelatedPosts(post.slug, post.category)

  const dateStr = new Date(post.date).toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const colorClass = CATEGORY_COLORS[post.category] ?? 'bg-gray-50 text-gray-500 ring-1 ring-gray-200'

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">

      {/* Schema.org */}
      <Script
        id="article-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: { '@type': 'Organization', name: 'Good Picks Lab' },
            mainEntity: post.affiliate?.map((item) => ({
              '@type': 'Product',
              name: item.name,
              description: item.description,
              offers: {
                '@type': 'Offer',
                url: item.href,
                price: item.price ?? '0',
                priceCurrency: 'TWD',
              },
            })),
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-8">
        <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
        <span className="text-gray-200">/</span>
        <Link href="/blog" className="hover:text-gray-700 transition-colors">文章</Link>
        <span className="text-gray-200">/</span>
        <span className="text-gray-500 truncate max-w-[220px]">{post.title}</span>
      </nav>

      <article>
        {/* ── Article Header ──────────────────────────────── */}
        <header className="mb-10">
          <div className="flex items-center gap-2.5 mb-4">
            <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${colorClass}`}>
              {post.category}
            </span>
            <time className="text-sm text-gray-400">{dateStr}</time>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight tracking-tight mb-5">
            {post.title}
          </h1>

          <p className="text-lg text-gray-500 leading-relaxed border-l-[3px] border-gray-200 pl-4">
            {post.description}
          </p>
        </header>

        {/* ── Article Body (with inline affiliate cards) ──── */}
        <PostContent content={post.content} affiliate={post.affiliate} />

        {/* ── Tags ────────────────────────────────────────── */}
        {post.tags && post.tags.length > 0 && (
          <footer className="mt-10 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">標籤</p>
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

        {/* ── Related Posts ───────────────────────────────── */}
        {relatedPosts.length > 0 && (
          <section className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-5">
              你可能也會喜歡
            </p>
            <div className="space-y-3">
              {relatedPosts.map((p) => (
                <Link
                  key={p.slug}
                  href={`/${p.slug}`}
                  className="
                    flex items-start gap-4 p-4
                    rounded-xl border border-gray-200 bg-white
                    shadow-[0_1px_4px_rgba(0,0,0,0.05)]
                    hover:shadow-md hover:-translate-y-0.5
                    transition-all duration-150 group
                  "
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors text-sm leading-snug mb-0.5">
                      {p.title}
                    </p>
                    <p className="text-xs text-gray-400 line-clamp-1">{p.description}</p>
                  </div>
                  <span className="text-gray-300 group-hover:text-gray-600 transition-colors text-sm mt-0.5 shrink-0">→</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* ── Back link ───────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-gray-100">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            ← 返回文章列表
          </Link>
        </div>

      </article>
    </div>
  )
}
```

### app/blog/[slug]/page.tsx（純轉址）

```tsx
import { redirect } from 'next/navigation'

export default async function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/${slug}`)
}
```

### app/blog/page.tsx（文章列表頁）

```tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllPosts } from '@/lib/posts'
import PostCard from '@/components/PostCard'

export const metadata: Metadata = {
  title: '所有文章',
  description: '瀏覽 Good Picks Lab 所有好物推薦與產品評測文章。',
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
```

### lib/posts.ts（資料層：getAllPosts / getPostBySlug / getAllSlugs，含 published 過濾）

```ts
import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'

const postsDirectory = path.join(process.cwd(), 'content/posts')

export interface AffiliateItem {
  id: string
  name: string
  description: string
  href: string
  badge?: string
  badgeVariant?: 'best' | 'editor' | 'recommended' | 'top' | 'sale'
  price?: string
  image?: string
}

export interface PostFrontmatter {
  title: string
  description: string
  date: string
  category: string
  tags?: string[]
  coverImage?: string
  affiliate?: AffiliateItem[]
  /** 是否顯示在網站上，預設為 true（未設定時視為已發佈） */
  published?: boolean
}

export interface PostMeta extends PostFrontmatter {
  slug: string
}

export interface Post extends PostMeta {
  content: string
}

interface QueryOptions {
  /** 是否包含已關閉（隱藏）的文章，預設 false */
  includeUnpublished?: boolean
}

function ensureDirectory() {
  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true })
  }
}

function readPostFile(fileName: string): Post {
  const slug = fileName.replace(/\.md$/, '')
  const fullPath = path.join(postsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  const frontmatter = data as PostFrontmatter
  const published = frontmatter.published !== false

  return { slug, ...frontmatter, published, content }
}

export function getAllPosts(options: QueryOptions = {}): PostMeta[] {
  ensureDirectory()
  const fileNames = fs.readdirSync(postsDirectory).filter((f) => f.endsWith('.md'))

  const posts = fileNames.map((fileName) => {
    const { content: _content, ...meta } = readPostFile(fileName)
    return meta
  })

  const filtered = options.includeUnpublished ? posts : posts.filter((p) => p.published)

  return filtered.sort((a, b) => (a.date < b.date ? 1 : -1))
}

export async function getPostBySlug(slug: string, options: QueryOptions = {}): Promise<Post | null> {
  ensureDirectory()
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return null

  const post = readPostFile(`${slug}.md`)

  if (!post.published && !options.includeUnpublished) return null

  return post
}

export function getAllSlugs(options: QueryOptions = {}): string[] {
  return getAllPosts(options).map((p) => p.slug)
}

//內部連結系統
export function getRelatedPosts(currentSlug: string, category: string) {
  const posts = getAllPosts()

  return posts
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, 3)
}

export function setPostPublished(slug: string, published: boolean): boolean {
  ensureDirectory()
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  if (!fs.existsSync(fullPath)) return false

  const raw = fs.readFileSync(fullPath, 'utf8')
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return false

  const frontmatterBlock = match[1]
  const publishedLine = `published: ${published}`

  const newFrontmatterBlock = /^published:.*$/m.test(frontmatterBlock)
    ? frontmatterBlock.replace(/^published:.*$/m, publishedLine)
    : `${frontmatterBlock}\n${publishedLine}`

  const newRaw = raw.replace(match[0], `---\n${newFrontmatterBlock}\n---`)
  fs.writeFileSync(fullPath, newRaw, 'utf8')
  return true
}
```

### app/p/[slug]/page.tsx（動態 landing page，另一種「文章頁」）

```tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getLandingPage, getAllLandingPageSlugs } from '@/content/landing'
import LandingPageTemplate from '@/components/LandingPageTemplate'

export function generateStaticParams() {
  return getAllLandingPageSlugs().map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const page = getLandingPage(slug)
  if (!page) return {}
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    openGraph: {
      title: page.title,
      description: page.description,
      type: 'article',
    },
    alternates: {
      // 若 data 層設定了 canonicalOverride，優先指向該 URL（避免與同內容的靜態頁重複）
      canonical: page.canonicalOverride ?? `/p/${page.slug}`,
    },
  }
}

export default async function LandingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const page = getLandingPage(slug)
  if (!page) notFound()

  return <LandingPageTemplate page={page} />
}
```

目前 `content/posts/` 底下的文章檔（`.md`，共 9 篇）：

```
ai-tools-for-work.md
air-fryer-buying-guide-2026.md
best-productivity-tools-2024.md
best-wireless-mouse-productivity-2026.md
eco-friendly-cup-buying-guide-2026.md
five-power-bank-guide.md
how-to-choose-keyboard.md
mechanical-keyboard-guide.md
stainless-cookware-buying-guide-2026.md
```

`content/landing/` 底下的 landing page slug（`getAllLandingPageSlugs()` 來源）：

```
content/landing/power-bank.ts            → slug: 'best-power-bank-iphone-2026'
content/landing/stainless-cookware.ts    → slug: 'stainless-cookware-buying-guide-2026'
content/landing/wireless-mouse.ts        → slug: 'best-wireless-mouse-productivity-2026'
```

（可觀察到 `stainless-cookware-buying-guide-2026` 與 `best-wireless-mouse-productivity-2026` 這兩個 slug，同時存在於 `content/posts/*.md` 與 `content/landing/*.ts` 兩處資料來源中）

---

## 8. URL 結構（所有 Route）

依 `app/` 目錄檔案系統掃描結果：

```
/                                   app/page.tsx
/about                              app/about/page.tsx
/contact                            app/contact/page.tsx
/privacy-policy                     app/privacy-policy/page.tsx
/terms                              app/terms/page.tsx
/blog                               app/blog/page.tsx            （支援 ?category= query）
/blog/[slug]                        app/blog/[slug]/page.tsx     （redirect → /[slug]）
/[slug]                             app/[slug]/page.tsx           （文章頁，動態）
/best-power-bank-iphone-2026        app/best-power-bank-iphone-2026/page.tsx  （獨立靜態 landing page）
/p/[slug]                           app/p/[slug]/page.tsx         （動態 landing page）
/admin/posts                        app/admin/posts/page.tsx      （文章顯示管理，robots disallow）
/api/admin/posts                    app/api/admin/posts/route.ts           （GET）
/api/admin/posts/[slug]             app/api/admin/posts/[slug]/route.ts    （PATCH）
/sitemap.xml                        app/sitemap.ts                （檔案慣例路由）
/robots.txt                         app/robots.ts                 （檔案慣例路由）
```

---

## 9. Images

### next/image 使用位置

`grep` 搜尋 `next/image` 匯入，出現在以下檔案：

1. `components/AffiliateCard.tsx`
2. `components/LandingPageTemplate.tsx`
3. `app/best-power-bank-iphone-2026/page.tsx`

三處用法幾乎相同，皆為固定尺寸 `width={112} height={112}`：

```tsx
<Image
  src={product.image}
  alt={product.name}
  width={112}
  height={112}
  className="w-full h-full object-cover"
/>
```

沒有觀察到 `fill`、`priority`、`sizes`、`placeholder="blur"` 等其他 `next/image` 進階屬性的使用。

### 部落格文章內文圖片

`components/PostContent.tsx` 使用 `react-markdown` 渲染 markdown 內容，**沒有**針對 `img` 自訂 `components` 對應（只自訂了 `affiliate-card`），因此文章內文中以 markdown 語法 `![alt文字](/path.jpg)` 插入的圖片（例如各篇文章開頭的 `![xxx](/images/xxx.jpg)`），會由 `react-markdown` 輸出成一般 `<img>` 標籤，**不會**經過 `next/image` 最佳化。

### alt 屬性

- `AffiliateCard.tsx` / `LandingPageTemplate.tsx` / `best-power-bank-iphone-2026/page.tsx` 的 `next/image`：`alt={product.name}` / `alt={name}`（皆有內容，非空字串）
- 文章 markdown 圖片：`alt` 文字取決於每篇文章 `.md` 檔中 `![]()` 語法內的文字內容（例如 `air-fryer-buying-guide-2026.md` 中為 `![空氣炸鍋推薦2026](/images/air-fryer-2026.jpg)`）

### public/images 目錄檔案清單

```
public/file.svg
public/globe.svg
public/images/Keychron_k2.jpg
public/images/Logitech_MX_Keys.jpg
public/images/air-fryer-2026.jpg
public/images/anker-maggo.jpg
public/images/cosori-af606.jpg
public/images/cw-slim.jpg
public/images/guobao-af6071.jpg
public/images/jv3c.jpg
public/images/lapo.jpg
public/images/m720-triathlon.jpg
public/images/mx-anywhere-3s.jpg
public/images/mx-master-3s.jpg
public/images/one-meter-glass.jpg
public/images/pebble-m350s.jpg
public/images/philips-na110.jpg
public/images/philips-na221.jpg
public/images/power_bank_index.png
public/images/powerbank-30000.jpg
public/images/razer-pro-click.jpg
public/images/razer-pro-click.webp
public/images/stainless-cookware-2026.jpg
public/images/test.jpeg
public/images/wireless-mouse-2026.jpg
public/next.svg
public/vercel.svg
public/window.svg
```

（`next.config.ts` 未設定任何 `images` 相關選項，例如 `domains`、`remotePatterns`、`formats` 等，皆為 Next.js 預設值）

---

## 10. Loading

- `loading.tsx`：專案中**沒有找到**任何 `loading.tsx` 檔案（`app/` 目錄下無此檔案）
- `error.tsx` / `not-found.tsx`：同樣**沒有找到**
- `Suspense`：只在 `components/AnalyticsTracker.tsx` 中使用，用途是包住依賴 `useSearchParams()` 的子元件：

```tsx
'use client'

import { useEffect, Suspense } from 'react'
import { usePathname, useSearchParams } from 'next/navigation'
import { pageview } from '@/lib/gtag'

function TrackerInner() {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  useEffect(() => {
    const qs = searchParams.toString()
    pageview(pathname + (qs ? `?${qs}` : ''))
  }, [pathname, searchParams])

  return null
}

export default function AnalyticsTracker() {
  return (
    <Suspense fallback={null}>
      <TrackerInner />
    </Suspense>
  )
}
```

- `next/dynamic`：搜尋整個專案，**沒有找到**任何 `dynamic()` 動態載入元件的用法

---

## 11. Links

### components/Header.tsx（完整內容）

```tsx
import Link from 'next/link'

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
            G
          </span>
          <span className="font-semibold text-gray-900 tracking-tight group-hover:text-gray-600 transition-colors">
            選好研究所 Good Picks Lab
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          <Link
            href="/blog"
            className="text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-100 transition-colors px-3 py-1.5 rounded-md"
          >
            文章
          </Link>
          <Link
            href="/best-power-bank-iphone-2026"
            className="text-sm font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors px-3 py-1.5 rounded-md"
          >
            ✦ 精選
          </Link>
        </nav>
      </div>
    </header>
  )
}
```

### components/Footer.tsx（完整內容）

```tsx
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-auto">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-6 mb-8">
          <div>
            <Link href="/" className="font-semibold text-gray-900 text-sm mb-1 block">
              Good Picks Lab
            </Link>
            <p className="text-xs text-gray-400 max-w-xs leading-relaxed">
              分享實際使用過的好物、工具與數位產品。
            </p>
          </div>
          <div className="flex gap-8 text-sm text-gray-500">
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">分類</span>
              <Link href="/blog?category=3C產品" className="hover:text-gray-900 transition-colors text-xs">3C產品</Link>
                  <Link href="/blog?category=生活用品推薦" className="hover:text-gray-900 transition-colors text-xs">生活用品推薦</Link>
              <Link href="/blog?category=生產力工具" className="hover:text-gray-900 transition-colors text-xs">生產力工具</Link>
              <Link href="/blog?category=AI工具" className="hover:text-gray-900 transition-colors text-xs">AI工具</Link>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">關於</span>
              <Link href="/about" className="hover:text-gray-900 transition-colors text-xs">關於我們</Link>
              <Link href="/contact" className="hover:text-gray-900 transition-colors text-xs">聯絡我們</Link>
              <Link href="/privacy-policy" className="hover:text-gray-900 transition-colors text-xs">隱私權政策</Link>
              <Link href="/terms" className="hover:text-gray-900 transition-colors text-xs">使用條款</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Good Picks Lab
          </p>
          <p className="text-xs text-gray-300">
            本站部分連結為聯盟行銷連結，購買時不影響您的價格。
          </p>
        </div>
      </div>
    </footer>
  )
}
```

### Breadcrumb（視覺化，非結構化資料）

出現在：`app/[slug]/page.tsx`、`app/about/page.tsx`、`app/contact/page.tsx`、`app/privacy-policy/page.tsx`、`app/terms/page.tsx`、`app/best-power-bank-iphone-2026/page.tsx`、`components/LandingPageTemplate.tsx`。統一模式（以 `about` 頁為例）：

```tsx
<nav className="flex items-center gap-1.5 text-sm text-gray-400 mb-10">
  <Link href="/" className="hover:text-gray-700 transition-colors">首頁</Link>
  <span className="text-gray-200">/</span>
  <span className="text-gray-500">關於我們</span>
</nav>
```

皆為純 HTML `<nav>` + `Link`，**沒有** `BreadcrumbList` JSON-LD 對應。

### 是否使用 Link Component

- **內部連結**：全部使用 `next/link` 的 `<Link>` 元件（Header、Footer、各頁面 breadcrumb、PostCard、內文相關文章連結等）
- **外部／聯盟行銷連結**：全部使用原生 `<a>` 標籤，並統一加上 `target="_blank" rel="nofollow sponsored noopener noreferrer"`，出現在：
  - `components/AffiliateButton.tsx`
  - `components/AffiliateCard.tsx`（卡片內的購買按鈕）
  - `components/TrackedLink.tsx`
  - `app/best-power-bank-iphone-2026/page.tsx` 內的快速推薦對照區塊

```tsx
// components/AffiliateButton.tsx
'use client'

import { affiliateClick } from '@/lib/gtag'

interface AffiliateButtonProps {
  href: string
  productName: string
  children: React.ReactNode
  className?: string
}

export default function AffiliateButton({
  href,
  productName,
  children,
  className = '',
}: AffiliateButtonProps) {
  function handleClick() {
    affiliateClick({ productName, href })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        bg-gray-900 text-white font-semibold text-sm
        px-6 py-3 rounded-xl no-underline
        shadow-sm hover:shadow hover:bg-gray-700 active:bg-gray-800
        transition-all duration-150
        ${className}
      `}
    >
      {children}
    </a>
  )
}
```

```tsx
// components/TrackedLink.tsx
'use client'

import { trackAffiliateClick } from '@/lib/trackAffiliate'

interface Props {
  href: string
  children: React.ReactNode
  className?: string
  label?: string
}

export default function TrackedLink({ href, children, className, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={() => trackAffiliateClick(href, label)}
    >
      {children}
    </a>
  )
}
```

---

## 12. Performance

### dynamic import

搜尋整個專案，**沒有找到** `next/dynamic` 或 `dynamic()` 的使用。

### Script strategy

`app/layout.tsx` 中使用 `next/script`，兩個 GA 相關 script 皆為 `strategy="afterInteractive"`：

```tsx
<Script
  src={`https://www.googletagmanager.com/gtag/js?id=AW-17789304314`}
  strategy="afterInteractive"
/>

<Script id="gtag-init" strategy="afterInteractive">
  {`...`}
</Script>
```

WebSite / Organization JSON-LD 兩個 `<Script>` 也是 `strategy="afterInteractive"`。

`app/[slug]/page.tsx` 中的 Article JSON-LD `<Script>` **沒有指定 `strategy`**（使用 Next.js 預設值）。

### Fonts

搜尋整個專案 `next/font` 關鍵字，**沒有找到**任何使用紀錄。`app/layout.tsx` 只 `import './globals.css'`，沒有 `next/font/google` 或 `next/font/local` 的字體載入或最佳化設定。

### Analytics / 第三方 Script

| 服務 | 是否使用 | 位置 / 說明 |
|---|---|---|
| Google Ads / GA（gtag.js） | ✅ | `app/layout.tsx`，追蹤 ID `AW-17789304314` |
| Vercel Analytics | ✅ | `app/layout.tsx` 中 `<Analytics />`（`@vercel/analytics/react`） |
| Google Tag Manager（GTM 容器） | ❌ 未找到 | 只找到 `googletagmanager.com/gtag/js`（gtag，非 GTM 容器 `gtm.js`） |
| Microsoft Clarity | ❌ 未找到 | - |
| Google AdSense | ⚠️ 元件存在但未掛載 | `components/AdBanner.tsx` 讀取 `process.env.NEXT_PUBLIC_ADSENSE_ID`，但 `grep` 全專案 `AdBanner` 使用處，只有它自己的定義檔，沒有任何頁面 `import AdBanner` 並渲染它 |
| 其他（Facebook Pixel、Hotjar、Mixpanel 等） | ❌ 未找到 | - |

### components/AdBanner.tsx（完整內容）

```tsx
'use client'

import { useEffect, useRef } from 'react'

interface AdBannerProps {
  slot: string
  format?: 'auto' | 'rectangle' | 'horizontal' | 'vertical'
  className?: string
}

declare global {
  interface Window {
    adsbygoogle: unknown[]
  }
}

export default function AdBanner({ slot, format = 'auto', className = '' }: AdBannerProps) {
  const adRef = useRef<HTMLModElement>(null)
  const initialized = useRef(false)

  useEffect(() => {
    if (initialized.current) return
    initialized.current = true
    try {
      ;(window.adsbygoogle = window.adsbygoogle || []).push({})
    } catch {
      // AdSense not loaded in dev
    }
  }, [])

  return (
    <div className={`overflow-hidden ${className}`} aria-label="廣告">
      <ins
        ref={adRef}
        className="adsbygoogle block"
        data-ad-client={process.env.NEXT_PUBLIC_ADSENSE_ID}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  )
}
```

專案中**沒有** `.env` / `.env.local` 檔案，因此 `NEXT_PUBLIC_ADSENSE_ID` 目前沒有可對照的實際值。

### lib/gtag.ts（完整內容）

```ts
export const GTAG_ID = 'AW-17789304314'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function pageview(url: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('config', GTAG_ID, { page_path: url })
}

export interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export function event({ action, category, label, value }: GtagEvent): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function affiliateClick({
  productName,
  href,
}: {
  productName: string
  href: string
}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  // GA4 自訂事件（在 GA4 後台把這個事件標記為轉換，再匯入 Google Ads）
  window.gtag('event', 'affiliate_click', {
    product_name: productName,
    outbound_url: href,
  })
}
```

### lib/trackAffiliate.ts（完整內容）

```ts
import { event } from './gtag'

export function trackAffiliateClick(url: string, label?: string): void {
  event({
    action: 'click',
    category: 'outbound',
    label: label ?? url,
  })
}
```

---

## 13. robots（同第 4 節）

```ts
// app/robots.ts
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin', '/api'],
    },
    sitemap: 'https://goodpickslab.com/sitemap.xml',
  }
}
```

沒有另外的靜態 `public/robots.txt` 檔案。

---

## 14. Sitemap（同第 4 節，完整清單）

`app/sitemap.ts` 產生的項目分三類：

**靜態頁（5 筆）**
```
/                                    priority 1.0  weekly
/blog                                priority 0.8  weekly
/about                               priority 0.4  monthly
/contact                             priority 0.3  monthly
/best-power-bank-iphone-2026         priority 0.9  weekly
```

**Landing pages（來自 `getAllLandingPageSlugs()`，目前 3 筆）**
```
/p/best-power-bank-iphone-2026            priority 0.85  weekly
/p/stainless-cookware-buying-guide-2026   priority 0.85  weekly
/p/best-wireless-mouse-productivity-2026  priority 0.85  weekly
```

**Blog 文章（來自 `getAllPosts()`，目前排除 `published: false` 後的所有 `.md` 文章，逐篇 priority 0.7 monthly，`lastModified` 取文章 frontmatter 的 `date`）**

---

## 15. API Routes

專案內共有 2 個 API Route，皆為本次 session 新增的「文章顯示管理」功能：

### app/api/admin/posts/route.ts

```ts
import { NextResponse } from 'next/server'
import { getAllPosts } from '@/lib/posts'

export async function GET() {
  const posts = getAllPosts({ includeUnpublished: true }).map((p) => ({
    slug: p.slug,
    title: p.title,
    date: p.date,
    category: p.category,
    published: p.published !== false,
  }))

  return NextResponse.json({ posts })
}
```

### app/api/admin/posts/[slug]/route.ts

```ts
import { NextRequest, NextResponse } from 'next/server'
import { setPostPublished } from '@/lib/posts'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: '請求格式錯誤' }, { status: 400 })
  }

  const published = (body as { published?: unknown })?.published
  if (typeof published !== 'boolean') {
    return NextResponse.json({ error: 'published 必須是布林值' }, { status: 400 })
  }

  const ok = setPostPublished(slug, published)
  if (!ok) {
    return NextResponse.json({ error: '找不到這篇文章' }, { status: 404 })
  }

  return NextResponse.json({ slug, published })
}
```

這兩個 route 已被 `app/robots.ts` 的 `disallow: ['/api']` 排除在爬蟲允許範圍外。

---

## 16. Middleware

專案中**沒有** `middleware.ts`。

---

## 17. Redirect / Rewrite / Headers

### next.config.ts

沒有設定 `redirects()`、`rewrites()`、`headers()`（設定檔內容同第 1 節，為空白預設值）。

### 元件層級的 redirect

專案中唯一的轉址邏輯，是 `app/blog/[slug]/page.tsx` 用 `next/navigation` 的 `redirect()`（非 `next.config.ts` 設定，是 request-time 在 React Server Component 內執行）：

```tsx
import { redirect } from 'next/navigation'

export default async function BlogSlugRedirect({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  redirect(`/${slug}`)
}
```

---

## 18. Search Console

搜尋整個專案（`app/`、`components/`、`lib/`、根目錄），**沒有找到**：
- `google-site-verification` meta tag
- Google Search Console 的 HTML 驗證檔（如 `googleXXXXXXXX.html`）
- `next.config.ts` 或 metadata 中的 `verification` 欄位設定

---

## 19. Analytics（完整清單，同第 12 節彙整）

| 項目 | 狀態 | 追蹤 ID / 說明 |
|---|---|---|
| GA4 / Google Ads gtag.js | ✅ 已串接 | `AW-17789304314`（`app/layout.tsx` + `lib/gtag.ts`） |
| Google Tag Manager | ❌ 未串接 | - |
| Vercel Analytics | ✅ 已串接 | `<Analytics />` from `@vercel/analytics/react`，`app/layout.tsx` |
| Microsoft Clarity | ❌ 未串接 | - |
| Google AdSense | ⚠️ 元件已寫但未使用 | `components/AdBanner.tsx`，未被任何頁面 import |
| 其他（Meta Pixel 等） | ❌ 未串接 | - |

`app/privacy-policy/page.tsx` 內文字提到的追蹤 ID 與程式碼中不一致，供對照：

> 「Google Analytics / Google Ads (gtag.js)...追蹤 ID：AW-411628672。」

而 `app/layout.tsx` 與 `lib/gtag.ts` 程式碼中實際使用的 ID 是 `AW-17789304314`。

---

## 20. 網站結構（樹狀圖）

```
/
├── about
├── contact
├── privacy-policy
├── terms
├── blog                          (?category=xxx)
│   └── [slug]                    → redirect to /[slug]
├── [slug]                        (9 篇文章，slug 見下方列表)
│   ├── ai-tools-for-work
│   ├── air-fryer-buying-guide-2026
│   ├── best-productivity-tools-2024
│   ├── best-wireless-mouse-productivity-2026
│   ├── eco-friendly-cup-buying-guide-2026
│   ├── five-power-bank-guide
│   ├── how-to-choose-keyboard
│   ├── mechanical-keyboard-guide
│   └── stainless-cookware-buying-guide-2026
├── best-power-bank-iphone-2026   (獨立靜態 landing page)
├── p
│   └── [slug]                    (3 個動態 landing page)
│       ├── best-power-bank-iphone-2026
│       ├── stainless-cookware-buying-guide-2026
│       └── best-wireless-mouse-productivity-2026
├── admin
│   └── posts                     (robots disallow)
├── api
│   └── admin
│       └── posts
│           └── [slug]            (robots disallow)
├── sitemap.xml
└── robots.txt
```

---

## 21. 其他與 SEO 相關的設定 / 檔案

### app/globals.css（與 SEO 相關片段：字體/主題色設定）

（此檔案為 Tailwind v4 樣式表，沒有 `@font-face` 自訂字體匯入，也沒有 `theme-color` 相關 meta 設定寫在此處）

### content/landing/index.ts（landing page 資料匯總，供 sitemap 與 /p/[slug] 使用）

```ts
import type { LandingPage } from '@/lib/landingPages'
import powerBankPages from './power-bank'
import wirelessMousePages from './wireless-mouse'
import stainlessCookwarePages from './stainless-cookware'

// Add new category imports here — one line per file
const ALL_LANDING_PAGES: LandingPage[] = [
  ...powerBankPages,
  ...wirelessMousePages,
  ...stainlessCookwarePages,
]

export function getLandingPage(slug: string): LandingPage | undefined {
  return ALL_LANDING_PAGES.find((p) => p.slug === slug)
}

export function getAllLandingPageSlugs(): string[] {
  return ALL_LANDING_PAGES.map((p) => p.slug)
}
```

### lib/landingPages.ts（LandingPage 型別定義，含 canonicalOverride 欄位）

```ts
// ─── Types ───────────────────────────────────────────────────────────────────

export interface LandingProduct {
  rank: number
  name: string
  tagline: string
  description: string
  badge: string
  badgeColor: string
  accentColor: string
  topBarColor: string
  pros: string[]
  cons: string[]
  /** Flexible key-value specs used in the comparison table */
  specs: Record<string, string | boolean>
  price: string
  image?: string
  href: string
  ctaText: string
}

export interface ComparisonColumn {
  label: string
  /** Must match a key in LandingProduct.specs */
  key: string
}

export interface BuyingGuideItem {
  icon: string
  title: string
  body: string
}

export interface UseCaseItem {
  use: string
  pick: string
  href: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface MidCta {
  label: string
  productName: string
  body: string
  href: string
  ctaText: string
}

export interface LandingPage {
  slug: string
  /** <title> tag */
  title: string
  /** meta description */
  description: string
  keywords: string[]
  /**
   * Override the canonical URL for this page.
   * Use when a separate, richer static page exists for the same content
   * and should be treated as the primary URL by Google.
   * e.g. '/best-power-bank-iphone-2026'
   */
  canonicalOverride?: string
  /** Hero category chip */
  category: string
  updatedLabel: string
  heroTitle: string
  heroSubtitle: string
  heroDesc: string
  buyingGuideTitle: string
  buyingGuideIntro: string
  products: LandingProduct[]
  comparisonColumns: ComparisonColumn[]
  buyingGuide: BuyingGuideItem[]
  useCases: UseCaseItem[]
  midCta: MidCta
  faqs: FaqItem[]
}
```

### lib/affiliatePlugin.ts（自訂 remark plugin，將 `::affiliate[id]` 語法轉為 AffiliateCard 元件）

```ts
import { visit } from 'unist-util-visit'
import type { Plugin } from 'unified'
import type { Root } from 'mdast'

/**
 * Transforms ::affiliate[id] (leafDirective) into a HAST
 * <affiliate-card id="..."> element that react-markdown maps to
 * the AffiliateCard React component via the `components` prop.
 *
 * Markdown usage:  ::affiliate[keychron-k2]
 */
const affiliatePlugin: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'leafDirective', (node: any) => {
    if (node.name !== 'affiliate') return

    // Label [id] lands as the first child text node
    const id: string =
      node.attributes?.id ??
      node.children?.[0]?.value?.trim() ??
      ''

    node.data = {
      ...node.data,
      hName: 'affiliate-card',
      hProperties: { affiliateid: id },
    }
    node.children = []
  })
}

export default affiliatePlugin
```

### lib/keywordMap.ts（關鍵字 → landing page slug 對照表，用於內部連結／關鍵字導流）

```ts
// Maps search keywords (normalized, lowercase) to landing page slugs.
// Used for internal linking and keyword-driven navigation.
export const KEYWORD_MAP: Record<string, string> = {
  // power bank — iphone
  'best power bank for iphone':        'best-power-bank-iphone-2026',
  'best power bank for iphone 2026':   'best-power-bank-iphone-2026',
  'magsafe power bank':                'best-power-bank-iphone-2026',
  'iphone portable charger':           'best-power-bank-iphone-2026',
  'best portable charger iphone':      'best-power-bank-iphone-2026',
  'iphone power bank fast charging':   'best-power-bank-iphone-2026',
  'qi2 power bank iphone':             'best-power-bank-iphone-2026',
}

export function getSlugForKeyword(keyword: string): string | undefined {
  return KEYWORD_MAP[keyword.toLowerCase().trim()]
}
```

（目前專案中搜尋不到任何頁面實際呼叫 `getSlugForKeyword`，此檔案暫無被 import 的紀錄）

### components/PostContent.tsx（markdown 內容轉 React，含 affiliate 卡片渲染）

```tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import affiliatePlugin from '@/lib/affiliatePlugin'
import AffiliateCard from '@/components/AffiliateCard'
import type { AffiliateItem } from '@/lib/posts'
import type { Components } from 'react-markdown'
import type { Element } from 'hast'

interface Props {
  content: string
  affiliate?: AffiliateItem[]
}

const BADGE_INDEX_MAP: Array<'best' | 'recommended'> = ['best', 'recommended']

export default function PostContent({ content, affiliate }: Props) {
  const components: Components = {
    // @ts-expect-error — custom element; react-markdown forwards hProperties as props
    'affiliate-card': ({
      affiliateid,
    }: {
      node: Element
      affiliateid?: string
    }) => {
const item = affiliate?.find((a) => a.id === affiliateid)
      if (!item) return null
      const idx = affiliate?.indexOf(item) ?? 0
      return (
        <AffiliateCard
          name={item.name}
          description={item.description}
          href={item.href}
          badge={item.badge}
          badgeVariant={item.badgeVariant ?? BADGE_INDEX_MAP[Math.min(idx, 1)]}
          price={item.price}
          image={item.image}
          ctaText="查看價格 →"
        />
      )
    },
  }

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, affiliatePlugin]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
```

### admin 相關新增檔案（本次 session 新增，影響 sitemap／robots 收錄範圍）

`app/admin/posts/page.tsx`：

```tsx
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
```

### 部落格文章 frontmatter 的 SEO 相關欄位（以 `content/posts/*.md` 為例）

每篇文章 frontmatter 目前使用的欄位：`title`、`description`、`date`、`category`、`tags`、`affiliate`（陣列，含 `id/name/description/href/badge/price/image`）、`published`。這些欄位由 `lib/posts.ts` 讀取後，分別餵給 `generateMetadata()`（title/description）與 Article JSON-LD（title/description/date/affiliate → Product/Offer）。`tags` 目前只用於文章頁footer顯示與 `PostCard`／`tags` 陣列本身，**沒有**被寫入任何 `<meta name="keywords">` 或 metadata 的 `keywords` 欄位。

---

（文件到此為止，共涵蓋使用者要求的 21 個項目，皆為程式碼／設定原文蒐集，不含改善建議。）
