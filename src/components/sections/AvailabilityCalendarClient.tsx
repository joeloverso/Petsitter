'use client'

import { useEffect, useState } from 'react'

type BusySlot = { start: string; end: string }

// Convert a UTC ISO string to a YYYY-MM-DD date string in Eastern time
function toEasternDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
}

function getBusyDateSet(slots: BusySlot[]): Set<string> {
  const busy = new Set<string>()
  for (const slot of slots) {
    // Walk day-by-day from start to end (in Eastern time)
    const startDate = new Date(toEasternDate(slot.start) + 'T00:00:00-05:00')
    const endDate = new Date(toEasternDate(slot.end) + 'T00:00:00-05:00')
    const cursor = new Date(startDate)
    while (cursor <= endDate) {
      busy.add(cursor.toLocaleDateString('en-CA', { timeZone: 'America/New_York' }))
      cursor.setDate(cursor.getDate() + 1)
    }
  }
  return busy
}

const DOW = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function MonthGrid({
  year,
  month,
  busyDates,
  todayStr,
}: {
  year: number
  month: number
  busyDates: Set<string>
  todayStr: string
}) {
  const firstDow = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const label = new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const cells: (number | null)[] = [
    ...Array(firstDow).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  return (
    <div>
      <p className="text-white font-bold text-center mb-3 text-sm">{label}</p>
      <div className="grid grid-cols-7 gap-1 mb-1">
        {DOW.map((d) => (
          <span key={d} className="text-center text-xs text-white/50 font-semibold">
            {d}
          </span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {cells.map((d, i) => {
          if (!d) return <span key={i} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
          const isPast = dateStr < todayStr
          const isToday = dateStr === todayStr
          const isBusy = !isPast && busyDates.has(dateStr)

          return (
            <div
              key={i}
              title={isBusy ? 'Booked' : isPast ? '' : 'Available'}
              className={[
                'aspect-square flex items-center justify-center rounded-lg text-xs font-medium select-none',
                isPast ? 'text-white/25' : '',
                isBusy ? 'bg-coral/80 text-white' : '',
                !isPast && !isBusy ? 'bg-white/10 text-white hover:bg-white/20' : '',
                isToday ? 'ring-2 ring-white ring-offset-1 ring-offset-transparent' : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {d}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function AvailabilityCalendarClient() {
  const [busyDates, setBusyDates] = useState<Set<string>>(new Set())
  const [status, setStatus] = useState<'loading' | 'ok' | 'unconfigured' | 'error'>('loading')

  useEffect(() => {
    fetch('/api/calendar/freebusy')
      .then((r) => r.json())
      .then((data) => {
        if (!data.configured) {
          setStatus('unconfigured')
          return
        }
        if (data.error) {
          setStatus('error')
          return
        }
        setBusyDates(getBusyDateSet(data.busy ?? []))
        setStatus('ok')
      })
      .catch(() => setStatus('error'))
  }, [])

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'America/New_York' })
  const now = new Date()

  const months = [0, 1, 2].map((offset) => {
    const m = now.getMonth() + offset
    return { year: now.getFullYear() + Math.floor(m / 12), month: m % 12 }
  })

  if (status === 'loading') {
    return (
      <div className="text-white/50 text-center py-12 text-sm">
        Loading availability...
      </div>
    )
  }

  if (status === 'unconfigured') {
    return (
      <div className="text-white/50 text-center py-12 text-sm">
        Calendar not yet configured — contact Brooke to check availability.
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="text-white/50 text-center py-12 text-sm">
        Unable to load calendar. Please reach out directly to check availability.
      </div>
    )
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {months.map(({ year, month }) => (
          <MonthGrid
            key={`${year}-${month}`}
            year={year}
            month={month}
            busyDates={busyDates}
            todayStr={todayStr}
          />
        ))}
      </div>
      <div className="flex items-center gap-6 justify-center mt-6 text-xs text-white/70">
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-coral/80 inline-block" />
          Booked
        </span>
        <span className="flex items-center gap-2">
          <span className="w-3 h-3 rounded bg-white/10 inline-block" />
          Available
        </span>
      </div>
    </div>
  )
}
