'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useShopStore } from '@/lib/store/shopStore'
import { createClient } from '@/lib/supabase/browser'
import DressCard from '@/components/catalog/DressCard'
import type { Dress } from '@/types/index'

export default function WishlistPage() {
  const wishlistIds = useShopStore((s) => s.wishlistIds)
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const isWishlisted = useShopStore((s) => s.isWishlisted)
  const _hasHydrated = useShopStore((s) => s._hasHydrated)

  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const isInFittingRoom = useShopStore((s) => s.isInFittingRoom)

  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!_hasHydrated || wishlistIds.length === 0) return

    let cancelled = false

    async function fetchDresses() {
      setLoading(true)
      const supabase = createClient()
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .in('id', wishlistIds)

      if (!cancelled) {
        setDresses((data ?? []) as Dress[])
        setLoading(false)
      }
    }

    void fetchDresses()

    return () => {
      cancelled = true
    }
  }, [wishlistIds, _hasHydrated])

  if (!_hasHydrated) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-ivory mb-6">My Wishlist</h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-[3/4] skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      </main>
    )
  }

  if (wishlistIds.length === 0) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-ivory mb-6">My Wishlist</h1>
        <div className="text-center py-20">
          <div className="text-7xl mb-6" role="img" aria-label="Empty wishlist">
            🤍
          </div>
          <h2 className="text-2xl font-bold text-ivory mb-3">Your Wishlist is Empty</h2>
          <p className="text-platinum mb-8 max-w-sm mx-auto">
            Save dresses you love while browsing the catalog. Sign in to sync across devices.
          </p>
          <Link
            href="/catalog"
            className="px-6 py-3 rounded-xl bg-gold text-onyx font-semibold hover:opacity-90 transition-opacity"
          >
            Browse Dresses
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-ivory">My Wishlist</h1>
        <p className="text-sm text-platinum">
          {wishlistIds.length} dress{wishlistIds.length !== 1 ? 'es' : ''} saved
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {wishlistIds.map((id) => (
            <div key={id} className="aspect-[3/4] skeleton-shimmer rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {dresses.map((dress) => (
            <DressCard
              key={dress.id}
              id={dress.id}
              name={dress.name}
              designer={dress.designer}
              color={dress.color}
              price_cents={dress.price_cents}
              images={dress.images}
              is_active={dress.is_active ?? true}
              isWishlisted={isWishlisted(dress.id)}
              onToggleWishlist={toggleWishlist}
              isInFittingRoom={isInFittingRoom(dress.id)}
              onAddToFittingRoom={addToFittingRoom}
            />
          ))}
        </div>
      )}
    </main>
  )
}
