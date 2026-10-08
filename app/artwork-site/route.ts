import { NextResponse } from 'next/server'
import { getArtworkUrl } from '@/lib/shortlink/config'
import { notFoundPage } from '@/lib/shortlink/pages'

// ============================================================================
// GET /artwork-site — 「查看我的作品（另開新分頁）」的導向點
//
// 警示頁的「查看我的作品」連結（target=_blank rel=noopener noreferrer）指向這裡。
// 這裡 302 導向 lib/shortlink/config.ts 的固定常數 ARTWORK_URL（目前為 Google）。
//
// 作品網址是 server-side 固定值，與短網址、short code 完全無關，
// 也不接受任何 query string（?url= / ?redirect= / ?destination= / ?artwork=）；
// 因此不可能被 query parameter 改成其他網站，不是 open redirect。
// 頁面本身不顯示這個網址。
// ============================================================================

export const dynamic = 'force-dynamic'

export function GET() {
  const artworkUrl = getArtworkUrl()
  if (!artworkUrl) {
    console.error('[shortlink] ARTWORK_URL is not a valid http(s) url')
    return notFoundPage()
  }

  const res = NextResponse.redirect(artworkUrl, 302)
  res.headers.set('Referrer-Policy', 'no-referrer')
  res.headers.set('Cache-Control', 'no-store')
  res.headers.set('X-Robots-Tag', 'noindex, nofollow')
  return res
}
