export const GTAG_ID = 'AW-17789304314'

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void
    dataLayer: unknown[]
  }
}

export function pageview(url: string): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('config', GTAG_ID, { page_path: url })
}

export interface GtagEvent {
  action: string
  category: string
  label?: string
  value?: number
}

export function event({ action, category, label, value }: GtagEvent): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return
  window.gtag('event', action, {
    event_category: category,
    event_label: label,
    value,
  })
}

export function affiliateClick({
  productName,
  href,
}: {
  productName: string
  href: string
}): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return

  // GA4 自訂事件（在 GA4 後台把這個事件標記為轉換，再匯入 Google Ads）
  window.gtag('event', 'affiliate_click', {
    product_name: productName,
    outbound_url: href,
  })
}
