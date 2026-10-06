import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ============================================================================
// 短網址路由：https://goodpickslab.com/<code>  →  (rewrite) /s/<code>
//
// 為什麼需要 proxy：網站根目錄的 /:slug 已經被 app/[slug]/page.tsx（文章頁）
// 使用，不能再放一個 app/[shortCode]。為了不修改既有文章路由，這裡只把
// 「看起來像短代碼」的路徑轉給 /s/<code>，其餘請求完全不受影響。
//
// 判斷條件（三者皆須成立）：
//   1. 單一路徑段，剛好 7 個英數字元（matcher 已先過濾，其他路徑根本不會進來）
//   2. 至少含一個大寫字母
//   3. 至少含一個數字
// 既有路由與文章 slug 都是小寫英文/kebab-case（如 /contact、/about），
// 永遠不會同時含大寫與數字，因此不會被誤轉。
// ============================================================================

const SHORT_CODE = /^\/(?=[A-Za-z0-9]*[A-Z])(?=[A-Za-z0-9]*[0-9])[A-Za-z0-9]{7}$/

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (!SHORT_CODE.test(pathname)) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/s${pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: '/:code([A-Za-z0-9]{7})',
}
