import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function MessagesPage() {
  const supabase = await createClient()

  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Messages</h1>
      <p className="text-gray-500 mb-8">All contact form submissions from your website.</p>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {messages && messages.length > 0 ? (
          <ul className="divide-y divide-gray-50">
            {messages.map((msg) => (
              <li key={msg.id}>
                <Link
                  href={`/admin/messages/${msg.id}`}
                  className="flex items-start gap-4 px-6 py-5 hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${msg.read ? 'bg-gray-200' : 'bg-coral'}`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className={`text-sm font-semibold ${msg.read ? 'text-gray-500' : 'text-driftwood'}`}>
                        {msg.name}
                      </p>
                      {!msg.read && (
                        <span className="text-xs bg-coral/10 text-coral px-2 py-0.5 rounded-full font-semibold">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 truncate">{msg.message}</p>
                    <p className="text-xs text-gray-300 mt-1">{msg.email || msg.phone}</p>
                  </div>
                  <time className="text-xs text-gray-400 shrink-0 mt-1">
                    {new Date(msg.created_at).toLocaleDateString()}
                  </time>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p className="px-6 py-12 text-center text-gray-400 text-sm">
            No messages yet. They&apos;ll appear here when clients contact you through the website.
          </p>
        )}
      </div>
    </div>
  )
}
