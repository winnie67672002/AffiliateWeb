import Script from 'next/script'

export interface HowToStep {
  name: string
  text: string
}

/**
 * Renders a HowTo JSON-LD script for step-by-step buying/decision guides.
 * Only use when the steps mirror headings/content actually visible in the article.
 */
export default function HowToSchema({
  name,
  description,
  steps,
  id,
}: {
  name: string
  description?: string
  steps: HowToStep[]
  id?: string
}) {
  if (!steps || steps.length === 0) return null

  return (
    <Script
      id={id ?? 'howto-schema'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name,
          description,
          step: steps.map((s) => ({
            '@type': 'HowToStep',
            name: s.name,
            text: s.text,
          })),
        }),
      }}
    />
  )
}
