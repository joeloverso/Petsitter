'use client'

import { useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type FAQ } from '@/app/admin/content/ContentTabs'

export default function FAQEditor({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [saving, setSaving] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null)
  const dragItem = useRef<number | null>(null)
  const supabase = createClient()

  async function handleSave(faq: FAQ) {
    setSaving(faq.id)
    setError(null)
    const { error } = await supabase
      .from('faqs')
      .update({ question: faq.question, answer: faq.answer, active: faq.active })
      .eq('id', faq.id)
    if (error) setError('Failed to save: ' + error.message)
    setSaving(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    const { error } = await supabase.from('faqs').delete().eq('id', id)
    if (error) setError('Failed to delete: ' + error.message)
    else setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  async function handleAdd() {
    setAdding(true)
    setError(null)
    const maxOrder = faqs.length > 0 ? Math.max(...faqs.map((f) => f.sort_order)) : 0
    const { data, error } = await supabase
      .from('faqs')
      .insert({ question: 'New Question', answer: 'New Answer', active: true, sort_order: maxOrder + 1 })
      .select()
      .single()
    if (error) setError('Failed to add FAQ: ' + error.message)
    else setFaqs((prev) => [...prev, data])
    setAdding(false)
  }

  function updateField(id: string, field: keyof FAQ, value: string | boolean) {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  async function handleDrop(toIndex: number) {
    const fromIndex = dragItem.current
    if (fromIndex === null || fromIndex === toIndex) {
      dragItem.current = null
      setDragOverIndex(null)
      return
    }

    const reordered = [...faqs]
    const [moved] = reordered.splice(fromIndex, 1)
    reordered.splice(toIndex, 0, moved)

    const updated = reordered.map((f, i) => ({ ...f, sort_order: i + 1 }))
    setFaqs(updated)
    dragItem.current = null
    setDragOverIndex(null)

    await Promise.all(
      updated.map((f) =>
        supabase.from('faqs').update({ sort_order: f.sort_order }).eq('id', f.id)
      )
    )
  }

  return (
    <div className="space-y-4">
      {error && (
        <p className="text-coral text-sm bg-coral/10 px-4 py-2 rounded-xl">{error}</p>
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
