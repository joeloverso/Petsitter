import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://trustypawco.com'
  return NextResponse.redirect(`${siteUrl}/admin/dashboard`)
}
