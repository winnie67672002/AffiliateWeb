import { NextRequest, NextResponse } from 'next/server'

// PropellerAds 流量追蹤 → 蝦皮聯盟導流 API
// GET /api/go?zone=<zone_id>&subid=<subid>&browser=<browser_version>&campaign=<可選>
//
// 目標網址固定由環境變數 SHOPEE_AFFILIATE_URL 提供，不接受外部傳入 url，
// 避免 open redirect 被濫用（影響 SEO 與網站信譽）。
// 這支 API 完全獨立於現有頁面/元件/路由，不修改任何既有檔案。
//
// 安全性設計（沿用原本設計）：
// - 僅允許 https 目的地
// - 僅允許轉跳到白名單網域（防止環境變數設定錯誤導致轉跳到非預期網域）
//   白名單可透過環境變數 ALLOWED_REDIRECT_HOSTS（逗號分隔）覆寫/擴充
// - 保留點擊 log

const DEFAULT_ALLOWED_HOSTS = [
  'shopee.tw',
  'shp.ee',
  's.shopee.tw',
  'affiliate.shopee.tw',
  'shopee.com',
]

function getAllowedHosts(): string[] {
  const fromEnv = process.env.ALLOWED_REDIRECT_HOSTS
  if (!fromEnv) return DEFAULT_ALLOWED_HOSTS
  return fromEnv
    .split(',')
    .map((h) => h.trim())
    .filter(Boolean)
}

function isAllowedHost(hostname: string, allowedHosts: string[]): boolean {
  return allowedHosts.some(
    (h) => hostname === h || hostname.endsWith(`.${h}`)
  )
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)

  const zone = searchParams.get('zone')
  const subid = searchParams.get('subid')
  const browser = searchParams.get('browser')
  const campaign = searchParams.get('campaign')

  const affiliateUrl = process.env.SHOPEE_AFFILIATE_URL
  if (!affiliateUrl) {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL is not configured' },
      { status: 500 }
    )
  }

  let destination: URL
  try {
    destination = new URL(affiliateUrl)
  } catch {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL is not a valid URL' },
      { status: 500 }
    )
  }

  if (destination.protocol !== 'https:') {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL must use https' },
      { status: 500 }
    )
  }

  const allowedHosts = getAllowedHosts()
  if (!isAllowedHost(destination.hostname, allowedHosts)) {
    return NextResponse.json(
      { error: 'SHOPEE_AFFILIATE_URL host is not in the allowed list' },
      { status: 500 }
    )
  }

  // 點擊記錄，會出現在 Vercel Function Logs
  console.log(
    JSON.stringify({
      event: 'redirect_click',
      zone,
      subid,
      browser,
      campaign,
      referer: request.headers.get('referer'),
      userAgent: request.headers.get('user-agent'),
      timestamp: new Date().toISOString(),
    })
  )

  return NextResponse.redirect(destination.toString(), { status: 302 })
}
