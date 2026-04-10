import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  // Verify the requester is an authenticated admin
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('file') as File | null
  const key = formData.get('key') as string | null

  if (!file || !key) {
    return NextResponse.json({ error: 'Missing file or key' }, { status: 400 })
  }

  const validKeys = ['profile', 'pet_1', 'pet_2', 'family_1', 'family_2']
  if (!validKeys.includes(key)) {
    return NextResponse.json({ error: 'Invalid image key' }, { status: 400 })
  }

  const ext = file.name.split('.').pop()
  const path = `${key}.${ext}`

  const serviceClient = await createServiceClient()

  const { error: uploadError } = await serviceClient.storage
    .from('site-images')
    .upload(path, file, { upsert: true, contentType: file.type })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: urlData } = serviceClient.storage
    .from('site-images')
    .getPublicUrl(path)

  const publicUrl = urlData.publicUrl

  const { error: dbError } = await serviceClient
    .from('site_images')
    .update({ url: publicUrl, updated_at: new Date().toISOString() })
    .eq('key', key)

  if (dbError) {
    return NextResponse.json({ error: dbError.message }, { status: 500 })
  }

  return NextResponse.json({ url: publicUrl })
}
