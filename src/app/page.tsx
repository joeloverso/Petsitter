import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Hero from '@/components/sections/Hero'
import About from '@/components/sections/About'
import Services from '@/components/sections/Services'
import CostEstimator from '@/components/sections/CostEstimator'
import ServiceArea from '@/components/sections/ServiceArea'
import AvailabilityCalendar from '@/components/sections/AvailabilityCalendar'
import FAQ from '@/components/sections/FAQ'
import Testimonials from '@/components/sections/Testimonials'
import Contact from '@/components/sections/Contact'

export const revalidate = 3600

export default async function Home() {
  const supabase = await createClient()
  const { data: images } = await supabase.from('site_images').select('key, url')

  const imageMap: Record<string, string> = Object.fromEntries(
    (images ?? []).map((img: { key: string; url: string }) => [img.key, img.url])
  )

  const profileImageUrl = imageMap['profile'] || ''

  return (
    <>
      {/* Preconnect to Supabase storage so the LCP image fetch doesn't pay DNS+TCP+TLS */}
      <link rel="preconnect" href="https://hiwiwxwzdtjesrnvwuwo.supabase.co" />
      {/* If a custom profile photo is stored in Supabase, preload the optimized version.
          The static fallback is preloaded unconditionally from layout.tsx. */}
      {profileImageUrl && (
        <link
          rel="preload"
          as="image"
          href={`/_next/image?url=${encodeURIComponent(profileImageUrl)}&w=384&q=75`}
          imageSrcSet={`/_next/image?url=${encodeURIComponent(profileImageUrl)}&w=384&q=75 384w, /_next/image?url=${encodeURIComponent(profileImageUrl)}&w=640&q=75 640w, /_next/image?url=${encodeURIComponent(profileImageUrl)}&w=828&q=75 828w`}
          imageSizes="(max-width: 768px) 288px, 384px"
        />
      )}
      <Navbar />
      <main>
        <Hero profileImageUrl={profileImageUrl} />
        <About
          petImageUrls={[imageMap['pet_1'] || '', imageMap['pet_2'] || '']}
          familyImageUrls={[imageMap['family_1'] || '', imageMap['family_2'] || '']}
        />
        <Services />
        <CostEstimator />
        <ServiceArea />
        <AvailabilityCalendar />
        <FAQ />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
