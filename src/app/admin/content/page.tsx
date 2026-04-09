import { createClient } from '@/lib/supabase/server'
import ContentTabs from './ContentTabs'

export const dynamic = 'force-dynamic'

export default async function ContentPage() {
  const supabase = await createClient()

  const [{ data: services }, { data: serviceArea }, { data: faqs }, { data: images }] =
    await Promise.all([
      supabase.from('services').select('*').order('sort_order'),
      supabase.from('service_area').select('*').order('sort_order'),
      supabase.from('faqs').select('*').order('sort_order'),
      supabase.from('site_images').select('key, url'),
    ])

  return (
    <div className="max-w-4xl">
      <h1 className="font-display text-3xl text-driftwood mb-1">Edit Content</h1>
      <p className="text-gray-500 mb-8">
        Changes save instantly and appear on your website right away.
      </p>
      <ContentTabs
        initialServices={services ?? []}
        initialServiceArea={serviceArea ?? []}
        initialFaqs={faqs ?? []}
        initialImages={images ?? []}
      />
    </div>
  )
}
