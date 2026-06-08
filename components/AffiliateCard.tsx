interface AffiliateCardProps {
  name: string
  description: string
  href: string
  badge?: string
  price?: string
}

export default function AffiliateCard({
  name,
  description,
  href,
  badge,
  price,
}: AffiliateCardProps) {
  return (
    <div className="border border-gray-200 rounded-lg p-4 my-6 flex items-start justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-medium text-gray-900">{name}</span>
          {badge && (
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded">
              {badge}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500">{description}</p>
        {price && <p className="text-sm font-medium text-gray-700 mt-1">{price}</p>}
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer nofollow"
        className="shrink-0 text-sm font-medium text-white bg-gray-900 hover:bg-gray-700 transition-colors px-4 py-2 rounded-md"
      >
        查看
      </a>
    </div>
  )
}
