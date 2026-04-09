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

export default async function Home() {
  const supabase = await createClient()
  const { data: images } = await supabase.from('site_images').select('key, url')

  const imageMap: Record<string, string> = Object.fromEntries(
    (images ?? []).map((img: { key: string; url: string }) => [img.key, img.url])
  )

  return (
    <>
      <Navbar />
      <main>
        <Hero profileImageUrl={imageMap['profile'] || ''} />
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
