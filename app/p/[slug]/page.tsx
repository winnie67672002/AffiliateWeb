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
