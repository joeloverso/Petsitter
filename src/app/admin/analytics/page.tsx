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
    { data: topPages },
    { data: recent },
  ] = await Promise.all([
    supabase.from('page_views').select('*', { count: 'exact', head: true }),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(0)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(7)),
    supabase.from('page_views').select('*', { count: 'exact', head: true }).gte('created_at', startOf(30)),
    supabase.rpc('top_pages', { limit_count: 8 }).select('*'),
    supabase.from('page_views').select('path, created_at, referrer').order('created_at', { ascending: false }).limit(20),
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

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <p className="text-3xl font-bold text-driftwood">{s.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400 font-medium mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Top pages */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-driftwood">Top Pages</h2>
          </div>
          {topPages && topPages.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {topPages.map((p: { path: string; count: number }) => (
                <li key={p.path} className="flex items-center justify-between px-6 py-3">
                  <span className="text-sm text-gray-600 truncate">{p.path || '/'}</span>
                  <span className="text-sm font-semibold text-driftwood ml-4 shrink-0">{p.count}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">No data yet.</p>
          )}
        </div>

        {/* Recent visits */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="font-semibold text-driftwood">Recent Visits</h2>
          </div>
          {recent && recent.length > 0 ? (
            <ul className="divide-y divide-gray-50">
              {recent.map((v, i) => (
                <li key={i} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm text-gray-600">{v.path || '/'}</p>
                    {v.referrer && (
                      <p className="text-xs text-gray-400 truncate max-w-[180px]">{v.referrer}</p>
                    )}
                  </div>
                  <time className="text-xs text-gray-400 shrink-0 ml-4">
                    {new Date(v.created_at).toLocaleDateString()}
                  </time>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-6 py-8 text-center text-gray-400 text-sm">No data yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
