import WaveDivider from '@/components/layout/WaveDivider'

const serviceAreas = [
  { city: 'West Palm Beach', zips: ['33401', '33402', '33403', '33404', '33405', '33406', '33407', '33408', '33409', '33410', '33411', '33412', '33413', '33415', '33416', '33417'] },
  { city: 'Palm Beach Gardens', zips: ['33408', '33418'] },
  { city: 'Wellington', zips: ['33411', '33414', '33449'] },
  { city: 'Boynton Beach', zips: ['33424', '33425', '33426', '33435', '33436'] },
  { city: 'Lake Worth', zips: ['33460', '33461'] },
  { city: 'Greenacres', zips: ['33454', '33463', '33467'] },
  { city: 'Loxahatchee / Westlake / Acreage', zips: ['33470'] },
]

export default function ServiceArea() {
  return (
    <section id="service-area" className="bg-white-sand py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Where I Work
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            Service Area
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Based in Wellington, FL, proudly serving the greater Palm Beach area.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {serviceAreas.map((area) => (
            <div
              key={area.city}
              className="bg-white rounded-3xl p-6 border border-sand/50 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xl">📍</span>
                <h3 className="font-bold text-driftwood text-lg">{area.city}</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {area.zips.map((zip) => (
                  <span
                    key={zip}
                    className="text-xs px-2.5 py-1 bg-seafoam/30 text-deep-ocean rounded-full font-medium"
                  >
                    {zip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-8">
          Don&apos;t see your zip code? Reach out; I may still be able to help!
        </p>
      </div>

      <WaveDivider fillColor="#76bcb7" />
    </section>
  )
}
