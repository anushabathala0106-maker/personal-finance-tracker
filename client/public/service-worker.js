self.addEventListener('install', (event) => {
  event.waitUntil(self.skipWaiting())
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

self.addEventListener('fetch', (event) => {
  // A simple service worker that keeps the app available while online.
  // No caching strategy is implemented here to keep this starter app lightweight.
})
