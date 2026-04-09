self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {}
  const title = data.title || "Trusty Paws — New Message"
  const options = {
    body: data.body || 'You have a new message.',
    icon: '/images/Transparent_Logo_Icons.png',
    badge: '/images/Transparent_Logo_Icons.png',
    data: { url: data.url || '/admin/messages' },
  }
  event.waitUntil(self.registration.showNotification(title, options))
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = event.notification.data?.url || '/admin/messages'
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus()
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url)
      }
    })
  )
})
