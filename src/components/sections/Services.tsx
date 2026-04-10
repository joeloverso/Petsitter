import { createClient } from '@/lib/supabase/server'
import ServiceCard from '@/components/ui/ServiceCard'
import WaveDivider from '@/components/layout/WaveDivider'

const ICONS: Record<string, string> = {
  'Pet Sitting Visit': '🐾',
  'Overnight Stay': '🌙',
  'Dog Walking': '🦮',
}

const fallbackServices = [
  {
    name: 'Pet Sitting Visit',
    description: 'In-home visits for your furry friends while you\'re away. Includes feeding, walking, playtime, and medication if needed.',
    pricing_notes: '$40: 1-2 dogs or cats\n$45: 2+ dogs & cats together\n+$15: medication administration',
    active: true,
  },
  {
    name: 'Overnight Stay',
    description: 'I stay overnight in your home so your pets never feel alone. Includes everything in a pet sitting visit plus overnight companionship.',
    pricing_notes: '$110/night: 1-2 dogs\n$130/night: 2+ dogs\n$135/night: 2+ dogs & cats\n+$25/night: holidays',
    active: true,
  },
  {
    name: 'Dog Walking',
    description: 'Standalone dog walking service for when your pup just needs to stretch their legs and get some fresh air.',
    pricing_notes: '$30 per walk\nStandalone service only\nIncluded free in visit & overnight gigs',
    active: true,
  },
]

const addons = [
  { label: 'Medication administration', price: '+$15' },
  { label: 'Holiday surcharge', price: '+$25/day' },
]

export default async function Services() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('services')
    .select('name, description, pricing_notes, active')
    .eq('active', true)
    .order('sort_order')

  const services = data && data.length > 0 ? data : fallbackServices

  return (
    <section id="services" className="bg-white py-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            What I Offer
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            Petsitting Services
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Every service comes with a free meet & greet for new clients,
            because your peace of mind matters just as much as your pet&apos;s happiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((s) => (
            <ServiceCard
              key={s.name}
              icon={ICONS[s.name] ?? '🐾'}
              title={s.name}
              description={s.description}
              pricing={s.pricing_notes.split('\n').filter(Boolean)}
            />
          ))}
        </div>

        <div className="bg-sunshine/20 rounded-3xl p-6 flex flex-wrap gap-6 justify-center border border-sunshine/40">
          <p className="font-semibold text-driftwood w-full text-center mb-1">Add-ons</p>
          {addons.map((a) => (
            <div key={a.label} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-coral font-bold text-base">✦</span>
              <span>
                <strong>{a.price}</strong>: {a.label}
              </span>
            </div>
          ))}
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          Holidays not available: Christmas Eve, Christmas Day, Thanksgiving, Easter, Valentine&apos;s Day
        </p>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
