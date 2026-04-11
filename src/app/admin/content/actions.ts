'use server'

import { createClient, createServiceClient } from '@/lib/supabase/server'

async function requireAuth() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated — please log in again.')
}

// ─── FAQs ────────────────────────────────────────────────────────────────────

export async function saveFaq(
  id: string,
  question: string,
  answer: string,
  active: boolean,
) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('faqs').update({ question, answer, active }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addFaq(sort_order: number) {
  await requireAuth()
  const db = await createServiceClient()
  const { data, error } = await db
    .from('faqs')
    .insert({ question: 'New Question', answer: 'New Answer', active: true, sort_order })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as { id: string; question: string; answer: string; sort_order: number; active: boolean }
}

export async function removeFaq(id: string) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('faqs').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function reorderFaqs(updates: { id: string; sort_order: number }[]) {
  await requireAuth()
  const db = await createServiceClient()
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      db.from('faqs').update({ sort_order }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
}

// ─── Services ────────────────────────────────────────────────────────────────

export async function saveService(
  id: string,
  fields: {
    name: string
    description: string
    base_price_low: number
    base_price_high: number
    pricing_notes: string
    active: boolean
  },
) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('services').update(fields).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addService(sort_order: number) {
  await requireAuth()
  const db = await createServiceClient()
  const { data, error } = await db
    .from('services')
    .insert({
      name: 'New Service',
      description: '',
      base_price_low: 0,
      base_price_high: 0,
      pricing_notes: '',
      active: false,
      sort_order,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as {
    id: string
    name: string
    description: string
    base_price_low: number
    base_price_high: number
    pricing_notes: string
    active: boolean
    sort_order: number
  }
}

export async function removeService(id: string) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('services').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

// ─── Service Area Config ──────────────────────────────────────────────────────

async function geocodeZip(zip: string): Promise<{ lat: number; lng: number }> {
  const params = new URLSearchParams({
    postalcode: zip,
    countrycodes: 'us',
    format: 'json',
    limit: '1',
  })
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: { 'Accept-Language': 'en', 'User-Agent': 'trustypawco.com' },
  })
  const data = await res.json()
  if (!data || data.length === 0) throw new Error(`Could not find coordinates for zip code ${zip}.`)
  return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
}

export async function saveServiceAreaConfig(homeZip: string, radiusMiles: number) {
  await requireAuth()
  const db = await createServiceClient()

  const { lat, lng } = await geocodeZip(homeZip)

  // Upsert — table always has exactly one row
  const { data: existing } = await db.from('service_area_config').select('id').single()
  if (existing?.id) {
    const { error } = await db
      .from('service_area_config')
      .update({ home_zip: homeZip, home_lat: lat, home_lng: lng, radius_miles: radiusMiles })
      .eq('id', existing.id)
    if (error) throw new Error(error.message)
  } else {
    const { error } = await db
      .from('service_area_config')
      .insert({ home_zip: homeZip, home_lat: lat, home_lng: lng, radius_miles: radiusMiles })
    if (error) throw new Error(error.message)
  }
}
