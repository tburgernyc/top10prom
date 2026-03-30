'use client'

import { MapPin } from 'lucide-react'

export interface StorePin {
  key: string
  name: string
  city: string
  lat: number
  lng: number
}

interface StoreMapProps {
  stores: StorePin[]
  selectedKey?: string | null
  onSelect: (key: string) => void
}

// Normalizes lat/lng values in the store list to a 0–100 percentage position
// within the bounding box of all locations.
function normalizeCoords(stores: StorePin[]): Array<StorePin & { x: number; y: number }> {
  if (stores.length === 0) return []

  const lats = stores.map((s) => s.lat)
  const lngs = stores.map((s) => s.lng)
  const minLat = Math.min(...lats)
  const maxLat = Math.max(...lats)
  const minLng = Math.min(...lngs)
  const maxLng = Math.max(...lngs)

  const latRange = maxLat - minLat || 1
  const lngRange = maxLng - minLng || 1
  const pad = 0.15 // 15% padding on each side

  return stores.map((s) => ({
    ...s,
    // x increases left→right (lng), y increases top→bottom (inverted lat)
    x: pad * 100 + ((s.lng - minLng) / lngRange) * (1 - 2 * pad) * 100,
    y: pad * 100 + ((maxLat - s.lat) / latRange) * (1 - 2 * pad) * 100,
  }))
}

export function StoreMap({ stores, selectedKey, onSelect }: StoreMapProps) {
  const pinned = normalizeCoords(stores)

  return (
    <div
      className="relative w-full aspect-[16/9] glass-light rounded-2xl overflow-hidden"
      role="img"
      aria-label="Map of Top 10 Prom boutique locations"
    >
      {/* Grid background — dark map aesthetic */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          backgroundColor: 'var(--color-onyx-raised)',
        }}
      />

      {/* Store pins */}
      {pinned.map((store) => {
        const isSelected = selectedKey === store.key
        return (
          <button
            key={store.key}
            onClick={() => onSelect(store.key)}
            aria-label={`Select ${store.name}`}
            aria-pressed={isSelected}
            style={{ left: `${store.x}%`, top: `${store.y}%` }}
            className="absolute -translate-x-1/2 -translate-y-full group"
          >
            <div
              className={[
                'flex flex-col items-center transition-transform duration-150',
                'group-hover:scale-110 group-active:scale-100',
              ].join(' ')}
            >
              <MapPin
                size={isSelected ? 28 : 22}
                className={isSelected ? 'text-gold drop-shadow-lg' : 'text-platinum/60'}
                fill={isSelected ? 'currentColor' : 'none'}
              />
              {isSelected && (
                <span className="mt-1 px-2 py-0.5 rounded-md bg-black/80 text-gold text-[10px] font-medium whitespace-nowrap">
                  {store.city}
                </span>
              )}
            </div>
          </button>
        )
      })}

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-[10px] text-platinum/40">
        <MapPin size={10} className="text-gold" fill="currentColor" />
        <span>Top 10 Prom locations</span>
      </div>
    </div>
  )
}
