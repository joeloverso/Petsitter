'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)))
}

function isIOS() {
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
}

function isStandalone() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
  )
}

async function subscribeToPush() {
  const registration = await navigator.serviceWorker.register('/sw.js')
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
}

type UIState = 'hidden' | 'install-ios' | 'notif-prompt' | 'success'

const DISMISS_KEY = 'pwa-install-dismissed'

export default function PWASetup() {
  const [uiState, setUiState] = useState<UIState>('hidden')

  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    const standalone = isStandalone()
    const ios = isIOS()

    if (!standalone) {
      // Not installed yet — show iOS "Add to Home Screen" instructions
      if (ios && !sessionStorage.getItem(DISMISS_KEY)) {
        setUiState('install-ios')
      }
      return
    }

    // Running as installed PWA
    if (!('PushManager' in window)) return

    const permission = Notification.permission

    if (permission === 'granted') {
      // Re-register silently in case subscription expired
      navigator.serviceWorker.register('/sw.js').then(async (reg) => {
        const sub = await reg.pushManager.getSubscription()
        if (!sub) {
          try { await subscribeToPush() } catch { /* silent */ }
        }
      })
      return
    }

    if (permission === 'default') {
      setUiState('notif-prompt')
    }
    // 'denied' → nothing we can do from UI; user must go to Settings
  }, [])

  function dismissInstall() {
    sessionStorage.setItem(DISMISS_KEY, '1')
    setUiState('hidden')
  }

  async function handleEnableNotifications() {
    // Must be called from a user gesture (button tap) on iOS
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      try {
        await subscribeToPush()
        setUiState('success')
        setTimeout(() => setUiState('hidden'), 3000)
      } catch (err) {
        console.error('Push subscription failed:', err)
        setUiState('hidden')
      }
    } else {
      setUiState('hidden')
    }
  }

  if (uiState === 'hidden') return null

  if (uiState === 'install-ios') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe">
        <div className="bg-white rounded-2xl shadow-xl border border-sand p-4 max-w-sm mx-auto">
          <div className="flex items-start gap-3 mb-3">
            <Image
              src="/images/Transparent_Logo_Icons.webp"
              alt=""
              width={44}
              height={44}
              className="rounded-xl shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-driftwood text-sm">Install Trusty Paws</p>
              <p className="text-xs text-gray-400">Get new-message notifications</p>
            </div>
            <button
              onClick={dismissInstall}
              aria-label="Dismiss"
              className="text-gray-400 text-xl leading-none p-1 shrink-0"
            >
              ×
            </button>
          </div>
          <ol className="text-sm text-gray-600 space-y-2 mb-3 pl-1">
            <li className="flex items-start gap-2">
              <span className="font-bold text-ocean shrink-0">1.</span>
              Tap the <strong>Share</strong> button{' '}
              <svg className="inline w-4 h-4 mb-0.5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l-3.5 3.5L10 7V14h4V7l1.5-1.5L12 2zm-7 9v9h14v-9h-2v7H7v-7H5z" />
              </svg>{' '}
              in Safari
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-ocean shrink-0">2.</span>
              Scroll down and tap <strong>Add to Home Screen</strong>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-bold text-ocean shrink-0">3.</span>
              Tap <strong>Add</strong> to confirm
            </li>
          </ol>
          <p className="text-xs text-gray-400">
            Once installed, you&apos;ll be able to enable push notifications.
          </p>
        </div>
      </div>
    )
  }

  if (uiState === 'notif-prompt') {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 pb-safe">
        <div className="bg-white rounded-2xl shadow-xl border border-sand p-4 max-w-sm mx-auto">
          <div className="flex items-start justify-between mb-2">
            <p className="font-semibold text-driftwood text-sm">Enable Notifications</p>
            <button
              onClick={() => setUiState('hidden')}
              aria-label="Dismiss"
              className="text-gray-400 text-xl leading-none p-1 shrink-0"
            >
              ×
            </button>
          </div>
          <p className="text-sm text-gray-600 mb-4">
            Get notified when new booking requests arrive — even when the app is closed.
          </p>
          <button
            onClick={handleEnableNotifications}
            className="w-full bg-coral text-white rounded-xl py-3 text-sm font-semibold active:opacity-80 transition-opacity"
          >
            Enable Notifications
          </button>
        </div>
      </div>
    )
  }

  if (uiState === 'success') {
    return (
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 pointer-events-none">
        <div className="bg-driftwood text-white rounded-xl px-5 py-3 text-sm font-medium shadow-lg">
          Notifications enabled ✓
        </div>
      </div>
    )
  }

  return null
}
