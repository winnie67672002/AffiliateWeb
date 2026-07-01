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
