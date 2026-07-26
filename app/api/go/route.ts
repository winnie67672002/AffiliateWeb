import { NextRequest, NextResponse } from 'next/server'

// Supabase 點擊紀錄（使用 anon key，透過 PostgREST REST API 寫入，
// 不引入 @supabase/supabase-js 依賴，避免修改 package.json 以外的檔案）
async function logClickToSupabase(data: {
  zone: string | null
  subid: string | null
  browser: string | null
  campaign: string | null
  referer: string | null
  userAgent: string | null
  country: string | null
  device: string | null
  language: string | null
  os: string | null
  subzone_id: string | null
}) {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase click log skipped: SUPABASE_URL or SUPABASE_ANON_KEY is not configured')
    return
  }

  try {
    const res = await fetch(`${supabaseUrl.replace(/\/$/, '')}/rest/v1/clicks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        apikey: supabaseAnonKey,
        Authorization: `Bearer ${supabaseAnonKey}`,
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        zone: data.zone,
        subid: data.subid,
        browser: data.browser,
        campaign: data.campaign,
        referer: data.referer,
        user_agent: data.userAgent,
        country: data.country,
        device: data.device,
        language: data.language,
        os: data.os,
        subzone_id: data.subzone_id,
      }),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error(`Supabase click log failed: ${res.status} ${res.statusText} ${text}`)
    }
  } catch (err) {
    console.error('Supabase click log failed:', err)
  }
}

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
  const country = searchParams.get('country')
  const device = searchParams.get('device')
  const language = searchParams.get('language')
  const os = searchParams.get('os')
  const subzone_id = searchParams.get('subzone_id')

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

  const referer = request.headers.get('referer')
  const userAgent = request.headers.get('user-agent')
  const timestamp = new Date().toISOString()

  // 點擊記錄，會出現在 Vercel Function Logs
  // console.log(
  //   JSON.stringify({
  //     event: 'redirect_click',
  //     zone,
  //     subid,
  //     browser,
  //     campaign,
  //     referer,
  //     userAgent,
  //     timestamp,
  //     country,
  //     device,
  //     language,
  //     os,
  //     subzone_id,
  //   })
  // )

  // 寫入 Supabase 點擊紀錄；成功或失敗都不能阻止 302 redirect
  try {
    await logClickToSupabase({ zone, subid, browser, campaign, referer, userAgent, country, device, language, os, subzone_id  })
  } catch (err) {
    console.error('Unexpected error logging click to Supabase:', err)
  }

  return NextResponse.redirect(destination.toString(), { status: 302 })
}
