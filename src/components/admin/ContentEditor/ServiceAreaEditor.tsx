'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type ServiceArea } from '@/app/admin/content/ContentTabs'

export default function ServiceAreaEditor({ initialServiceArea }: { initialServiceArea: ServiceArea[] }) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialServiceArea)
  const [saving, setSaving] = useState<string | null>(null)
  const [newZip, setNewZip] = useState<Record<string, string>>({})
  const supabase = createClient()

  async function handleSave(area: ServiceArea) {
    setSaving(area.id)
    await supabase
      .from('service_area')
      .update({ city: area.city, zip_codes: area.zip_codes })
      .eq('id', area.id)
    setSaving(null)
  }

  function addZip(areaId: string) {
    const zip = (newZip[areaId] || '').trim()
    if (!zip) return
    setAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, zip_codes: [...a.zip_codes, zip] } : a
      )
    )
    setNewZip((prev) => ({ ...prev, [areaId]: '' }))
  }

  function removeZip(areaId: string, zip: string) {
    setAreas((prev) =>
      prev.map((a) =>
        a.id === areaId ? { ...a, zip_codes: a.zip_codes.filter((z) => z !== zip) } : a
      )
    )
  }

  return (
    <div className="space-y-5">
      {areas.map((area) => (
        <div key={area.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-lg">📍</span>
            <input
              className="text-lg font-bold text-driftwood bg-transparent border-b border-transparent hover:border-sand focus:border-ocean outline-none transition-colors flex-1"
              value={area.city}
              onChange={(e) =>
                setAreas((prev) =>
                  prev.map((a) => (a.id === area.id ? { ...a, city: e.target.value } : a))
                )
              }
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {area.zip_codes.map((zip) => (
              <span
                key={zip}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 bg-seafoam/30 text-deep-ocean rounded-full font-medium"
              >
                {zip}
                <button
                  onClick={() => removeZip(area.id, zip)}
                  className="text-deep-ocean/50 hover:text-coral transition-colors leading-none"
                >
                  ×
                </button>
              </span>
            ))}
          </div>

          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Add zip code"
              value={newZip[area.id] || ''}
              onChange={(e) => setNewZip((prev) => ({ ...prev, [area.id]: e.target.value }))}
              onKeyDown={(e) => e.key === 'Enter' && addZip(area.id)}
              className="border border-gray-100 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-ocean w-36"
            />
            <button
              onClick={() => addZip(area.id)}
              className="px-4 py-2 bg-seafoam/40 text-deep-ocean rounded-xl text-sm font-semibold hover:bg-seafoam/60 transition-colors"
            >
              Add
            </button>
          </div>

          <button
            onClick={() => handleSave(area)}
            disabled={saving === area.id}
            className="px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60"
          >
            {saving === area.id ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      ))}
    </div>
  )
}
