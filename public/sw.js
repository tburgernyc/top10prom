// Top 10 Prom — Service Worker
// Strategies:
//   static-first  → JS, CSS, fonts, images (cache, fallback network)
//   network-first → API routes (/api/*)
//   SWR           → navigation pages (serve cache, refresh in background)
//   offline       → /offline fallback when network + cache both fail for pages

const CACHE_VERSION = 'v1'
const STATIC_CACHE = `top10prom-static-${CACHE_VERSION}`
const PAGE_CACHE = `top10prom-pages-${CACHE_VERSION}`
const ALL_CACHES = [STATIC_CACHE, PAGE_CACHE]

const OFFLINE_URL = '/offline'

const STATIC_EXTENSIONS = /\.(js|css|woff2?|ttf|otf|ico|png|jpg|jpeg|svg|webp|gif)(\?.*)?$/i

// ─── Install ──────────────────────────────────────────────────────────────────
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGE_CACHE)
      .then((cache) => cache.add(OFFLINE_URL))
      .then(() => self.skipWaiting())
  )
})

// ─── Activate ─────────────────────────────────────────────────────────────────
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => !ALL_CACHES.includes(key))
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  )
})

// ─── Fetch ────────────────────────────────────────────────────────────────────
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Only handle same-origin requests
  if (url.origin !== self.location.origin) return

  // API routes → network-first (no caching)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirst(request))
    return
  }

  // Static assets → static-first (cache, fallback network, then store)
  if (STATIC_EXTENSIONS.test(url.pathname)) {
    event.respondWith(staticFirst(request))
    return
  }

  // Navigation requests → stale-while-revalidate, offline fallback
  if (request.mode === 'navigate') {
    event.respondWith(stalwWhileRevalidate(request))
    return
  }
})

// ─── Strategy: network-first ──────────────────────────────────────────────────
async function networkFirst(request) {
  try {
    return await fetch(request)
  } catch {
    return new Response(JSON.stringify({ error: 'offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}

// ─── Strategy: static-first (cache → network → cache put) ────────────────────
async function staticFirst(request) {
  const cached = await caches.match(request, { cacheName: STATIC_CACHE })
  if (cached) return cached
  try {
    const response = await fetch(request)
    if (response.ok) {
      const cache = await caches.open(STATIC_CACHE)
      cache.put(request, response.clone())
    }
    return response
  } catch {
    return new Response('Asset unavailable offline', { status: 503 })
  }
}

// ─── Strategy: stale-while-revalidate with offline fallback ──────────────────
async function stalwWhileRevalidate(request) {
  const cache = await caches.open(PAGE_CACHE)
  const cached = await cache.match(request)

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone())
      return response
    })
    .catch(() => null)

  if (cached) {
    // Serve cached immediately, refresh in background
    fetchPromise.catch(() => null)
    return cached
  }

  // No cache — wait for network
  const response = await fetchPromise
  if (response) return response

  // Both failed — serve offline page
  const offline = await cache.match(OFFLINE_URL)
  return offline ?? new Response('Offline', { status: 503 })
}
