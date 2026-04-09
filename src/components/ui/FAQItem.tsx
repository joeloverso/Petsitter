'use client'

import { useState } from 'react'

interface FAQItemProps {
  question: string
  answer: string
}

export default function FAQItem({ question, answer }: FAQItemProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-sand rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 bg-white hover:bg-white-sand transition-colors text-left"
      >
        <span className="font-semibold text-driftwood pr-4">{question}</span>
        <span
          className={`text-ocean text-xl transition-transform duration-200 flex-shrink-0 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      {open && (
        <div className="px-6 py-4 bg-white-sand border-t border-sand/50">
          <p className="text-gray-600 leading-relaxed">{answer}</p>
        </div>
      )}
    </div>
  )
}
