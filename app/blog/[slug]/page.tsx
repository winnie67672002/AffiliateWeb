import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Script from "next/script";

import {
  getPostBySlug,
  getAllSlugs,
  getRelatedPosts,
} from "@/lib/posts";

import AffiliateCard from "@/components/AffiliateCard";

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  "3C產品": "bg-blue-50 text-blue-600",
  "生產力工具": "bg-violet-50 text-violet-600",
  "居家用品": "bg-green-50 text-green-600",
  "辦公設備": "bg-amber-50 text-amber-600",
  "AI工具": "bg-rose-50 text-rose-600",
};

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const relatedPosts = getRelatedPosts(post.slug, post.category);

  const dateStr = new Date(post.date).toLocaleDateString("zh-TW", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const colorClass =
    CATEGORY_COLORS[post.category] ?? "bg-gray-50 text-gray-500";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* SEO Schema */}
      <Script
        id="product-schema"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            description: post.description,
            datePublished: post.date,
            author: {
              "@type": "Organization",
              name: "Good Picks Lab",
            },
            mainEntity: post.affiliate?.map((item) => ({
              "@type": "Product",
              name: item.name,
              description: item.description,
              offers: {
                "@type": "Offer",
                url: item.href,
                price: item.price || "0",
                priceCurrency: "TWD",
              },
            })),
          }),
        }}
      />

      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-gray-400 mb-8">
        <Link href="/">首頁</Link>
        <span>/</span>
        <Link href="/blog">文章</Link>
        <span>/</span>
        <span className="text-gray-600">{post.title}</span>
      </nav>

      <article>
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className={`text-xs px-2 py-1 rounded ${colorClass}`}>
              {post.category}
            </span>
            <time className="text-sm text-gray-400">{dateStr}</time>
          </div>

          <h1 className="text-3xl font-bold mb-4">{post.title}</h1>

          <p className="text-lg text-gray-500 border-l-4 pl-4">
            {post.description}
          </p>
        </header>

        {/* Content */}
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        {/* Affiliate Cards */}
        {post.affiliate?.map((item, index) => (
          <AffiliateCard
            key={index}
            name={item.name}
            description={item.description}
            href={item.href}
            badge={item.badge}
            price={item.price}
            image={item.image}
          />
        ))}

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <div className="mt-12 pt-8 border-t">
            <p className="font-medium mb-4">你可能也會喜歡</p>

            <div className="space-y-3">
              {relatedPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/blog/${post.slug}`}
                  className="block p-3 border rounded hover:bg-gray-50"
                >
                  <p className="font-medium">{post.title}</p>
                  <p className="text-sm text-gray-500">
                    {post.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back */}
        <div className="mt-10">
          <Link href="/blog">← 返回文章列表</Link>
        </div>
      </article>
    </div>
  );
}