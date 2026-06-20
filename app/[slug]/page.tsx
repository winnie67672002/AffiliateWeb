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
