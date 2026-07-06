import Script from 'next/script'

export interface FaqSchemaItem {
  q: string
  a: string
}

/**
 * Renders an FAQPage JSON-LD script.
 * IMPORTANT: only use this when the same Q&A content is visibly rendered
 * on the page — Google requires structured data to match visible content.
 */
export default function FaqSchema({ faqs, id }: { faqs: FaqSchemaItem[]; id?: string }) {
  if (!faqs || faqs.length === 0) return null

  return (
    <Script
      id={id ?? 'faq-schema'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((faq) => ({
            '@type': 'Question',
            name: faq.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: faq.a,
            },
          })),
        }),
      }}
    />
  )
}
