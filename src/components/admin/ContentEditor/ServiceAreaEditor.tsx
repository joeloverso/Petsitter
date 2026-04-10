'use client'

import { useRef, useState } from 'react'
import { type ServiceArea } from '@/app/admin/content/ContentTabs'
import { saveServiceArea, addServiceArea, removeServiceArea, reorderServiceAreas } from '@/app/admin/content/actions'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function ServiceAreaEditor({ initialServiceArea }: { initialServiceArea: ServiceArea[] }) {
  const [areas, setAreas] = useState<ServiceArea[]>(initialServiceArea)
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({})
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [newZip, setNewZip] = useState<Record<string, string>>({})
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)

  function setSaveState(id: string, state: SaveState) {
    setSaveStates((prev) => ({ ...prev, [id]: state }))
    if (state === 'saved' || state === 'error') {
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [id]: 'idle' })), 3000)
    }
  }

  async function handleSave(area: ServiceArea) {
    setSaveState(area.id, 'saving')
    try {
      await saveServiceArea(area.id, area.city, area.zip_codes)
      setSaveState(area.id, 'saved')
    } catch (e) {
      console.error('Service area save failed:', e)
      setSaveState(area.id, 'error')
    }
  }

  async function handleAddArea() {
    setAdding(true)
    setAddError(null)
    const maxOrder = areas.length > 0 ? Math.max(...areas.map((a) => a.sort_order)) : 0
    try {
      const data = await addServiceArea(maxOrder + 1)
      setAreas((prev) => [...prev, data])
    } catch (e) {
      console.error('Service area add failed:', e)
      setAddError((e as Error).message)
    }
    setAdding(false)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this service area?')) return
    setSaveState(id, 'saving')
    try {
      await removeServiceArea(id)
      setAreas((prev) => prev.filter((a) => a.id !== id))
    } catch (e) {
      console.error('Service area delete failed:', e)
      setSaveState(id, 'error')
    }
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

  async function handleDrop(toIndex: number) {
    const fromIndex = dragItem.current
    dragItem.current = null
    setDragOverIndex(null)
    if (fromIndex === null || fromIndex === toIndex) return

    const reordered = [...areas]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    const updated = reordered.map((a, i) => ({ ...a, sort_order: i + 1 }))
    setAreas(updated)

    try {
      await reorderServiceAreas(updated.map(({ id, sort_order }) => ({ id, sort_order })))
    } catch (e) {
      console.error('Service area reorder failed:', e)
    }
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
      {areas.map((area, index) => (
        <div
          key={area.id}
          draggable
          onDragStart={() => { dragItem.current = index }}
          onDragEnter={() => setDragOverIndex(index)}
          onDragEnd={() => handleDrop(dragOverIndex ?? index)}
          onDragOver={(e) => e.preventDefault()}
          className={`bg-white rounded-2xl border shadow-sm p-6 transition-all ${
            dragOverIndex === index ? 'border-ocean scale-[1.01]' : 'border-gray-100'
          }`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="text-gray-300 text-xl cursor-grab active:cursor-grabbing select-none leading-none"
              title="Drag to reorder"
            >
              ⠿
            </div>
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
              Add Zip
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => handleSave(area)}
              disabled={saveStates[area.id] === 'saving'}
              className={saveBtnClass(area.id)}
            >
              {saveLabel(area.id)}
            </button>
            <button
              onClick={() => handleDelete(area.id)}
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
        onClick={handleAddArea}
        disabled={adding}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-ocean hover:text-ocean transition-colors disabled:opacity-60"
      >
        {adding ? 'Adding...' : '+ Add Service Area'}
      </button>
    </div>
  )
}
