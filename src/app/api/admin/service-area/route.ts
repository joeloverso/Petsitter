import { NextRequest, NextResponse } from 'next/server'
import { createClient, createServiceClient } from '@/lib/supabase/server'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// POST — create a new service area
export async function POST(request: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { city, zip_codes, sort_order } = await request.json()
  const db = await createServiceClient()
  const { data, error } = await db
    .from('service_area')
    .insert({ city, zip_codes, sort_order })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PUT — update a service area (city name + zip codes)
export async function PUT(request: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, city, zip_codes } = await request.json()
  const db = await createServiceClient()
  const { error } = await db
    .from('service_area')
    .update({ city, zip_codes })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// DELETE — delete a service area
export async function DELETE(request: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await request.json()
  const db = await createServiceClient()
  const { error } = await db.from('service_area').delete().eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

// PATCH — reorder (update sort_order for all)
export async function PATCH(request: NextRequest) {
  if (!await requireAuth()) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { updates }: { updates: { id: string; sort_order: number }[] } = await request.json()
  const db = await createServiceClient()
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      db.from('service_area').update({ sort_order }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
