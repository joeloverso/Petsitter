import { NextResponse } from 'next/server'

const CALENDAR_ID = 'brookemaisano.petsitting@gmail.com'
const TZ = 'America/New_York'

export const dynamic = 'force-dynamic'

export async function GET() {
  const apiKey = process.env.GOOGLE_CALENDAR_API_KEY

  if (!apiKey) {
    return NextResponse.json({ busy: [], configured: false, debug: 'GOOGLE_CALENDAR_API_KEY not set' })
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
      }
    )

    const body = await res.json()

    if (!res.ok) {
      console.error('[freebusy] Google API error:', res.status, body)
      return NextResponse.json({
        busy: [],
        configured: true,
        error: true,
        debug: body?.error?.message ?? `HTTP ${res.status}`,
      })
    }

    const calData = body.calendars?.[CALENDAR_ID]
    const calErrors = calData?.errors

    if (calErrors?.length) {
      const reason = calErrors[0]?.reason ?? 'unknown'
      console.error('[freebusy] calendar error:', calErrors)
      return NextResponse.json({
        busy: [],
        configured: true,
        error: true,
        debug: `Calendar not accessible: ${reason}. Make sure the calendar is set to "Make available to public" in Google Calendar settings.`,
      })
    }

    const busy: { start: string; end: string }[] = calData?.busy ?? []

    return NextResponse.json({
      busy,
      configured: true,
      debug: busy.length === 0 ? 'API reachable but 0 busy slots returned. Events must be marked as "Busy" (not "Free") in Google Calendar to appear here. All-day events default to Free.' : null,
    })
  } catch (err) {
    console.error('[freebusy] fetch failed:', err)
    return NextResponse.json({
      busy: [],
      configured: true,
      error: true,
      debug: String(err),
    })
  }
}
