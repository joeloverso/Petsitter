import { createClient } from '@/lib/supabase/server'
import WaveDivider from '@/components/layout/WaveDivider'
import dynamic from 'next/dynamic'

const ServiceAreaMap = dynamic(() => import('./ServiceAreaMap'), { ssr: false })

// Wellington, FL — fallback if DB row is missing
const DEFAULT_CONFIG = { home_lat: 26.6599, home_lng: -80.2423, radius_miles: 20 }

export default async function ServiceArea() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('service_area_config')
    .select('home_lat, home_lng, radius_miles')
    .single()

  const config = data ?? DEFAULT_CONFIG

  return (
    <section id="service-area" className="bg-white-sand py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Where I Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            Service Area
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Based in Wellington, FL, serving clients within {config.radius_miles} miles.
          </p>
        </div>

        <ServiceAreaMap
          centerLat={config.home_lat}
          centerLng={config.home_lng}
          radiusMiles={config.radius_miles}
        />

        <p className="text-center text-sm text-gray-400 mt-6">
          Outside the area? Reach out — I may still be able to help.
        </p>
      </div>

      <WaveDivider fillColor="#76bcb7" />
    </section>
  )
}
