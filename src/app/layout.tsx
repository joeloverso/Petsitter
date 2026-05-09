import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import PageViewTracker from '@/components/PageViewTracker'
import './globals.css'

const siteUrl = 'https://trustypawco.com'

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'LocalBusiness',
      '@id': `${siteUrl}/#business`,
      name: "Brooke's Trusty Paws Co.",
      description:
        'Professional pet & home care in the West Palm Beach area. In-home visits, overnight stays, and dog walking by Brooke Maisano. 4 years vet experience, all friendly breeds welcome.',
      url: siteUrl,
      telephone: process.env.NEXT_PUBLIC_GOOGLE_VOICE_NUMBER,
      email: 'BrookeMaisano.petsitting@gmail.com',
      image: `${siteUrl}/icons/icon-512.png`,
      priceRange: '$$',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Wellington',
        addressRegion: 'FL',
        postalCode: '33414',
        addressCountry: 'US',
      },
      areaServed: [
        { '@type': 'City', name: 'West Palm Beach' },
        { '@type': 'City', name: 'Wellington' },
        { '@type': 'City', name: 'Palm Beach Gardens' },
        { '@type': 'City', name: 'Lake Worth' },
        { '@type': 'City', name: 'Boynton Beach' },
        { '@type': 'City', name: 'Greenacres' },
        { '@type': 'City', name: 'Loxahatchee' },
        { '@type': 'City', name: 'Westlake' },
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Pet Sitting Services',
        itemListElement: [
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Pet Sitting Visit',
              description:
                'In-home pet sitting visit. $40 for 1–2 dogs or cats; $45 for 2+ mixed dogs and cats.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Overnight / Day Stay',
              description:
                'Overnight or full-day pet stay. $110 for 1–2 dogs; $130 for 2+ dogs; $135 for 2+ mixed dogs and cats.',
            },
          },
          {
            '@type': 'Offer',
            itemOffered: {
              '@type': 'Service',
              name: 'Dog Walking',
              description: 'Standalone dog walking service. $30 per walk.',
            },
          },
        ],
      },
    },
  ],
}

export const metadata: Metadata = {
  title: "Brooke's Trusty Paws Co. | Palm Beach's Favorite Pet Sitter",
  description:
    'Professional pet & home care in the West Palm Beach area. In-home visits, overnight stays, and dog walking by Brooke Maisano. 4 years vet experience, all friendly breeds welcome.',
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
      <head>
        {/* iOS home screen icon — Safari reads this, not the manifest */}
        <link rel="apple-touch-icon" href="/images/Transparent_Logo_Icons.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col antialiased">
        <PageViewTracker />
        {children}
        <Analytics />
      </body>
    </html>
  )
}
