import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Taxi Pollo',
  description: 'Carne fresca in 30 min - Ordini online con consegna taxi giornaliera',
  // Fix per static export + GitHub Pages
  manifest: '/manifest.json',
  themeColor: '#ffffff',
  viewport: 'width=device-width, initial-scale=1',
  // Open Graph per social sharing
  openGraph: {
    title: 'Taxi Pollo - Carne fresca in 30 min',
    description: 'Ordini online carne e prodotti pronti con consegna taxi giornaliera',
    url: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}` : '',
    siteName: 'Taxi Pollo',
    images: [
      {
        url: process.env.NEXT_PUBLIC_BASE_PATH ? `${process.env.NEXT_PUBLIC_BASE_PATH}/og-image.jpg` : '/og-image.jpg',
        width: 1200,
        height: 630,
      }
    ],
    locale: 'it_IT',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="it" suppressHydrationWarning>
      <head>
        {/* Fix basePath per GitHub Pages */}
        {process.env.NEXT_PUBLIC_BASE_PATH && (
          <base href={process.env.NEXT_PUBLIC_BASE_PATH || '/'} />
        )}
        {/* PWA support */}
        <link rel="manifest" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/manifest.json`} />
        <meta name="theme-color" content="#ffffff" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
        <meta name="apple-mobile-web-app-title" content="Taxi Pollo" />
        {/* Favicon */}
        <link rel="icon" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/favicon.ico`} />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
