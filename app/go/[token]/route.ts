import { NextResponse } from 'next/server'
import { findShortLink, isExpired, ShortlinkDbError } from '@/lib/shortlink/db'
import { expiredPage, notFoundPage, statusPage, unavailablePage } from '@/lib/shortlink/pages'
import { verifyContinuePass } from '@/lib/shortlink/state'
import { isSafeRedirectUrl } from '@/lib/shortlink/validate'

// ============================================================================
// GET /go/[token] — 「繼續前往」的實際導向點
//
// 警示頁的「繼續前往」按鈕連到這裡（不把原始網址寫進頁面）。
// 1. 驗證伺服器簽發的通行證（簽章 + 期限）→ 取得 short code
// 2. 用 short code 重新查 Supabase：不存在/已刪除 404、過期 410
//    （通行證簽發後才被刪除或過期的連結，點下去一樣擋得住）
// 3. 302 導向資料庫中的 original_url
//
// 原始網址只來自資料庫；任何 query string（?url= / ?redirect= / ?destination=
// / ?artwork=）一律忽略，不可能變成 open redirect。
// ============================================================================

export const dynamic = 'force-dynamic'

export async function GET(_request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const pass = verifyContinuePass(token)
  if (!pass.ok) {
    if (pass.reason === 'expired') return statusPage(403, '連結已逾時', '請回到原本的短網址重新開啟。')
    return notFoundPage()
  }

  try {
    const link = await findShortLink(pass.shortCode)
    if (!link) return notFoundPage()
    if (isExpired(link)) return expiredPage()
    if (!isSafeRedirectUrl(link.original_url)) {
      console.error('[shortlink] stored url failed safety re-check')
      return notFoundPage()
    }

    const res = NextResponse.redirect(link.original_url, 302)
    res.headers.set('Referrer-Policy', 'no-referrer')
    res.headers.set('Cache-Control', 'no-store')
    res.headers.set('X-Robots-Tag', 'noindex, nofollow')
    return res
  } catch (err) {
    if (!(err instanceof ShortlinkDbError)) console.error('[shortlink] go redirect error')
    return unavailablePage()
  }
}
