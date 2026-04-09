import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import PageViewTracker from '@/components/PageViewTracker'
import './globals.css'

export const metadata: Metadata = {
  title: "Brooke's Trusty Paws Co. — Palm Beach's Favorite Pet Sitter",
  description:
    'Professional pet & home care in the West Palm Beach area. In-home visits, overnight stays, and dog walking by Brooke Maisano — 4 years vet experience, all friendly breeds welcome.',
  keywords: [
    'pet sitter West Palm Beach',
    'dog sitter Palm Beach',
    'pet sitting Wellington FL',
    'overnight pet care Palm Beach',
    'Brooke Trusty Paws',
  ],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: "Trusty Paws",
  },
  other: {
    'mobile-web-app-capable': 'yes',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className="min-h-full flex flex-col antialiased">
        <PageViewTracker />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
