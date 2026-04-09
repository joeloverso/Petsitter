import WaveDivider from '@/components/layout/WaveDivider'

export default function AvailabilityCalendar() {
  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL

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
            View my availability below. Blocked dates are booked — reach out to confirm open dates.
          </p>
        </div>

        <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white/20">
          {calendarUrl ? (
            <iframe
              src={calendarUrl}
              className="w-full h-[500px] md:h-[600px] bg-white"
              frameBorder="0"
              scrolling="no"
              title="Brooke's Availability Calendar"
            />
          ) : (
            <div className="w-full h-64 bg-white/10 flex items-center justify-center rounded-3xl">
              <p className="text-white/60 text-sm">Calendar coming soon</p>
            </div>
          )}
        </div>

        <p className="text-center text-white/50 text-xs mt-4">
          Showing free/busy only — contact Brooke to book a specific date
        </p>
      </div>

      <WaveDivider fillColor="#f5ebdf" />
    </section>
  )
}
