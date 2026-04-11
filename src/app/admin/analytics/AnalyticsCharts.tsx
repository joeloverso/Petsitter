'use client'

import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts'

const OCEAN     = '#76bcb7'
const CORAL     = '#fe8769'
const SUNSHINE  = '#fed87d'
const DRIFTWOOD = '#8b6f4e'

const TOOLTIP_STYLE = {
  borderRadius: 12,
  border: 'none',
  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
  fontSize: 12,
}

type DailyPoint   = { date: string; count: number }
type DowPoint     = { day: string; count: number }
type SourcePoint  = { source: string; count: number }
type DevicePoint  = { device: string; count: number }

interface Props {
  dailyTrend:     DailyPoint[]
  dowData:        DowPoint[]
  trafficSources: SourcePoint[]
  deviceData:     DevicePoint[]
  avgDaily:       number
  peakDay:        { date: string; count: number } | null
}

export default function AnalyticsCharts({
  dailyTrend, dowData, trafficSources, deviceData, avgDaily, peakDay,
}: Props) {
  const totalVisits = deviceData.reduce((s, d) => s + d.count, 0)

  return (
    <div className="space-y-6">

      {/* Extra stat cards */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-driftwood">{avgDaily.toFixed(1)}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Avg Daily Visits (30d)</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
          <p className="text-3xl font-bold text-driftwood">{peakDay?.count ?? 0}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">
            {peakDay ? `Peak Day (${peakDay.date})` : 'Peak Day (30d)'}
          </p>
        </div>
      </div>

      {/* Daily trend */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-driftwood mb-5">Daily Visits — Last 30 Days</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={dailyTrend} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              interval={4}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip cursor={{ fill: '#f5ebdf' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" name="Visits" fill={OCEAN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Traffic sources */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-driftwood mb-5">Traffic Sources (30d)</h2>
          {trafficSources.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart
                data={trafficSources}
                layout="vertical"
                margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
              >
                <XAxis
                  type="number"
                  tick={{ fontSize: 10, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <YAxis
                  type="category"
                  dataKey="source"
                  tick={{ fontSize: 11, fill: '#6b7280' }}
                  axisLine={false}
                  tickLine={false}
                  width={68}
                />
                <Tooltip cursor={{ fill: '#f5ebdf' }} contentStyle={TOOLTIP_STYLE} />
                <Bar dataKey="count" name="Visits" fill={CORAL} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No referrer data yet.</p>
          )}
        </div>

        {/* Device split */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-semibold text-driftwood mb-5">Device Split (30d)</h2>
          {totalVisits > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={160}>
                <PieChart>
                  <Pie
                    data={deviceData}
                    dataKey="count"
                    nameKey="device"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={72}
                    paddingAngle={3}
                  >
                    {deviceData.map((_, i) => (
                      <Cell key={i} fill={i === 0 ? OCEAN : CORAL} />
                    ))}
                  </Pie>
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span style={{ fontSize: 12, color: '#6b7280' }}>{v}</span>
                    )}
                  />
                  <Tooltip contentStyle={TOOLTIP_STYLE} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex justify-center gap-6 mt-2 text-sm">
                {deviceData.map((d) => (
                  <span key={d.device} className="text-gray-500">
                    <span className="font-semibold text-driftwood">
                      {totalVisits > 0 ? Math.round((d.count / totalVisits) * 100) : 0}%
                    </span>{' '}
                    {d.device}
                  </span>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-sm text-center py-8">No data yet.</p>
          )}
        </div>
      </div>

      {/* Day of week */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-semibold text-driftwood mb-5">Visits by Day of Week (30d)</h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={dowData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
            <XAxis
              dataKey="day"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
            />
            <Tooltip cursor={{ fill: '#f5ebdf' }} contentStyle={TOOLTIP_STYLE} />
            <Bar dataKey="count" name="Visits" fill={SUNSHINE} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

    </div>
  )
}
