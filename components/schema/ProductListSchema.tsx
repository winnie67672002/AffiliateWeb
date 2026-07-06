import Script from 'next/script'

export interface ProductSchemaItem {
  name: string
  description: string
  image?: string
  url: string
  price?: string
  position?: number
}

const BASE_URL = 'https://goodpickslab.com'

/** Strips a leading currency symbol / non-numeric prefix so Offer.price stays a plain number string. */
function toPriceAmount(price?: string): string | undefined {
  if (!price) return undefined
  const match = price.replace(/,/g, '').match(/\d+(\.\d+)?/)
  return match ? match[0] : undefined
}

/**
 * Renders an ItemList of Product/Offer JSON-LD for a set of affiliate-recommended products.
 * Does not fabricate ratings/reviews — only uses data actually present on the page.
 */
export default function ProductListSchema({ products, id }: { products: ProductSchemaItem[]; id?: string }) {
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
              offers: {
                '@type': 'Offer',
                url: p.url,
                priceCurrency: 'TWD',
                price: toPriceAmount(p.price) ?? '0',
                availability: 'https://schema.org/InStock',
              },
            },
          })),
        }),
      }}
    />
  )
}
