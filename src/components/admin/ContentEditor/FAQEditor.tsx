'use client'

import { useRef, useState } from 'react'
import { type FAQ } from '@/app/admin/content/ContentTabs'

type Toast = { type: 'success' | 'error'; message: string }

export default function FAQEditor({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [saving, setSaving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState<Toast | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  function showToast(t: Toast) {
    if (toastTimer.current) clearTimeout(toastTimer.current)
    setToast(t)
    toastTimer.current = setTimeout(() => setToast(null), 3000)
  }

  async function api(method: string, body: object) {
    const res = await fetch('/api/admin/faqs', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!res.ok) throw new Error(json.error ?? 'Unknown error')
    return json
  }

  async function handleSave(faq: FAQ) {
    setSaving(faq.id)
    try {
      await api('PUT', { id: faq.id, question: faq.question, answer: faq.answer, active: faq.active })
      showToast({ type: 'success', message: 'FAQ saved.' })
    } catch (e) {
      showToast({ type: 'error', message: (e as Error).message })
    }
    setSaving(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    try {
      await api('DELETE', { id })
      setFaqs((prev) => prev.filter((f) => f.id !== id))
      showToast({ type: 'success', message: 'FAQ deleted.' })
    } catch (e) {
      showToast({ type: 'error', message: (e as Error).message })
    }
  }

  async function handleAdd() {
    setAdding(true)
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0
    try {
      const data = await api('POST', {
        question: 'New Question',
        answer: 'New Answer',
        active: true,
        sort_order: maxOrder + 1,
      })
      setFaqs((prev) => [...prev, data])
      showToast({ type: 'success', message: 'FAQ added.' })
    } catch (e) {
      showToast({ type: 'error', message: (e as Error).message })
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
      await api('PATCH', { updates: updated.map(({ id, sort_order }) => ({ id, sort_order })) })
    } catch (e) {
      showToast({ type: 'error', message: 'Reorder failed: ' + (e as Error).message })
    }
  }

  return (
    <div className="space-y-4">
      {toast && (
        <div
          className={`px-4 py-2.5 rounded-xl text-sm font-medium ${
            toast.type === 'success'
              ? 'bg-seafoam/30 text-deep-ocean'
              : 'bg-coral/10 text-coral'
          }`}
        >
          {toast.type === 'success' ? '✓ ' : '✕ '}{toast.message}
        </div>
      )}

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
                  disabled={saving === faq.id}
                  className="px-5 py-2 bg-ocean text-white rounded-full text-sm font-bold hover:bg-deep-ocean transition-colors disabled:opacity-60"
                >
                  {saving === faq.id ? 'Saving...' : 'Save'}
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
