const CACHE_NAME = 'tsundoku-v1'
const RANKING_URL = '/ranking'

self.addEventListener('install', (event) => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)

  // ランキングページのみ stale-while-revalidate
  if (url.pathname.startsWith(RANKING_URL)) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) =>
        cache.match(event.request).then((cached) => {
          const fetchPromise = fetch(event.request).then((res) => {
            cache.put(event.request, res.clone())
            return res
          })
          return cached ?? fetchPromise
        })
      )
    )
  }
})
