'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, MapPin, Phone, Map, List } from 'lucide-react'
import type { StaticBoutique } from '@/lib/data/boutiques'
import { StoreMap } from '@/components/location/StoreMap'

interface StoreLocatorProps {
  stores: StaticBoutique[]
}

const GA_STATES = ['GA']
const ALL_STATES = [...new Set(GA_STATES)]

export function StoreLocator({ stores }: StoreLocatorProps) {
  const [search, setSearch] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [view, setView] = useState<'list' | 'map'>('list')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)

  const filtered = stores.filter((s) => {
    const q = search.toLowerCase()
    const matchesSearch =
      !q ||
      s.name.toLowerCase().includes(q) ||
      s.city.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    const matchesState = !stateFilter || s.state === stateFilter
    return matchesSearch && matchesState
  })

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value)
    setSelectedKey(null)
  }

  function handleStateChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStateFilter(e.target.value)
    setSelectedKey(null)
  }

  const mapPins = filtered.map((s) => ({
    key: s.id,
    name: s.name,
    city: s.city,
    lat: s.lat,
    lng: s.lng,
  }))

  const selectedStore = selectedKey
    ? filtered.find((s) => s.id === selectedKey) ?? null
    : null

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-platinum/40 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="text"
            value={search}
            onChange={handleSearchChange}
            placeholder="Search by name or city…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-light text-sm text-ivory placeholder:text-platinum/40 focus:outline-none focus:ring-1 focus:ring-gold/50"
          />
        </div>

        {/* State filter */}
        <select
          value={stateFilter}
          onChange={handleStateChange}
          className="px-4 py-2.5 rounded-xl glass-light text-sm text-ivory bg-transparent focus:outline-none focus:ring-1 focus:ring-gold/50"
          aria-label="Filter by state"
        >
          <option value="">All states</option>
          {ALL_STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        {/* View toggle */}
        <div className="flex rounded-xl glass-light overflow-hidden shrink-0">
          <button
            onClick={() => setView('list')}
            aria-pressed={view === 'list'}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors',
              view === 'list' ? 'bg-gold text-onyx font-medium' : 'text-platinum hover:text-ivory',
            ].join(' ')}
          >
            <List size={14} aria-hidden="true" />
            List
          </button>
          <button
            onClick={() => setView('map')}
            aria-pressed={view === 'map'}
            className={[
              'flex items-center gap-1.5 px-4 py-2.5 text-sm transition-colors',
              view === 'map' ? 'bg-gold text-onyx font-medium' : 'text-platinum hover:text-ivory',
            ].join(' ')}
          >
            <Map size={14} aria-hidden="true" />
            Map
          </button>
        </div>
      </div>

      {/* Map view */}
      {view === 'map' && (
        <div className="space-y-4">
          <StoreMap
            stores={mapPins}
            selectedKey={selectedKey}
            onSelect={setSelectedKey}
          />
          {selectedStore && (
            <div className="glass-light rounded-2xl p-5 space-y-2">
              <h3 className="font-semibold text-ivory">{selectedStore.name}</h3>
              <p className="text-sm text-platinum">{selectedStore.address}</p>
              <p className="text-sm text-platinum">{selectedStore.city}, {selectedStore.state} {selectedStore.zip}</p>
              <div className="flex items-center gap-4 pt-1">
                <a
                  href={`tel:${selectedStore.phone}`}
                  className="flex items-center gap-1.5 text-sm text-gold hover:text-gold/80 transition-colors"
                >
                  <Phone size={14} aria-hidden="true" />
                  {selectedStore.phone}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${selectedStore.name} ${selectedStore.address} ${selectedStore.city} ${selectedStore.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-platinum hover:text-ivory transition-colors"
                >
                  <MapPin size={14} aria-hidden="true" />
                  Directions
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {/* List view */}
      {view === 'list' && (
        <div className="space-y-4">
          {filtered.length === 0 && (
            <p className="text-center text-platinum/60 py-12">
              No boutiques match your search.
            </p>
          )}
          {filtered.map((store) => (
            <div key={store.id} className="glass-light rounded-2xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-semibold text-ivory">{store.name}</h3>
                  <p className="text-sm text-platinum mt-0.5">{store.address}</p>
                  <p className="text-sm text-platinum">{store.city}, {store.state} {store.zip}</p>
                </div>
                <MapPin size={18} className="text-gold shrink-0 mt-0.5" aria-hidden="true" />
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`tel:${store.phone}`}
                  className="flex items-center gap-1.5 text-sm text-gold hover:text-gold/80 transition-colors"
                >
                  <Phone size={14} aria-hidden="true" />
                  {store.phone}
                </a>
                <a
                  href={`https://maps.google.com/?q=${encodeURIComponent(`${store.name} ${store.address} ${store.city} ${store.state}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-platinum hover:text-ivory transition-colors"
                >
                  <MapPin size={14} aria-hidden="true" />
                  Directions
                </a>
                <Link
                  href={`/book?store=${store.slug}`}
                  className="text-sm text-ivory font-medium hover:text-gold transition-colors"
                >
                  Book here →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
