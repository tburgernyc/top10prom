import { describe, it, expect } from 'vitest'
import {
  haversineDistance,
  sortByProximity,
  formatDistance,
  type BoutiqueGeo,
} from '@/lib/geo'

describe('haversineDistance', () => {
  it('returns 0 for identical coordinates', () => {
    expect(haversineDistance({ lat: 40.7128, lng: -74.006 }, { lat: 40.7128, lng: -74.006 })).toBe(0)
  })

  it('calculates NYC to LA accurately (~2445 miles)', () => {
    const dist = haversineDistance(
      { lat: 40.7128, lng: -74.006 },  // New York
      { lat: 34.0522, lng: -118.2437 } // Los Angeles
    )
    expect(dist).toBeGreaterThan(2400)
    expect(dist).toBeLessThan(2500)
  })

  it('calculates short distances accurately', () => {
    // ~0.9 miles apart in Manhattan
    const dist = haversineDistance(
      { lat: 40.748817, lng: -73.985428 },
      { lat: 40.758896, lng: -73.985130 }
    )
    expect(dist).toBeGreaterThan(0.5)
    expect(dist).toBeLessThan(1.5)
  })

  it('is symmetric (a→b equals b→a)', () => {
    const a = { lat: 41.8781, lng: -87.6298 }
    const b = { lat: 29.7604, lng: -95.3698 }
    expect(haversineDistance(a, b)).toBeCloseTo(haversineDistance(b, a), 5)
  })
})

describe('sortByProximity', () => {
  const boutiques: BoutiqueGeo[] = [
    { id: '1', name: 'Far Store',   slug: 'far',   city: 'LA',      state: 'CA', lat: 34.0522, lng: -118.2437 },
    { id: '2', name: 'Near Store',  slug: 'near',  city: 'NJ',      state: 'NJ', lat: 40.7357, lng: -74.1724 },
    { id: '3', name: 'No Coords',   slug: 'none',  city: 'Unknown', state: null, lat: null,    lng: null },
  ]

  const nyc = { lat: 40.7128, lng: -74.006 }

  it('sorts closer stores first', () => {
    const sorted = sortByProximity(boutiques, nyc)
    expect(sorted[0]?.id).toBe('2') // NJ is closest to NYC
    expect(sorted[1]?.id).toBe('1') // LA is far
  })

  it('puts stores without coords last', () => {
    const sorted = sortByProximity(boutiques, nyc)
    expect(sorted[sorted.length - 1]?.id).toBe('3')
    expect(sorted[sorted.length - 1]?.distance_miles).toBeNull()
  })

  it('handles null userCoords — all distances are null, sorted by name', () => {
    const sorted = sortByProximity(boutiques, null)
    sorted.forEach((b) => expect(b.distance_miles).toBeNull())
    // Should be sorted alphabetically by name
    expect(sorted[0]?.name).toBe('Far Store')
    expect(sorted[1]?.name).toBe('Near Store')
    expect(sorted[2]?.name).toBe('No Coords')
  })

  it('returns correct distance_miles values', () => {
    const sorted = sortByProximity(boutiques, nyc)
    const near = sorted.find((b) => b.id === '2')
    expect(near?.distance_miles).not.toBeNull()
    expect(near?.distance_miles as number).toBeLessThan(20)
  })
})

describe('formatDistance', () => {
  it('formats sub-0.1 distances', () => {
    expect(formatDistance(0.05)).toBe('Less than 0.1 mi')
  })

  it('formats distances under 10 miles with 1 decimal', () => {
    expect(formatDistance(3.456)).toBe('3.5 mi')
  })

  it('rounds distances 10+ miles', () => {
    expect(formatDistance(12.7)).toBe('13 mi')
    expect(formatDistance(100.2)).toBe('100 mi')
  })
})
