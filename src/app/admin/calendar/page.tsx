export const dynamic = 'force-dynamic'

export default function AdminCalendar() {
  const calendarUrl = process.env.NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL

  return (
    <div className="max-w-5xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Calendar</h1>
      <p className="text-gray-500 mb-8">Your Google Calendar, showing free/busy availability.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {calendarUrl ? (
          <iframe
            src={calendarUrl}
            className="w-full h-[700px]"
            frameBorder="0"
            scrolling="no"
            title="Availability Calendar"
          />
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Calendar URL not configured. Add NEXT_PUBLIC_GOOGLE_CALENDAR_EMBED_URL to .env.local
          </div>
        )}
      </div>
    </div>
  )
}
