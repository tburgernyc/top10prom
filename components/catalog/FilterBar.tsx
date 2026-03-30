'use client'

import { useCallback, useRef } from 'react'
import { Search, X } from 'lucide-react'

export interface CatalogFilters {
  eventType: 'all' | 'prom' | 'wedding'
  search: string
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'name'
}

interface FilterBarProps {
  onFilterChange: (filters: CatalogFilters) => void
  currentFilters: CatalogFilters
}

const EVENT_TYPE_PILLS: { label: string; value: CatalogFilters['eventType'] }[] = [
  { label: 'All', value: 'all' },
  { label: 'Prom', value: 'prom' },
  { label: 'Wedding', value: 'wedding' },
]

export default function FilterBar({ onFilterChange, currentFilters }: FilterBarProps) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleSearchChange = useCallback(
    (value: string) => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
      debounceRef.current = setTimeout(() => {
        onFilterChange({ ...currentFilters, search: value })
      }, 300)
    },
    [currentFilters, onFilterChange]
  )

  const handleClearSearch = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    onFilterChange({ ...currentFilters, search: '' })
  }, [currentFilters, onFilterChange])

  const handleEventTypeChange = useCallback(
    (value: CatalogFilters['eventType']) => {
      onFilterChange({ ...currentFilters, eventType: value })
    },
    [currentFilters, onFilterChange]
  )

  const handleSortChange = useCallback(
    (value: CatalogFilters['sortBy']) => {
      onFilterChange({ ...currentFilters, sortBy: value })
    },
    [currentFilters, onFilterChange]
  )

  return (
    <div className="flex flex-wrap items-center gap-3 py-4">
      {/* Search input */}
      <div className="relative flex items-center">
        <Search
          size={16}
          className="absolute left-3 text-platinum pointer-events-none"
        />
        <input
          type="text"
          defaultValue={currentFilters.search}
          onChange={(e) => handleSearchChange(e.target.value)}
          placeholder="Search by name, designer, color..."
          className="glass-light rounded-xl pl-9 pr-8 py-2.5 text-sm text-ivory placeholder:text-platinum bg-transparent outline-none focus:ring-1 focus:ring-gold min-w-[220px]"
        />
        {currentFilters.search && (
          <button
            onClick={handleClearSearch}
            aria-label="Clear search"
            className="absolute right-2 text-platinum hover:text-ivory"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Event type pills */}
      <div className="flex items-center gap-2">
        {EVENT_TYPE_PILLS.map((pill) => (
          <button
            key={pill.value}
            onClick={() => handleEventTypeChange(pill.value)}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              currentFilters.eventType === pill.value
                ? 'bg-gold text-onyx'
                : 'glass-light text-platinum hover:text-ivory',
            ].join(' ')}
          >
            {pill.label}
          </button>
        ))}
      </div>

      {/* Sort select */}
      <select
        value={currentFilters.sortBy}
        onChange={(e) => handleSortChange(e.target.value as CatalogFilters['sortBy'])}
        className="glass-light rounded-xl px-3 py-2.5 text-sm text-ivory bg-transparent outline-none focus:ring-1 focus:ring-gold cursor-pointer"
      >
        <option value="newest">Newest</option>
        <option value="price_asc">Price: Low–High</option>
        <option value="price_desc">Price: High–Low</option>
        <option value="name">Name A–Z</option>
      </select>
    </div>
  )
}
