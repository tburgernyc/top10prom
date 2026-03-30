export interface GeoCoords {
  lat: number
  lng: number
}

export interface BoutiqueGeo {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  lat: number | null
  lng: number | null
}

export interface BoutiqueWithDistance extends BoutiqueGeo {
  distance_miles: number | null
}

/** Haversine formula — returns distance in miles */
export function haversineDistance(a: GeoCoords, b: GeoCoords): number {
  const R = 3958.8
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h))
}

/** Sort boutiques by distance from user coords. Boutiques without coords go last. */
export function sortByProximity(
  boutiques: BoutiqueGeo[],
  userCoords: GeoCoords | null
): BoutiqueWithDistance[] {
  return boutiques
    .map((b) => ({
      ...b,
      distance_miles:
        userCoords && b.lat != null && b.lng != null
          ? haversineDistance(userCoords, { lat: b.lat, lng: b.lng })
          : null,
    }))
    .sort((a, b) => {
      if (a.distance_miles != null && b.distance_miles != null) {
        return a.distance_miles - b.distance_miles
      }
      if (a.distance_miles != null) return -1
      if (b.distance_miles != null) return 1
      return a.name.localeCompare(b.name)
    })
}

/** Request user geolocation. Returns null if denied or unavailable. */
export function requestGeolocation(): Promise<GeoCoords | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      resolve(null)
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => resolve(null),
      { timeout: 5000 }
    )
  })
}

/** Format distance for display */
export function formatDistance(miles: number): string {
  if (miles < 0.1) return 'Less than 0.1 mi'
  if (miles < 10) return `${miles.toFixed(1)} mi`
  return `${Math.round(miles)} mi`
}
