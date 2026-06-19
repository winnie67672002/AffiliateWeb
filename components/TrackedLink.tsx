'use client'

import { trackAffiliateClick } from '@/lib/trackAffiliate'

interface Props {
  href: string
  children: React.ReactNode
  className?: string
  label?: string
}

export default function TrackedLink({ href, children, className, label }: Props) {
  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      className={className}
      onClick={() => trackAffiliateClick(href, label)}
    >
      {children}
    </a>
  )
}
