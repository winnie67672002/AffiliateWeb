import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkDirective from 'remark-directive'
import affiliatePlugin from '@/lib/affiliatePlugin'
import AffiliateCard from '@/components/AffiliateCard'
import type { AffiliateItem } from '@/lib/posts'
import type { Components } from 'react-markdown'
import type { Element } from 'hast'

interface Props {
  content: string
  affiliate?: AffiliateItem[]
}

const BADGE_INDEX_MAP: Array<'best' | 'recommended'> = ['best', 'recommended']

export default function PostContent({ content, affiliate }: Props) {
  const components: Components = {
    // @ts-expect-error — custom element; react-markdown forwards hProperties as props
    'affiliate-card': ({
      affiliateid,
    }: {
      node: Element
      affiliateid?: string
    }) => {
const item = affiliate?.find((a) => a.id === affiliateid)
      if (!item) return null
      const idx = affiliate?.indexOf(item) ?? 0
      return (
        <AffiliateCard
          name={item.name}
          description={item.description}
          href={item.href}
          badge={item.badge}
          badgeVariant={item.badgeVariant ?? BADGE_INDEX_MAP[Math.min(idx, 1)]}
          price={item.price}
          image={item.image}
          ctaText="查看價格 →"
        />
      )
    },
  }

  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkDirective, affiliatePlugin]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
