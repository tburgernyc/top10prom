'use client'

import { useEffect } from 'react'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    async function register() {
      try {
        await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
          updateViaCache: 'none',
        })
      } catch (err) {
        console.warn('[SW] Registration failed:', err)
      }
    }

    void register()
  }, [])

  return null
}
