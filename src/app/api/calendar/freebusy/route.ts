import { NextResponse } from 'next/server'

const CALENDAR_ID = 'brookemaisano.petsitting@gmail.com'
const TZ = 'America/New_York'

export async function GET() {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY

  if (!apiKey) {
    return NextResponse.json({ busy: [], configured: false })
  }

  const now = new Date()
  const threeMonthsOut = new Date(now)
  threeMonthsOut.setMonth(threeMonthsOut.getMonth() + 3)

  try {
    const res = await fetch(
      `https://www.googleapis.com/calendar/v3/freeBusy?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          timeMin: now.toISOString(),
          timeMax: threeMonthsOut.toISOString(),
          timeZone: TZ,
          items: [{ id: CALENDAR_ID }],
        }),
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    )

    if (!res.ok) {
      console.error('[freebusy] Google API error:', res.status, await res.text())
      return NextResponse.json({ busy: [], configured: true, error: true })
    }

    const data = await res.json()
    const busy: { start: string; end: string }[] =
      data.calendars?.[CALENDAR_ID]?.busy ?? []

    return NextResponse.json({ busy, configured: true })
  } catch (err) {
    console.error('[freebusy] fetch failed:', err)
    return NextResponse.json({ busy: [], configured: true, error: true })
  }
}
