'use client'

import { useState } from 'react'
import Image from 'next/image'

const navLinks = [
  { label: 'Home', href: '#hero' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Service Area', href: '#service-area' },
  { label: 'FAQs', href: '#faqs' },
  { label: 'Contact', href: '#contact' },
]

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm shadow-sm border-b border-sand/40">
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo + name */}
        <a href="#hero" className="flex items-center gap-3">
          <Image
            src="/images/Transparent_Logo_Icons.png"
            alt="Brooke's Trusty Paws Co."
            width={40}
            height={40}
            className="object-contain"
          />
          <span className="font-display text-lg text-deep-ocean hidden sm:block">
            Trusty Paws Co.
          </span>
        </a>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="px-3 py-2 rounded-full text-sm font-semibold text-driftwood hover:bg-seafoam/40 hover:text-deep-ocean transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href="#contact"
              className="ml-2 px-5 py-2 bg-coral text-white rounded-full text-sm font-bold hover:bg-light-coral transition-colors shadow-sm"
            >
              Book Now
            </a>
          </li>
        </ul>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-driftwood hover:bg-seafoam/30 transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className="w-5 space-y-1">
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block h-0.5 bg-current transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
          </div>
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-sand/40 px-4 pb-4">
          <ul className="space-y-1 pt-2">
            {navLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 rounded-xl text-sm font-semibold text-driftwood hover:bg-seafoam/30 transition-colors"
                >
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#contact"
                onClick={() => setMenuOpen(false)}
                className="block mt-2 px-4 py-2 bg-coral text-white rounded-xl text-sm font-bold text-center hover:bg-light-coral transition-colors"
              >
                Book Now
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  )
}
