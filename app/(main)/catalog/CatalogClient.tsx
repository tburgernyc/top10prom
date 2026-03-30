'use client'

import { useState, useMemo } from 'react'
import type { Dress } from '@/types/index'
import DressCardGrid from '@/components/catalog/DressCardGrid'
import FilterBar, { type CatalogFilters } from '@/components/catalog/FilterBar'

interface CatalogClientProps {
  dresses: Dress[]
}

const DEFAULT_FILTERS: CatalogFilters = {
  eventType: 'all',
  search: '',
  sortBy: 'newest',
}

export default function CatalogClient({ dresses }: CatalogClientProps) {
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS)

  const filtered = useMemo(() => {
    let result = [...dresses]

    // Filter by event type
    if (filters.eventType !== 'all') {
      result = result.filter((dress) => {
        const eventTypes = dress.event_types
        if (Array.isArray(eventTypes)) {
          return eventTypes.includes(filters.eventType)
        }
        return false
      })
    }

    // Filter by search
    if (filters.search.trim()) {
      const q = filters.search.trim().toLowerCase()
      result = result.filter(
        (dress) =>
          dress.name.toLowerCase().includes(q) ||
          (dress.designer?.toLowerCase().includes(q) ?? false) ||
          (dress.color?.toLowerCase().includes(q) ?? false)
      )
    }

    // Sort
    switch (filters.sortBy) {
      case 'price_asc':
        result.sort((a, b) => (a.price_cents ?? 0) - (b.price_cents ?? 0))
        break
      case 'price_desc':
        result.sort((a, b) => (b.price_cents ?? 0) - (a.price_cents ?? 0))
        break
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'newest':
      default:
        // already sorted by created_at desc from server
        break
    }

    return result
  }, [dresses, filters])

  return (
    <>
      <FilterBar onFilterChange={setFilters} currentFilters={filters} />
      <DressCardGrid
        dresses={filtered}
        emptyMessage={
          filters.search || filters.eventType !== 'all'
            ? 'No dresses match your filters. Try adjusting your search.'
            : 'No dresses available yet. Check back soon!'
        }
      />
    </>
  )
}
