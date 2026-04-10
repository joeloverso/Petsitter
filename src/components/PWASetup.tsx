'use client'

import { useEffect } from 'react'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

export default function PWASetup() {
  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return

    // Only subscribe from the installed PWA (standalone mode)
    // Subscriptions created in the browser are tied to Chrome, not the app
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)

    if (!isStandalone) return

    navigator.serviceWorker.register('/sw.js').then(async (registration) => {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      try {
        // Unsubscribe any existing subscription so we get a fresh one
        // tied to the standalone app context, not Chrome browser
        const existing = await registration.pushManager.getSubscription()
        if (existing) await existing.unsubscribe()

        const subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        })

        const { endpoint, keys } = subscription.toJSON() as {
          endpoint: string
          keys: { p256dh: string; auth: string }
        }

        await fetch('/api/push-subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint, p256dh: keys.p256dh, auth: keys.auth }),
        })
      } catch (err) {
        console.error('Push subscription failed:', err)
      }
    })
  }, [])

  return null
}
