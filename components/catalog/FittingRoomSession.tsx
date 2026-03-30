'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { useShopStore } from '@/lib/store/shopStore'
import type { Dress } from '@/types/index'
import ShareFittingRoom from '@/components/social/ShareFittingRoom'

export default function FittingRoomSession() {
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const removeFromFittingRoom = useShopStore((s) => s.removeFromFittingRoom)
  const _hasHydrated = useShopStore((s) => s._hasHydrated)

  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!_hasHydrated || fittingRoomIds.length === 0) return

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

    return () => {
      cancelled = true
    }
  }, [fittingRoomIds, _hasHydrated])

  if (!_hasHydrated) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="aspect-[3/4] skeleton-shimmer rounded-2xl"
          />
        ))}
      </div>
    )
  }

  if (fittingRoomIds.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-7xl mb-6" role="img" aria-label="Empty fitting room">
          ✨
        </div>
        <h2 className="text-2xl font-bold text-ivory mb-3">
          Your Fitting Room is Empty
        </h2>
        <p className="text-platinum mb-8 max-w-sm mx-auto">
          Add dresses from the catalog to build your session, then use Virtual
          Try-On to see how they look.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-gold text-onyx font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Dresses
          </Link>
          <Link
            href="/try-on"
            className="px-6 py-3 rounded-xl glass-light text-ivory font-semibold hover:bg-white/10 transition-colors"
          >
            Virtual Try-On
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-platinum">
          {fittingRoomIds.length} dress{fittingRoomIds.length !== 1 ? 'es' : ''} saved
        </p>
        <ShareFittingRoom dressIds={fittingRoomIds} />
      </div>

      {/* Dress grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {fittingRoomIds.map((id) => (
            <div key={id} className="aspect-[3/4] skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {dresses.map((dress) => {
            const images = Array.isArray(dress.images) ? dress.images : []
            const firstImage =
              images.length > 0
                ? (images[0] as { url: string }).url
                : null

            return (
              <div
                key={dress.id}
                className="glass-light rounded-2xl overflow-hidden flex flex-col"
              >
                {/* Image */}
                <Link href={`/catalog/${dress.id}`} className="block relative aspect-[3/4]">
                  {firstImage ? (
                    <Image
                      src={firstImage}
                      alt={dress.name}
                      fill
                      className="object-cover rounded-t-2xl"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-white/5 rounded-t-2xl flex items-center justify-center">
                      <span className="text-4xl" aria-hidden="true">👗</span>
                    </div>
                  )}
                </Link>

                {/* Name + remove */}
                <div className="flex items-start justify-between gap-2 px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ivory">
                      {dress.name}
                    </p>
                    {dress.designer && (
                      <p className="truncate text-xs text-platinum/60">
                        {dress.designer}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => removeFromFittingRoom(dress.id)}
                    aria-label={`Remove ${dress.name} from fitting room`}
                    className="shrink-0 p-1 rounded-full text-white/30 hover:text-rose-400 hover:bg-white/5 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Try-on CTA */}
      <div className="flex justify-center">
        <Link
          href="/try-on"
          className="px-6 py-3 rounded-xl bg-gold text-onyx font-semibold hover:opacity-90 transition-opacity"
        >
          Virtual Try-On →
        </Link>
      </div>
    </div>
  )
}
