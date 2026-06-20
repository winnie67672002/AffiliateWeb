// ─── Types ───────────────────────────────────────────────────────────────────

export interface LandingProduct {
  rank: number
  name: string
  tagline: string
  description: string
  badge: string
  badgeColor: string
  accentColor: string
  topBarColor: string
  pros: string[]
  cons: string[]
  /** Flexible key-value specs used in the comparison table */
  specs: Record<string, string | boolean>
  price: string
  image?: string
  href: string
  ctaText: string
}

export interface ComparisonColumn {
  label: string
  /** Must match a key in LandingProduct.specs */
  key: string
}

export interface BuyingGuideItem {
  icon: string
  title: string
  body: string
}

export interface UseCaseItem {
  use: string
  pick: string
  href: string
}

export interface FaqItem {
  q: string
  a: string
}

export interface MidCta {
  label: string
  productName: string
  body: string
  href: string
  ctaText: string
}

export interface LandingPage {
  slug: string
  /** <title> tag */
  title: string
  /** meta description */
  description: string
  keywords: string[]
  /** Hero category chip */
  category: string
  updatedLabel: string
  heroTitle: string
  heroSubtitle: string
  heroDesc: string
  buyingGuideTitle: string
  buyingGuideIntro: string
  products: LandingProduct[]
  comparisonColumns: ComparisonColumn[]
  buyingGuide: BuyingGuideItem[]
  useCases: UseCaseItem[]
  midCta: MidCta
  faqs: FaqItem[]
}

