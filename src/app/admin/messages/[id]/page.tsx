import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import DeleteMessageButton from './DeleteMessageButton'

export const dynamic = 'force-dynamic'

export default async function MessageDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: msg } = await supabase
    .from('messages')
    .select('*')
    .eq('id', id)
    .single()

  if (!msg) notFound()

  // Mark as read
  await supabase.from('messages').update({ read: true }).eq('id', id)

  const phoneNumber = process.env.NEXT_PUBLIC_GOOGLE_VOICE_NUMBER

  return (
    <div className="max-w-2xl">
      <Link href="/admin/messages" className="text-sm text-ocean font-semibold hover:underline mb-6 inline-block">
        ← Back to Messages
      </Link>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="font-display text-2xl text-driftwood">{msg.name}</h1>
            <time className="text-sm text-gray-400">
              {new Date(msg.created_at).toLocaleString()}
            </time>
          </div>
          <DeleteMessageButton id={id} />
        </div>

        {/* Contact info */}
        <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-gray-50 rounded-xl text-sm">
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Email</p>
            <p className="text-gray-700">{msg.email || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Phone</p>
            <p className="text-gray-700">{msg.phone || 'N/A'}</p>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Preferred Contact</p>
            <p className="text-gray-700 capitalize">{msg.preferred_contact}</p>
          </div>
        </div>

        {/* Message */}
        <div className="mb-8">
          <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-2">Message</p>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
        </div>

        {/* Quick reply actions */}
        <div className="flex flex-wrap gap-3 pt-6 border-t border-gray-100">
          {msg.email && (
            <a
              href={`mailto:${msg.email}?subject=Re: Your Inquiry - Brooke's Trusty Paws Co.`}
              className="flex items-center gap-2 px-5 py-2.5 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors"
            >
              ✉️ Reply via Email
            </a>
          )}
          {msg.phone && (
            <a
              href={`sms:${msg.phone}`}
              className="flex items-center gap-2 px-5 py-2.5 bg-coral text-white rounded-full text-sm font-bold hover:bg-light-coral transition-colors"
            >
              💬 Reply via Text
            </a>
          )}
          {!msg.phone && phoneNumber && (
            <p className="text-xs text-gray-400 self-center">
              No phone provided. Use email to reply.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
