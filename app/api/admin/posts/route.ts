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
