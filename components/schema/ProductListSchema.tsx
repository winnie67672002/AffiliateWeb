import Script from 'next/script'

export interface ProductListItem {
  name: string
  description: string
  image?: string
  url: string
  position?: number
}

const BASE_URL = 'https://goodpickslab.com'

/**
 * Purely descriptive ItemList of the products an affiliate roundup article mentions.
 *
 * IMPORTANT: this intentionally does NOT emit `offers` (price / priceCurrency /
 * availability) or `aggregateRating` / `review`.
 *
 * This site is not the merchant selling these products — it links out to Shopee /
 * brand sites via affiliate links, has no live price or stock feed, and has no real,
 * user-collected ratings. Attaching Offer/Rating data to Product markup is what tells
 * Google "treat this as a Product snippet / Merchant listing", which Search Console
 * will then validate against e-commerce-grade requirements (accurate price format,
 * availability, shipping/return policy, etc.) that a listicle can't legitimately meet.
 * That mismatch is exactly what produced the "Product snippets" / "Merchant listings"
 * invalid-item errors in GSC.
 *
 * Keeping this to name/description/image/url gives Google context about which
 * products the article discusses without claiming to be a shop — safe, valid,
 * and not eligible (or trying to be eligible) for either rich result type.
 */
export default function ProductListSchema({ products, id }: { products: ProductListItem[]; id?: string }) {
  if (!products || products.length === 0) return null

  return (
    <Script
      id={id ?? 'product-list-schema'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'ItemList',
          itemListElement: products.map((p, i) => ({
            '@type': 'ListItem',
            position: p.position ?? i + 1,
            item: {
              '@type': 'Product',
              name: p.name,
              description: p.description,
              image: p.image ? `${BASE_URL}${p.image}` : undefined,
              url: p.url,
            },
          })),
        }),
      }}
    />
  )
}
