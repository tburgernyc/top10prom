'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import { createClient } from '@/lib/supabase/browser'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { MapPin, Check } from 'lucide-react'
import { STATIC_BOUTIQUES } from '@/lib/data/boutiques'
import { haversineDistance } from '@/lib/geo'

interface BoutiqueRow {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  address: string | null
  lat: number | null
  lng: number | null
  distance_miles?: number
}

interface Step2StoreProps {
  selectedBoutiqueId: string | null
  onNext: (boutiqueId: string) => void
  onBack: () => void
}

export function Step2Store({ selectedBoutiqueId, onNext, onBack }: Step2StoreProps) {
  const shouldReduce = useReducedMotion()
  const [boutiques, setBoutiques] = useState<BoutiqueRow[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(selectedBoutiqueId)
  const [userCoords, setUserCoords] = useState<{ lat: number; lng: number } | null>(null)

  useEffect(() => {
    // Request geolocation for distance sorting (optional — never blocks store list)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => { /* denied or unavailable — distance column is hidden, list still shows */ },
        { timeout: 8000 }
      )
    }

    async function fetchBoutiques() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('boutiques')
          .select('id, name, slug, city, state, address, lat, lng')
          .eq('is_active', true)

        if (!error && data && data.length > 0) {
          setBoutiques(data as BoutiqueRow[])
        } else {
          setBoutiques(STATIC_BOUTIQUES)
        }
      } catch {
        setBoutiques(STATIC_BOUTIQUES)
      }
      setLoading(false)
    }

    fetchBoutiques()
  }, [])

  const enriched = boutiques.map((b) => ({
    ...b,
    distance_miles:
      userCoords && b.lat != null && b.lng != null
        ? haversineDistance(userCoords, { lat: b.lat as number, lng: b.lng as number })
        : undefined,
  }))

  const sorted = [...enriched].sort((a, b) => {
    if (a.distance_miles != null && b.distance_miles != null) {
      return a.distance_miles - b.distance_miles
    }
    return a.name.localeCompare(b.name)
  })

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} minHeight="min-h-20" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-platinum">Choose your preferred store location:</p>

      <div className="space-y-3">
        {sorted.map((boutique, idx) => {
          const isSelected = selected === boutique.id

          return (
            <motion.button
              key={boutique.id}
              initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ ...SPRING_STANDARD, delay: idx * 0.05 }}
              onClick={() => setSelected(boutique.id)}
              className={[
                'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors',
                isSelected
                  ? 'border-gold bg-gold/10'
                  : 'border-white/10 glass-light hover:border-white/20',
              ].join(' ')}
              aria-pressed={isSelected}
            >
              <div className="w-10 h-10 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                <MapPin size={18} className="text-gold" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-ivory font-medium">{boutique.name}</p>
                {boutique.city && (
                  <p className="text-sm text-platinum">
                    {boutique.city}{boutique.state ? `, ${boutique.state}` : ''}
                  </p>
                )}
                {boutique.distance_miles != null && (
                  <p className="text-xs text-gold">
                    {boutique.distance_miles < 1
                      ? 'Less than 1 mile away'
                      : `${boutique.distance_miles.toFixed(1)} mi away`}
                  </p>
                )}
              </div>
              {isSelected && (
                <Check size={20} className="text-gold shrink-0" />
              )}
            </motion.button>
          )
        })}
      </div>

      <div className="pt-4 flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          disabled={!selected}
          onClick={() => selected && onNext(selected)}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
