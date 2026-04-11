import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const { path, referrer: bodyReferrer } = await request.json()

  if (!path) return NextResponse.json({ ok: false }, { status: 400 })

  // Skip admin routes
  if (path.startsWith('/admin')) return NextResponse.json({ ok: true })

  // Use document.referrer sent from the client — it holds the external source
  // (e.g. Yelp, Google) rather than the same-origin URL the fetch header would show.
  const referrer = typeof bodyReferrer === 'string' ? bodyReferrer : ''
  const user_agent = request.headers.get('user-agent') || ''

  const supabase = await createServiceClient()
  const { error } = await supabase.from('page_views').insert({ path, referrer, user_agent })

  if (error) {
    console.error('[track] page_views insert failed:', error.message, error.code)
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
