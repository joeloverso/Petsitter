'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { type FAQ } from '@/app/admin/content/ContentTabs'

export default function FAQEditor({ initialFaqs }: { initialFaqs: FAQ[] }) {
  const [faqs, setFaqs] = useState<FAQ[]>(initialFaqs)
  const [saving, setSaving] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSave(faq: FAQ) {
    setSaving(faq.id)
    await supabase
      .from('faqs')
      .update({ question: faq.question, answer: faq.answer, active: faq.active })
      .eq('id', faq.id)
    setSaving(null)
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this FAQ?')) return
    await supabase.from('faqs').delete().eq('id', id)
    setFaqs((prev) => prev.filter((f) => f.id !== id))
  }

  function updateField(id: string, field: keyof FAQ, value: string | boolean) {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    )
  }

  return (
    <div className="space-y-4">
      {faqs.map((faq) => (
        <div key={faq.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-start justify-between gap-4 mb-3">
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
      ))}
    </div>
  )
}
