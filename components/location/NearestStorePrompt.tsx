'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Navigation, X } from 'lucide-react'
import { requestGeolocation, sortByProximity, formatDistance } from '@/lib/geo'
import type { StaticBoutique } from '@/lib/data/boutiques'

interface NearestStorePromptProps {
  stores: StaticBoutique[]
}

const DISMISSED_KEY = 'top10prom:nearest_store_dismissed'

export function NearestStorePrompt({ stores }: NearestStorePromptProps) {
  const [nearest, setNearest] = useState<{ name: string; city: string; distance: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(() => {
    if (typeof window === 'undefined') return false
    return localStorage.getItem(DISMISSED_KEY) === '1'
  })

  if (dismissed) return null

  async function handleFindNearest() {
    setLoading(true)
    const coords = await requestGeolocation()
    setLoading(false)

    const sorted = sortByProximity(stores, coords)
    const top = sorted[0]

    if (top) {
      setNearest({
        name: top.name,
        city: top.city ?? '',
        distance: top.distance_miles != null ? formatDistance(top.distance_miles) : '',
      })
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, '1')
    setDismissed(true)
  }

  if (nearest) {
    return (
      <div className="flex items-center justify-between gap-4 glass-light rounded-2xl px-5 py-4">
        <div className="flex items-center gap-3 min-w-0">
          <Navigation size={18} className="text-gold shrink-0" aria-hidden="true" />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-ivory truncate">
              Nearest boutique: {nearest.name}
            </p>
            <p className="text-xs text-platinum/60">
              {nearest.city}
              {nearest.distance ? ` · ${nearest.distance} away` : ''}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link
            href="/boutiques"
            className="text-xs text-gold hover:text-gold/80 transition-colors font-medium"
          >
            View
          </Link>
          <button
            onClick={handleDismiss}
            aria-label="Dismiss nearest store prompt"
            className="p-1 rounded-full text-platinum/40 hover:text-platinum transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-between gap-4 glass-light rounded-2xl px-5 py-4">
      <div className="min-w-0">
        <p className="text-sm text-platinum">Find your nearest Top 10 Prom boutique</p>
        <p className="text-xs text-platinum/50 mt-0.5">Your location is used only to sort stores by distance and is never stored.</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => void handleFindNearest()}
          disabled={loading}
          className="flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold/80 transition-colors disabled:opacity-50"
        >
          <Navigation size={14} aria-hidden="true" />
          {loading ? 'Locating…' : 'Find nearest'}
        </button>
        <button
          onClick={handleDismiss}
          aria-label="Dismiss nearest store prompt"
          className="p-1 rounded-full text-platinum/40 hover:text-platinum transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  )
}
