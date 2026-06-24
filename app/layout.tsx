import type { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AnalyticsTracker from '@/components/AnalyticsTracker'
import { Analytics } from '@vercel/analytics/react'
import { GTAG_ID } from '@/lib/gtag'

export const metadata: Metadata = {
  metadataBase: new URL('https://goodpickslab.com'),
  title: {
    default: 'Good Picks Lab',
    template: '%s | Good Picks Lab',
  },
  description: '分享實際使用過的好物、工具與數位產品，幫助你快速找到值得購買的商品。',
  keywords: ['好物推薦', '3C', '生產力工具', 'AI工具', '辦公設備'],
  openGraph: {
    type: 'website',
    locale: 'zh_TW',
    siteName: 'Good Picks Lab',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
<html lang="zh-TW" className="h-full">
  <body className="min-h-full flex flex-col bg-white">

    <Header />
    <main className="flex-1">{children}</main>
    <Footer />

    <Analytics />
    <AnalyticsTracker />

    {/* GA */}
    <Script
      src={`https://www.googletagmanager.com/gtag/js?id=AW-18269049172`}
      strategy="afterInteractive"
    />

    <Script id="gtag-init" strategy="afterInteractive">
      {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'AW-18269049172', { send_page_view: false });
      `}
    </Script>

    {/* WebSite Schema（只留一個） */}
    <Script
      id="website-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "選好研究所",
          alternateName: "Good Picks Lab",
          url: "https://goodpickslab.com",
        }),
      }}
    />

    {/* Organization Schema */}
    <Script
      id="organization-schema"
      type="application/ld+json"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "選好研究所",
          url: "https://goodpickslab.com",
          logo: "https://goodpickslab.com/logo.png",
        }),
      }}
    />

  </body>
</html>
  )
}
