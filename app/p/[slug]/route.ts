import { NextRequest, NextResponse } from 'next/server'

/**
 * /p/[slug] 已經停用。
 *
 * 這裡不再 render 任何頁面，只處理舊網址的收斂：
 * - 已知有對應 canonical 頁面的 slug → 301 永久轉址過去（沿用原本 canonicalOverride 的目標）
 * - 其餘 slug（包含目前尚未發布、沒有對應頁面的 stainless-cookware-buying-guide-2026）
 *   → 回傳 410 Gone，明確告訴 Google 這個網址已經永久移除、不是暫時性的 404，
 *     避免被當成「找不到但可能還在」而持續嘗試重新爬取或留在索引裡。
 *
 * 新增其他舊 /p/ slug 的轉址時，只需要在下面的表格加一行即可。
 */
const REDIRECT_MAP: Record<string, string> = {
  'best-power-bank-iphone-2026': '/best-power-bank-iphone-2026',
  'best-wireless-mouse-productivity-2026': '/best-wireless-mouse-productivity-2026',
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const target = REDIRECT_MAP[slug]

  if (target) {
    return NextResponse.redirect(new URL(target, request.url), 301)
  }

  return new NextResponse(null, { status: 410 })
}
