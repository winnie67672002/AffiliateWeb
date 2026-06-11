import Image from 'next/image'

type BadgeVariant = 'best' | 'editor' | 'recommended' | 'top' | 'sale'

interface AffiliateCardProps {
  name: string
  description: string
  href: string
  badge?: string           // 自訂文字 badge（優先）
  badgeVariant?: BadgeVariant
  price?: string
  image?: string
  ctaText?: string         // 自訂 CTA 文字
}

const BADGE_STYLES: Record<BadgeVariant, string> = {
  best:        'bg-amber-50  text-amber-700  ring-1 ring-amber-200',
  editor:      'bg-violet-50 text-violet-700 ring-1 ring-violet-200',
  recommended: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  top:         'bg-rose-50   text-rose-700   ring-1 ring-rose-200',
  sale:        'bg-orange-50 text-orange-700 ring-1 ring-orange-200',
}

export default function AffiliateCard({
  name,
  description,
  href,
  badge,
  badgeVariant,
  price,
  image,
  ctaText = 'Check Price →',
}: AffiliateCardProps) {

  const badgeClass = badgeVariant ? BADGE_STYLES[badgeVariant] : 'bg-amber-50 text-amber-700 ring-1 ring-amber-200'

  return (
    <div className="
      not-prose
      relative my-7
      rounded-2xl border border-gray-200 bg-white
      shadow-[0_2px_12px_rgba(0,0,0,0.07)]
      overflow-hidden
    ">
      {/* 頂部導覽條 */}
      <div className="h-1 w-full bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200" />

      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row gap-4">

          {/* 圖片 */}
          {image && (
            <div className="shrink-0 w-full sm:w-28 h-24 sm:h-28 rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
              <Image
                src={image}
                alt={name}
                width={112}
                height={112}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* 內容 */}
          <div className="flex-1 min-w-0">
            {/* 標題列 */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="font-semibold text-gray-900 text-base leading-tight">
                {name}
              </span>
              {(badge || badgeVariant) && (
                <span className={`text-[0.65rem] font-semibold tracking-wide px-2 py-0.5 rounded-full ${badgeClass}`}>
                  {badge ?? (badgeVariant === 'best' ? '✦ Best Pick' : badgeVariant === 'editor' ? "✦ Editor's Choice" : badgeVariant === 'recommended' ? '✦ Recommended' : badgeVariant === 'top' ? '#1 Pick' : '↓ Deal')}
                </span>
              )}
            </div>

            {/* 描述 */}
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              {description}
            </p>

            {/* 底部：價格 + CTA */}
            <div className="flex flex-wrap items-center gap-3">
              {price && (
                <span className="text-sm font-semibold text-gray-800">
                  {price}
                </span>
              )}
              <a
                href={href}
                target="_blank"
                rel="nofollow sponsored noopener noreferrer"
                className="
                  inline-flex items-center gap-1.5
                  text-sm font-semibold
                  bg-gray-900 !text-white !no-underline
                  hover:bg-gray-700 active:bg-gray-800
                  px-5 py-2.5 rounded-xl
                  shadow-sm hover:shadow
                  transition-all duration-150
                "
              >
                {ctaText}
              </a>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}
