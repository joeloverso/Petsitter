import ServiceCard from '@/components/ui/ServiceCard'
import WaveDivider from '@/components/layout/WaveDivider'

const services = [
  {
    icon: '🐾',
    title: 'Pet Sitting Visit',
    description:
      'In-home visits for your furry friends while you\'re away. Includes feeding, walking, playtime, and medication if needed.',
    pricing: [
      '$40 — 1-2 dogs or cats',
      '$45 — 2+ dogs & cats together',
      '+$15 — medication administration',
    ],
    notes: [
      'Visits 30 min – 1 hour depending on your pet\'s needs',
      'Insulin, oral, topical & injectable meds',
    ],
  },
  {
    icon: '🌙',
    title: 'Overnight Stay',
    description:
      'I stay overnight in your home so your pets never feel alone. Includes everything in a pet sitting visit plus overnight companionship.',
    pricing: [
      '$110/night — 1-2 dogs',
      '$130/night — 2+ dogs',
      '$135/night — 2+ dogs & cats',
      '+$25/night — holidays',
    ],
    notes: [
      'Ideal for anxious pets or long trips',
      'Your home stays cared for too',
    ],
  },
  {
    icon: '🦮',
    title: 'Dog Walking',
    description:
      'Standalone dog walking service for when your pup just needs to stretch their legs and get some fresh air.',
    pricing: [
      '$30 per walk',
      'Standalone service only',
      'Included free in visit & overnight gigs',
    ],
    notes: [
      'All friendly breeds welcome',
      'Does not accept aggressive dogs',
    ],
  },
]

const addons = [
  { label: 'Medication administration', price: '+$15' },
  { label: 'Holiday surcharge', price: '+$25/day' },
]

export default function Services() {
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
            Every service comes with a free meet & greet for new clients —
            because your peace of mind matters just as much as your pet&apos;s happiness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {services.map((s) => (
            <ServiceCard key={s.title} {...s} />
          ))}
        </div>

        {/* Add-ons callout */}
        <div className="bg-sunshine/20 rounded-3xl p-6 flex flex-wrap gap-6 justify-center border border-sunshine/40">
          <p className="font-semibold text-driftwood w-full text-center mb-1">Add-ons</p>
          {addons.map((a) => (
            <div key={a.label} className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-coral font-bold text-base">✦</span>
              <span>
                <strong>{a.price}</strong> — {a.label}
              </span>
            </div>
          ))}
        </div>

        {/* Policy note */}
        <p className="text-center text-sm text-gray-400 mt-6">
          Holidays not available: Christmas Eve, Christmas Day, Thanksgiving, Easter, Valentine&apos;s Day
        </p>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
