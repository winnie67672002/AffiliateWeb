import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { Analytics } from '@vercel/analytics/next'

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
      </body>
    </html>
  )
}
