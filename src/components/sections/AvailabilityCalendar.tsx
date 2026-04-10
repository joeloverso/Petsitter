import WaveDivider from '@/components/layout/WaveDivider'
import AvailabilityCalendarClient from './AvailabilityCalendarClient'

export default function AvailabilityCalendar() {
  return (
    <section id="calendar" className="bg-ocean/80 py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <p className="text-white/70 font-semibold tracking-widest text-sm uppercase mb-2">
            Check Before You Book
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
            Availability
          </h2>
          <p className="text-white/80 max-w-xl mx-auto">
            View my availability below. Booked dates are highlighted in red; reach out to confirm open dates.
          </p>
        </div>

        <div className="bg-white/5 rounded-3xl border border-white/10 p-6 md:p-10">
          <AvailabilityCalendarClient />
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          Showing free/busy only. Contact Brooke to book a specific date.
        </p>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
