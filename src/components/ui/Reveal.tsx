'use client'

import { useEffect, useLayoutEffect, useRef } from 'react'
import type { ReactNode } from 'react'

// useLayoutEffect on the client (applies the from-state before paint, so there's
// no flash of fully-visible content), useEffect on the server to silence React's
// SSR warning. This component is SSR'd, then hydrated.
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect

// Items that cross into view together (e.g. cards in one row) reveal with this
// much delay between them, in registration order, for a gentle cascade.
const STAGGER_MS = 90

interface RevealProps {
  children: ReactNode
  /** Extra classes for the wrapper (it's a plain block div, full-width by default). */
  className?: string
}

/**
 * Scroll-reveal scope. Fades + lifts elements into view as they each near the
 * viewport. Targets descendants marked with `data-reveal-item` and reveals them
 * individually (so content deep in a section animates when *it* is reached, not
 * when the section's top edge appears); if none are marked, the wrapper itself
 * is revealed as a single block. A MutationObserver also catches items that mount
 * later — e.g. inside `ssr: false` dynamic imports like the Leaflet map.
 *
 * Intentionally degrades to fully-visible content: if JS is off,
 * IntersectionObserver is unavailable, or the user prefers reduced motion,
 * nothing is ever hidden. Don't mark above-the-fold / LCP content (the hero).
 */
export default function Reveal({ children, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)

  useIsomorphicLayoutEffect(() => {
    const root = ref.current
    if (!root) return

    // Bail out — leave content fully visible — when motion is unwanted or unsupported.
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced || typeof IntersectionObserver === 'undefined') return

    let order = 0
    const orderOf = new WeakMap<Element, number>()

    const io = new IntersectionObserver(
      (entries) => {
        // Items crossing in the same callback (a row) get a small staggered delay.
        const arriving = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (orderOf.get(a.target) ?? 0) - (orderOf.get(b.target) ?? 0))

        arriving.forEach((entry, i) => {
          const el = entry.target as HTMLElement
          if (i > 0) el.style.transitionDelay = `${i * STAGGER_MS}ms`
          el.classList.add('reveal-visible')
          io.unobserve(el) // reveal once, then stop watching
        })
      },
      // Trigger when the item is ~15% up from the viewport bottom, so the fade
      // plays out over visible viewport rather than down near the edge.
      { threshold: 0.12, rootMargin: '0px 0px -15% 0px' }
    )

    const register = (el: HTMLElement) => {
      if (orderOf.has(el)) return
      orderOf.set(el, order++)
      el.classList.add('reveal-init')
      io.observe(el)
    }

    const targets = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal-item]'))
    if (targets.length > 0) {
      targets.forEach(register)
    } else {
      register(root) // nothing marked: reveal the whole wrapper as one block
    }

    // Pick up items mounted after this effect ran (e.g. dynamic, ssr:false content).
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof HTMLElement)) return
          if (node.matches('[data-reveal-item]')) register(node)
          node.querySelectorAll<HTMLElement>('[data-reveal-item]').forEach(register)
        })
      }
    })
    mo.observe(root, { childList: true, subtree: true })

    return () => {
      io.disconnect()
      mo.disconnect()
    }
  }, [])

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  )
}
