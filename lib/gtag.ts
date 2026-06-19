export const GTAG_ID = 'AW-411628672'

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
