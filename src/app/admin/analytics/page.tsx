import { createClient } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

function startOf(days: number) {
  const d = new Date()
  d.setDate(d.getDate() - days)
  d.setHours(0, 0, 0, 0)
  return d.toISOString()
}

export default async function AdminAnalytics() {
  const supabase = await createClient()

  const [
    { count: totalViews },
    { count: viewsToday },
    { count: views7d },
    { count: views30d },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(0)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(7)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(30)),
  ])

  const stats = [
    { label: 'All Time', value: totalViews ?? 0 },
    { label: 'Last 30 Days', value: views30d ?? 0 },
    { label: 'Last 7 Days', value: views7d ?? 0 },
    { label: 'Today', value: viewsToday ?? 0 },
  ]

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Analytics</h1>
      <p className="text-gray-500 mb-8">Website visitor stats.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-driftwood">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
