'use client'

import { affiliateClick } from '@/lib/gtag'

interface AffiliateButtonProps {
  href: string
  productName: string
  children: React.ReactNode
  className?: string
}

export default function AffiliateButton({
  href,
  productName,
  children,
  className = '',
}: AffiliateButtonProps) {
  function handleClick() {
    affiliateClick({ productName, href })
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={handleClick}
      className={`
        inline-flex items-center justify-center gap-2
        bg-gray-900 text-white font-semibold text-sm
        px-6 py-3 rounded-xl no-underline
        shadow-sm hover:shadow hover:bg-gray-700 active:bg-gray-800
        transition-all duration-150
        ${className}
      `}
    >
      {children}
    </a>
  )
}
