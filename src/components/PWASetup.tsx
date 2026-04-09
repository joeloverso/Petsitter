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

    navigator.serviceWorker.register('/sw.js').then(async (registration) => {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') return

      try {
        // Get existing subscription or create a new one
        let subscription = await registration.pushManager.getSubscription()
        if (!subscription) {
          subscription = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
          })
        }

        // Always upsert to DB — subscription may exist in browser but not yet saved
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
