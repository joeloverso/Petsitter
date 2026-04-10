'use client'

import { useState } from 'react'
import { type Service } from '@/app/admin/content/ContentTabs'
import { saveService, addService, removeService } from '@/app/admin/content/actions'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ServicesEditor({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices)
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({})
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)

  function setSaveState(id: string, state: SaveState) {
    setSaveStates((prev) => ({ ...prev, [id]: state }))
    if (state === 'saved' || state === 'error') {
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [id]: 'idle' })), 3000)
    }
  }

  async function handleSave(service: Service) {
    setSaveState(service.id, 'saving')
    try {
      await saveService(service.id, {
        name: service.name,
        description: service.description,
        base_price_low: service.base_price_low,
        base_price_high: service.base_price_high,
        pricing_notes: service.pricing_notes,
        active: service.active,
      })
      setSaveState(service.id, 'saved')
    } catch (e) {
      console.error('Service save failed:', e)
      setSaveState(service.id, 'error')
    }
  }

  async function handleAdd() {
    setAdding(true)
    setAddError(null)
    try {
      const data = await addService(services.length + 1)
      setServices((prev) => [...prev, data])
    } catch (e) {
      console.error('Service add failed:', e)
      setAddError((e as Error).message)
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service? This cannot be undone.')) return
    setSaveState(id, 'saving')
    try {
      await removeService(id)
      setServices((prev) => prev.filter((s) => s.id !== id))
    } catch (e) {
      console.error('Service delete failed:', e)
      setSaveState(id, 'error')
    }
  }

  function updateField(id: string, field: keyof Service, value: string | number | boolean) {
    setServices((prev) =>
      prev.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    )
  }

  function saveLabel(id: string) {
    const s = saveStates[id] ?? 'idle'
    if (s === 'saving') return 'Saving...'
    if (s === 'saved') return '✓ Saved'
    if (s === 'error') return '✕ Failed'
    return 'Save Changes'
  }

  function saveBtnClass(id: string) {
    const s = saveStates[id] ?? 'idle'
    if (s === 'saved') return 'px-5 py-2 bg-green-500 text-white rounded-full text-sm font-bold transition-colors'
    if (s === 'error') return 'px-5 py-2 bg-coral text-white rounded-full text-sm font-bold transition-colors'
    return 'px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60'
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
              placeholder="One pricing line per row, e.g. $40: 1-2 dogs or cats"
            />
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(service)}
              disabled={saveStates[service.id] === 'saving'}
              className={saveBtnClass(service.id)}
            >
              {saveLabel(service.id)}
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

      {addError && (
        <p className="text-sm text-coral bg-coral/10 px-4 py-2 rounded-xl">✕ {addError}</p>
      )}
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
