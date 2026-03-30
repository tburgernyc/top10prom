'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/browser'
import type { Dress, DressImage } from '@/types/index'
import Skeleton from '@/components/ui/Skeleton'

interface DressPickerProps {
  fittingRoomIds: string[]
  selectedDressId: string | null
  onSelect: (dressId: string) => void
}

function getPrimaryImage(dress: Dress): string | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
}

export function DressPicker({ fittingRoomIds, selectedDressId, onSelect }: DressPickerProps) {
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (fittingRoomIds.length === 0) return

    let cancelled = false

    async function fetchDresses() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .in('id', fittingRoomIds)

      if (!cancelled) {
        setDresses((data ?? []) as Dress[])
        setLoading(false)
      }
    }

    void fetchDresses()
    return () => { cancelled = true }
  }, [fittingRoomIds])

  if (fittingRoomIds.length === 0) {
    return (
      <div className="glass-light rounded-2xl p-6 text-center space-y-3">
        <p className="text-sm text-platinum">
          Your fitting room is empty.
        </p>
        <Link
          href="/catalog"
          className="inline-block text-sm text-gold hover:underline"
        >
          Browse the catalog →
        </Link>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {fittingRoomIds.map((id) => (
          <Skeleton key={id} minHeight="min-h-24" />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
      {dresses.map((dress) => {
        const imgUrl = getPrimaryImage(dress)
        const isSelected = dress.id === selectedDressId
        return (
          <button
            key={dress.id}
            type="button"
            onClick={() => onSelect(dress.id)}
            className={[
              'relative aspect-[2/3] rounded-xl overflow-hidden transition-all',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              isSelected
                ? 'ring-2 ring-gold scale-105'
                : 'ring-1 ring-white/10 hover:ring-white/30',
            ].join(' ')}
            aria-pressed={isSelected}
            aria-label={`Select ${dress.name}`}
          >
            {imgUrl ? (
              <Image
                src={imgUrl}
                alt={dress.name}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 33vw, 25vw"
              />
            ) : (
              <div className="absolute inset-0 bg-gold/10 flex items-center justify-center">
                <span className="text-gold text-2xl" aria-hidden="true">✦</span>
              </div>
            )}
            {isSelected && (
              <div
                className="absolute inset-0 bg-gold/20 flex items-center justify-center"
                aria-hidden="true"
              >
                <div className="w-5 h-5 rounded-full bg-gold flex items-center justify-center">
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" aria-hidden="true">
                    <path d="M1 4L4 7L9 1" stroke="var(--color-onyx)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
