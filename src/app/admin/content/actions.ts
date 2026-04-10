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

// ─── Service Area ─────────────────────────────────────────────────────────────

export async function saveServiceArea(id: string, city: string, zip_codes: string[]) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('service_area').update({ city, zip_codes }).eq('id', id)
  if (error) throw new Error(error.message)
}

export async function addServiceArea(sort_order: number) {
  await requireAuth()
  const db = await createServiceClient()
  const { data, error } = await db
    .from('service_area')
    .insert({ city: 'New City', zip_codes: [], sort_order })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as { id: string; city: string; zip_codes: string[]; sort_order: number }
}

export async function removeServiceArea(id: string) {
  await requireAuth()
  const db = await createServiceClient()
  const { error } = await db.from('service_area').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export async function reorderServiceAreas(updates: { id: string; sort_order: number }[]) {
  await requireAuth()
  const db = await createServiceClient()
  const results = await Promise.all(
    updates.map(({ id, sort_order }) =>
      db.from('service_area').update({ sort_order }).eq('id', id)
    )
  )
  const failed = results.find((r) => r.error)
  if (failed?.error) throw new Error(failed.error.message)
}
