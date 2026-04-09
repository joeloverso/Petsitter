import webpush from 'web-push'

let configured = false

function configure() {
  if (configured) return
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  const email = process.env.VAPID_EMAIL
  if (!publicKey || !privateKey || !email) return
  webpush.setVapidDetails(email, publicKey, privateKey)
  configured = true
}

export async function sendPushNotification(
  subscription: { endpoint: string; p256dh: string; auth: string },
  payload: { title: string; body: string; url?: string }
) {
  configure()
  if (!configured) return

  const pushSubscription = {
    endpoint: subscription.endpoint,
    keys: { p256dh: subscription.p256dh, auth: subscription.auth },
  }

  await webpush.sendNotification(pushSubscription, JSON.stringify(payload))
}
