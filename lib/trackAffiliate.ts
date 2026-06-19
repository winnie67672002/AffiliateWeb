import { event } from './gtag'

export function trackAffiliateClick(url: string, label?: string): void {
  event({
    action: 'click',
    category: 'outbound',
    label: label ?? url,
  })
}
