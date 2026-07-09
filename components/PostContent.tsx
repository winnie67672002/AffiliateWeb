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

    // ── Markdown 表格：套用跟 ComparisonTable 元件一致的樣式 ──
    // 預設 prose 的表格樣式很陽春，中文內容欄寬容易跑版、看起來沒對齊，
    // 這裡統一改成有邊框、標題列灰底、可橫向捲動的卡片式表格。
    table: ({ children }) => (
      <div className="my-6 not-prose rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">{children}</table>
        </div>
      </div>
    ),
    thead: ({ children }) => (
      <thead className="bg-gray-50 border-b border-gray-200">{children}</thead>
    ),
    tbody: ({ children }) => <tbody>{children}</tbody>,
    tr: ({ children }) => (
      <tr className="border-b border-gray-100 last:border-0 even:bg-gray-50/50">{children}</tr>
    ),
    th: ({ children, style }) => (
      <th
        style={style}
        className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap"
      >
        {children}
      </th>
    ),
    td: ({ children, style }) => (
      <td style={style} className="px-4 py-3 text-xs text-gray-600 align-top leading-relaxed">
        {children}
      </td>
    ),
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
