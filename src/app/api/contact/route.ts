import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createServiceClient } from '@/lib/supabase/server'
import { sendNewMessageNotification } from '@/lib/resend'
import { sendPushNotification } from '@/lib/webpush'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { name, email, phone, preferredContact, message } = body

  if (!name || !message) {
    return NextResponse.json({ error: 'Name and message are required' }, { status: 400 })
  }

  // Use anon client for public insert — RLS policy allows anon inserts on messages
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const { error } = await supabase.from('messages').insert({
    name,
    email: email || '',
    phone: phone || '',
    preferred_contact: preferredContact || 'email',
    message,
  })

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Failed to save message' }, { status: 500 })
  }

  try {
    await sendNewMessageNotification({ name, email: email || '', phone: phone || '', message })
  } catch (err) {
    console.error('Resend notification error:', err)
  }

  try {
    const serviceSupabase = await createServiceClient()
    const { data: subs } = await serviceSupabase.from('push_subscriptions').select('endpoint, p256dh, auth')
    if (subs && subs.length > 0) {
      await Promise.allSettled(
        subs.map((sub) =>
          sendPushNotification(sub, {
            title: `New message from ${name}`,
            body: message.slice(0, 100),
            url: '/admin/messages',
          })
        )
      )
    }
  } catch (err) {
    console.error('Push notification error:', err)
  }

  return NextResponse.json({ success: true })
}
