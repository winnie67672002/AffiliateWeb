type BadgeVariant = 'best' | 'editor' | 'recommended' | 'top' | 'new' | 'sale'

interface BadgeProps {
  variant: BadgeVariant
  className?: string
}

const BADGE_CONFIG: Record<BadgeVariant, { label: string; className: string }> = {
  best:        { label: '✦ Best Pick',        className: 'bg-amber-50   text-amber-700  ring-1 ring-amber-200'  },
  editor:      { label: "✦ Editor's Choice",  className: 'bg-violet-50  text-violet-700 ring-1 ring-violet-200' },
  recommended: { label: '✦ Recommended',      className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200' },
  top:         { label: '# 1 Pick',           className: 'bg-rose-50    text-rose-700   ring-1 ring-rose-200'   },
  new:         { label: '✦ New',              className: 'bg-sky-50     text-sky-700    ring-1 ring-sky-200'    },
  sale:        { label: '↓ Deal',             className: 'bg-orange-50  text-orange-700 ring-1 ring-orange-200' },
}

export default function Badge({ variant, className = '' }: BadgeProps) {
  const { label, className: variantClass } = BADGE_CONFIG[variant]
  return (
    <span
      className={`
        inline-flex items-center gap-0.5
        text-[0.65rem] font-semibold tracking-wide
        px-2 py-0.5 rounded-full
        ${variantClass} ${className}
      `}
    >
      {label}
    </span>
  )
}
