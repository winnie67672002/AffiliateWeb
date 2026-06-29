import type { LandingPage } from '@/lib/landingPages'
import powerBankPages from './power-bank'
import wirelessMousePages from './wireless-mouse'
import stainlessCookwarePages from './stainless-cookware'

// Add new category imports here — one line per file
const ALL_LANDING_PAGES: LandingPage[] = [
  ...powerBankPages,
  ...wirelessMousePages,
  ...stainlessCookwarePages,
]

export function getLandingPage(slug: string): LandingPage | undefined {
  return ALL_LANDING_PAGES.find((p) => p.slug === slug)
}

export function getAllLandingPageSlugs(): string[] {
  return ALL_LANDING_PAGES.map((p) => p.slug)
}
