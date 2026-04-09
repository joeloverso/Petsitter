import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('id, name, message, created_at, read')
    .order('created_at', { ascending: false })
    .limit(5)

  const { count: unreadCount } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('read', false)

  return (
    <div className="max-w-4xl">

      {/* Header banner */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-4 sm:p-6 mb-8 flex items-center gap-3 sm:gap-6">
        <Image
          src="/images/Transparent_Logo.png"
          alt="Brooke's Trusty Paws Co."
          width={100}
          height={100}
          className="object-contain shrink-0 w-14 h-14 sm:w-24 sm:h-24"
        />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl sm:text-3xl text-driftwood mb-0.5 truncate">Dashboard</h1>
          <p className="text-gray-400 text-sm sm:text-base">Welcome back punk</p>
        </div>
        <div className="relative w-14 h-14 sm:w-20 sm:h-20 rounded-full overflow-hidden border-4 border-sand shadow-md shrink-0">
          <Image
            src="/images/Brooke_Profile_Trimmed.png"
            alt="Brooke"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <StatCard label="Unread Messages" value={unreadCount ?? 0} icon="✉️" accent="coral" href="/admin/messages" />
        <StatCard label="View Calendar" value="📅" icon="📅" accent="ocean" href="/admin/calendar" />
        <StatCard label="Analytics" value="📊" icon="📊" accent="sand" href="/admin/analytics" />
        <StatCard label="Edit Content" value="✏️" icon="✏️" accent="seafoam" href="/admin/content" />
      </div>

      {/* Recent messages */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-driftwood">Recent Messages</h2>
          <Link href="/admin/messages" className="text-sm text-ocean font-semibold hover:underline">
            View all
          </Link>
        </div>
        {messages && messages.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <li key={msg.id}>
                <Link
                  href={`/admin/messages/${msg.id}`}
                  className="flex items-start gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${msg.read ? 'bg-gray-200' : 'bg-coral'}`} />
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${msg.read ? 'text-gray-500' : 'text-driftwood'}`}>
                      {msg.name}
                    </p>
                    <p className="text-sm text-gray-400 truncate">{msg.message}</p>
                  </div>
                  <time className="text-xs text-gray-400 shrink-0">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-8 text-center text-gray-400 text-sm">No messages yet.</p>
        )}
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  icon,
  accent,
  href,
}: {
  label: string
  value: string | number
  icon: string
  accent: string
  href: string
}) {
  const accentMap: Record<string, string> = {
    coral: 'bg-coral/10 text-coral',
    ocean: 'bg-ocean/10 text-ocean',
    sand: 'bg-sand/30 text-driftwood',
    seafoam: 'bg-seafoam/30 text-deep-ocean',
  }

  return (
    <Link
      href={href}
      className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow flex flex-col gap-2"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${accentMap[accent]}`}>
        {icon}
      </div>
      <p className="text-2xl font-bold text-driftwood">{typeof value === 'number' ? value : ''}</p>
      <p className="text-xs text-gray-500 font-medium">{label}</p>
    </Link>
  )
}
