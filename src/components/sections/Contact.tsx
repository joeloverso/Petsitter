'use client'

import { useState } from 'react'

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    preferredContact: 'email',
    message: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const phoneNumber = process.env.NEXT_PUBLIC_GOOGLE_VOICE_NUMBER
  const emailAddress = process.env.NEXT_PUBLIC_CONTACT_EMAIL

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('success')
      setForm({ name: '', email: '', phone: '', preferredContact: 'email', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <section id="contact" className="bg-white-sand py-20">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <p className="text-ocean font-semibold tracking-widest text-sm uppercase mb-2">
            Ready to Book?
          </p>
          <h2 className="font-display text-4xl md:text-5xl text-driftwood mb-4">
            Get in Touch
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Reach out by text or email, or fill out the form below.
            New clients — a free meet & greet is required before your first booking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Quick contact */}
          <div className="flex flex-col gap-5 justify-center">
            <a
              href={`sms:${phoneNumber}`}
              className="flex items-center gap-4 bg-coral text-white rounded-2xl px-6 py-5 font-bold text-lg hover:bg-light-coral transition-colors shadow-md"
            >
              <span className="text-3xl">💬</span>
              <div>
                <p className="text-sm font-semibold opacity-80">Text Me</p>
                <p className="text-xl">{phoneNumber}</p>
              </div>
            </a>
            <a
              href={`mailto:${emailAddress}`}
              className="flex items-center gap-4 bg-ocean text-white rounded-2xl px-6 py-5 font-bold text-lg hover:bg-deep-ocean transition-colors shadow-md"
            >
              <span className="text-3xl">✉️</span>
              <div>
                <p className="text-sm font-semibold opacity-80">Email Me</p>
                <p className="text-xl break-all">{emailAddress}</p>
              </div>
            </a>

            <div className="bg-sunshine/20 rounded-2xl p-5 border border-sunshine/40">
              <p className="font-semibold text-driftwood mb-2">📋 Booking Notes</p>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Book 1–2 weeks in advance</li>
                <li>• 2–4 weeks for stays of 1 week+</li>
                <li>• Free meet & greet for all new clients</li>
                <li>• 3 days notice required to cancel</li>
              </ul>
            </div>
          </div>

          {/* Contact form */}
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-md p-8 border border-sand/50 flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-driftwood mb-1">Name *</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean transition-colors"
                placeholder="Your name"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-driftwood mb-1">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean transition-colors"
                placeholder="your@email.com"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-driftwood mb-1">Phone</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean transition-colors"
                placeholder="(561) 000-0000"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-driftwood mb-2">
                Preferred response method
              </label>
              <div className="flex gap-4">
                {['email', 'text'].map((method) => (
                  <label key={method} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="preferredContact"
                      value={method}
                      checked={form.preferredContact === method}
                      onChange={() => setForm({ ...form, preferredContact: method })}
                      className="accent-ocean"
                    />
                    <span className="text-sm text-gray-600 capitalize">{method}</span>
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-driftwood mb-1">Message *</label>
              <textarea
                required
                rows={4}
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full border border-sand rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-ocean transition-colors resize-none"
                placeholder="Tell me about your pets and what you need!"
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-coral text-white rounded-full py-3 font-bold hover:bg-light-coral transition-colors disabled:opacity-60"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
            </button>

            {status === 'success' && (
              <p className="text-center text-sm text-deep-ocean font-semibold">
                ✅ Message sent! Brooke will be in touch soon.
              </p>
            )}
            {status === 'error' && (
              <p className="text-center text-sm text-coral font-semibold">
                Something went wrong — try texting or emailing directly.
              </p>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
