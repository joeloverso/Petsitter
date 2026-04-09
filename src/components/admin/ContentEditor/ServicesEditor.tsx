'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type Service } from '@/app/admin/content/ContentTabs'

export default function ServicesEditor({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [saving, setSaving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  async function handleSave(service: Service) {
    setSaving(service.id)
    await supabase
      .from('services')
      .update({
        name: service.name,
        description: service.description,
        base_price_low: service.base_price_low,
        base_price_high: service.base_price_high,
        pricing_notes: service.pricing_notes,
        active: service.active,
      })
      .eq('id', service.id)
    setSaving(null)
  }

  async function handleAdd() {
    setAdding(true)
    const newService = {
      name: 'New Service',
      description: '',
      base_price_low: 0,
      base_price_high: 0,
      pricing_notes: '',
      active: false,
      sort_order: services.length + 1,
    }

    const { data, error } = await supabase
      .from('services')
      .insert(newService)
      .select()
      .single()

    if (!error && data) {
      setServices((prev) => [...prev, data])
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service? This cannot be undone.')) return
    await supabase.from('services').delete().eq('id', id)
    setServices((prev) => prev.filter((s) => s.id !== id))
  }

  function updateField(id: string, field: keyof Service, value: string | number | boolean) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  return (
    <div className="space-y-5">
      {services.map((service) => (
        <div key={service.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <input
              className="text-lg font-bold text-driftwood bg-transparent border-b border-transparent hover:border-sand focus:border-ocean outline-none transition-colors"
              value={service.name}
              onChange={(e) => updateField(service.id, 'name', e.target.value)}
            />
            <label className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={service.active}
                onChange={(e) => updateField(service.id, 'active', e.target.checked)}
                className="accent-ocean w-4 h-4"
              />
              Active
            </label>
          </div>

          <textarea
            rows={2}
            className="w-full text-sm text-gray-600 border border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean resize-none mb-4"
            value={service.description}
            onChange={(e) => updateField(service.id, 'description', e.target.value)}
            placeholder="Service description"
          />

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">Base Price (Low) $</label>
              <input
                type="number"
                className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean"
                value={service.base_price_low}
                onChange={(e) => updateField(service.id, 'base_price_low', Number(e.target.value))}
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 font-semibold mb-1">Base Price (High) $</label>
              <input
                type="number"
                className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean"
                value={service.base_price_high}
                onChange={(e) => updateField(service.id, 'base_price_high', Number(e.target.value))}
              />
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-gray-400 font-semibold mb-1">Pricing Notes</label>
            <textarea
              rows={3}
              className="w-full border border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean resize-none"
              value={service.pricing_notes}
              onChange={(e) => updateField(service.id, 'pricing_notes', e.target.value)}
              placeholder="One pricing line per row, e.g. $40 — 1-2 dogs or cats"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(service)}
              disabled={saving === service.id}
              className="px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60"
            >
              {saving === service.id ? 'Saving...' : 'Save Changes'}
            </button>
            <button
              onClick={() => handleDelete(service.id)}
              className="px-5 py-2 text-gray-400 hover:text-coral text-sm font-semibold rounded-full hover:bg-coral/10 transition-colors"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full py-4 border-2 border-dashed border-sand rounded-2xl text-sm font-semibold text-gray-400 hover:border-ocean hover:text-ocean transition-colors disabled:opacity-60"
      >
        {adding ? 'Adding...' : '+ Add New Service'}
      </button>
    </div>
  )
}
