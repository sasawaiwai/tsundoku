import type { Metadata } from 'next'
import { Noto_Serif_JP } from 'next/font/google'
import './globals.css'
import Header from '@/components/layout/Header'
import BottomNav from '@/components/layout/BottomNav'
import Script from 'next/script'

const notoSerifJP = Noto_Serif_JP({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-noto-serif-jp',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'My Tsundoku | 私の積ん読',
  description: '積ん読を記録して3冊シェアする日本語サービス',
  manifest: '/manifest.json',
  openGraph: {
    title: 'My Tsundoku | 私の積ん読',
    description: '積ん読を記録して3冊シェアする日本語サービス',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Tsundoku | 私の積ん読',
    description: '積ん読を記録して3冊シェアする日本語サービス',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={notoSerifJP.variable}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#2c2c2c" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      </head>
      <body className="min-h-screen bg-washi">
        <Header />
        {children}
        <BottomNav />
        <Script id="sw-register" strategy="afterInteractive">
          {`
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js').catch(() => {});
              });
            }
          `}
        </Script>
      </body>
    </html>
  )
}
