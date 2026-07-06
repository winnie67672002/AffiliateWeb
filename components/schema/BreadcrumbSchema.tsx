import Script from 'next/script'

export interface BreadcrumbItem {
  name: string
  /** Absolute or root-relative path, e.g. '/mouse' or 'https://goodpickslab.com/mouse' */
  url: string
}

const BASE_URL = 'https://goodpickslab.com'

/**
 * Renders a BreadcrumbList JSON-LD script.
 * Pass items in order from Home -> current page.
 */
export default function BreadcrumbSchema({ items, id }: { items: BreadcrumbItem[]; id?: string }) {
  const itemListElement = items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: item.url.startsWith('http') ? item.url : `${BASE_URL}${item.url}`,
  }))

  return (
    <Script
      id={id ?? 'breadcrumb-schema'}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'BreadcrumbList',
          itemListElement,
        }),
      }}
    />
  )
}
