import { createClient } from '@/lib/supabase/server'
import AnalyticsCharts from './AnalyticsCharts'

export const dynamic = 'force-dynamic'

function startOf(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

function getSource(referrer: string | null | undefined): string {
  if (!referrer) return 'Direct'
  if (/google/i.test(referrer)) return 'Google'
  if (/instagram/i.test(referrer)) return 'Instagram'
  if (/facebook|fb\./i.test(referrer)) return 'Facebook'
  if (/bing/i.test(referrer)) return 'Bing'
  if (/tiktok/i.test(referrer)) return 'TikTok'
  try {
    return new URL(referrer).hostname.replace(/^www\./, '')
  } catch {
    return 'Other'
  }
}

export default async function AdminAnalytics() {
  const supabase = await createClient()

  const [
    { count: totalViews },
    { count: viewsToday },
    { count: views7d },
    { count: views30d },
    { data: rawViews },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(0)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(7)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(30)),
    supabase.from('page_views').select('created_at, referrer, user_agent').gte('created_at', startOf(30)),
  ])

  // ── Daily trend (last 30 days, zero-filled) ──────────────────────────────
  const dailyMap = new Map<string, number>()
  for (let i = 29; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    dailyMap.set(d.toISOString().slice(0, 10), 0)
  }
  rawViews?.forEach((v) => {
    const date = v.created_at.slice(0, 10)
    if (dailyMap.has(date)) dailyMap.set(date, (dailyMap.get(date) ?? 0) + 1)
  })
  const dailyTrend = Array.from(dailyMap.entries()).map(([date, count]) => ({
    date: date.slice(5), // MM-DD
    count,
  }))

  // ── Day of week ──────────────────────────────────────────────────────────
  const DOW = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const dowCounts = [0, 0, 0, 0, 0, 0, 0]
  rawViews?.forEach((v) => { dowCounts[new Date(v.created_at).getDay()]++ })
  const dowData = DOW.map((day, i) => ({ day, count: dowCounts[i] }))

  // ── Traffic sources ──────────────────────────────────────────────────────
  const sourceMap = new Map<string, number>()
  rawViews?.forEach((v) => {
    const s = getSource(v.referrer)
    sourceMap.set(s, (sourceMap.get(s) ?? 0) + 1)
  })
  const trafficSources = Array.from(sourceMap.entries())
    .map(([source, count]) => ({ source, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 7)

  // ── Device split ─────────────────────────────────────────────────────────
  let mobileCount = 0
  rawViews?.forEach((v) => {
    if (/Mobile|Android|iPhone|iPad/i.test(v.user_agent ?? '')) mobileCount++
  })
  const deviceData = [
    { device: 'Mobile', count: mobileCount },
    { device: 'Desktop', count: (rawViews?.length ?? 0) - mobileCount },
  ]

  // ── Derived stats ────────────────────────────────────────────────────────
  const avgDaily = (views30d ?? 0) / 30
  const peakEntry = Array.from(dailyMap.entries()).reduce(
    (best, [date, count]) => (count > best.count ? { date, count } : best),
    { date: '', count: 0 },
  )
  const peakDay = peakEntry.count > 0
    ? { date: peakEntry.date.slice(5), count: peakEntry.count }
    : null

  const stats = [
    { label: 'All Time',     value: totalViews ?? 0 },
    { label: 'Last 30 Days', value: views30d ?? 0 },
    { label: 'Last 7 Days',  value: views7d ?? 0 },
    { label: 'Today',        value: viewsToday ?? 0 },
  ]

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Analytics</h1>
      <p className="text-gray-500 mb-8">Website visitor stats.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-driftwood">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <AnalyticsCharts
        dailyTrend={dailyTrend}
        dowData={dowData}
        trafficSources={trafficSources}
        deviceData={deviceData}
        avgDaily={avgDaily}
        peakDay={peakDay}
      />
    </div>
  )
}
