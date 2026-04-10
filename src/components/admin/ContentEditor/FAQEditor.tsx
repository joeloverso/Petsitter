'use client'

import { useRef, useState } from 'react'
import { type FAQ } from '@/app/admin/content/ContentTabs'
import { saveFaq, addFaq, removeFaq, reorderFaqs } from '@/app/admin/content/actions'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function FAQEditor({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [saveStates, setSaveStates] = useState<Record<string, SaveState>>({})
  const [adding, setAdding] = useState(false)
  const [addError, setAddError] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)

  function setSaveState(id: string, state: SaveState) {
    setSaveStates((prev) => ({ ...prev, [id]: state }))
    if (state === 'saved' || state === 'error') {
      setTimeout(() => setSaveStates((prev) => ({ ...prev, [id]: 'idle' })), 3000)
    }
  }

  async function handleSave(faq: FAQ) {
    setSaveState(faq.id, 'saving')
    try {
      await saveFaq(faq.id, faq.question, faq.answer, faq.active)
      setSaveState(faq.id, 'saved')
    } catch (e) {
      console.error('FAQ save failed:', e)
      setSaveState(faq.id, 'error')
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    setSaveState(id, 'saving')
    try {
      await removeFaq(id)
      setFaqs((prev) => prev.filter((f) => f.id !== id))
    } catch (e) {
      console.error('FAQ delete failed:', e)
      setSaveState(id, 'error')
    }
  }

  async function handleAdd() {
    setAdding(true)
    setAddError(null)
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0
    try {
      const data = await addFaq(maxOrder + 1)
      setFaqs((prev) => [...prev, data])
    } catch (e) {
      console.error('FAQ add failed:', e)
      setAddError((e as Error).message)
    }
    setAdding(false)
  }

  function updateField(id: string, field: keyof FAQ, value: string | boolean) {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  async function handleDrop(toIndex: number) {
    const fromIndex = dragItem.current
    dragItem.current = null
    setDragOverIndex(null)
    if (fromIndex === null || fromIndex === toIndex) return

    const reordered = [...faqs]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)
    const updated = reordered.map((f, i) => ({ ...f, sort_order: i + 1 }))
    setFaqs(updated)

    try {
      await reorderFaqs(updated.map(({ id, sort_order }) => ({ id, sort_order })))
    } catch (e) {
      console.error('FAQ reorder failed:', e)
    }
  }

  function saveLabel(id: string) {
    const s = saveStates[id] ?? 'idle'
    if (s === 'saving') return 'Saving...'
    if (s === 'saved') return '✓ Saved'
    if (s === 'error') return '✕ Failed'
    return 'Save'
  }

  function saveBtnClass(id: string) {
    const s = saveStates[id] ?? 'idle'
    if (s === 'saved') return 'px-5 py-2 bg-green-500 text-white rounded-full text-sm font-bold transition-colors'
    if (s === 'error') return 'px-5 py-2 bg-coral text-white rounded-full text-sm font-bold transition-colors'
    return 'px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60'
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div
          key={faq.id}
          draggable
          onDragStart={() => { dragItem.current = index }}
          onDragEnter={() => setDragOverIndex(index)}
          onDragEnd={() => handleDrop(dragOverIndex ?? index)}
          onDragOver={(e) => e.preventDefault()}
          className={`bg-white rounded-2xl border shadow-sm p-6 transition-all ${
            dragOverIndex === index ? 'border-ocean scale-[1.01]' : 'border-gray-100'
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className="mt-1 text-gray-300 cursor-grab active:cursor-grabbing select-none text-xl leading-none pt-0.5"
              title="Drag to reorder"
            >
              ⠿
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-3">
                <input
                  className="flex-1 text-sm font-bold text-driftwood bg-transparent border-b border-transparent hover:border-sand focus:border-ocean outline-none transition-colors"
                  value={faq.question}
                  onChange={(e) => updateField(faq.id, 'question', e.target.value)}
                  placeholder="Question"
                />
                <label className="flex items-center gap-1.5 text-xs text-gray-400 cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={faq.active}
                    onChange={(e) => updateField(faq.id, 'active', e.target.checked)}
                    className="accent-ocean"
                  />
                  Active
                </label>
              </div>
              <textarea
                rows={3}
                className="w-full text-sm text-gray-600 border border-gray-100 rounded-xl px-3 py-2 focus:outline-none focus:border-ocean resize-none mb-4"
                value={faq.answer}
                onChange={(e) => updateField(faq.id, 'answer', e.target.value)}
                placeholder="Answer"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => handleSave(faq)}
                  disabled={saveStates[faq.id] === 'saving'}
                  className={saveBtnClass(faq.id)}
                >
                  {saveLabel(faq.id)}
                </button>
                <button
                  onClick={() => handleDelete(faq.id)}
                  className="px-5 py-2 text-gray-400 hover:text-coral text-sm font-semibold rounded-full hover:bg-coral/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}

      {addError && (
        <p className="text-sm text-coral bg-coral/10 px-4 py-2 rounded-xl">✕ {addError}</p>
      )}
      <button
        onClick={handleAdd}
        disabled={adding}
        className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-sm font-semibold text-gray-400 hover:border-ocean hover:text-ocean transition-colors disabled:opacity-60"
      >
        {adding ? 'Adding...' : '+ Add FAQ'}
      </button>
    </div>
  )
}
