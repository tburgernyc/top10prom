'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { EventType } from '@/types/index'

const MAX_FITTING_ROOM = 8

interface ShopState {
  // ── Boutique context ───────────────────────────────────────────────────
  activeBoutiqueSlug: string
  activeBoutiqueId: string | null
  setActiveBoutique: (slug: string, id: string | null) => void

  // ── Fitting room ───────────────────────────────────────────────────────
  fittingRoomIds: string[]
  addToFittingRoom: (dressId: string) => void
  removeFromFittingRoom: (dressId: string) => void
  clearFittingRoom: () => void
  isInFittingRoom: (dressId: string) => boolean

  // ── Local wishlist (syncs to DB when authed) ───────────────────────────
  wishlistIds: string[]
  toggleWishlist: (dressId: string) => void
  isWishlisted: (dressId: string) => boolean

  // ── Event type context ─────────────────────────────────────────────────
  eventType: EventType | null
  setEventType: (type: EventType | null) => void

  // ── Hydration guard (required for SSR safety) ──────────────────────────
  _hasHydrated: boolean
  setHasHydrated: (val: boolean) => void
}

export const useShopStore = create<ShopState>()(
  persist(
    (set, get) => ({
      // ── Boutique ───────────────────────────────────────────────────────
      activeBoutiqueSlug: process.env.NEXT_PUBLIC_DEFAULT_BOUTIQUE_SLUG ?? 'demo',
      activeBoutiqueId: null,
      setActiveBoutique: (slug, id) =>
        set({ activeBoutiqueSlug: slug, activeBoutiqueId: id }),

      // ── Fitting room ───────────────────────────────────────────────────
      fittingRoomIds: [],
      addToFittingRoom: (dressId) =>
        set((s) => {
          if (s.fittingRoomIds.includes(dressId)) return s
          if (s.fittingRoomIds.length >= MAX_FITTING_ROOM) return s
          return { fittingRoomIds: [...s.fittingRoomIds, dressId] }
        }),
      removeFromFittingRoom: (dressId) =>
        set((s) => ({
          fittingRoomIds: s.fittingRoomIds.filter((id) => id !== dressId),
        })),
      clearFittingRoom: () => set({ fittingRoomIds: [] }),
      isInFittingRoom: (dressId) => get().fittingRoomIds.includes(dressId),

      // ── Wishlist ───────────────────────────────────────────────────────
      wishlistIds: [],
      toggleWishlist: (dressId) =>
        set((s) => ({
          wishlistIds: s.wishlistIds.includes(dressId)
            ? s.wishlistIds.filter((id) => id !== dressId)
            : [...s.wishlistIds, dressId],
        })),
      isWishlisted: (dressId) => get().wishlistIds.includes(dressId),

      // ── Event type ─────────────────────────────────────────────────────
      eventType: null,
      setEventType: (type) => set({ eventType: type }),

      // ── Hydration ──────────────────────────────────────────────────────
      _hasHydrated: false,
      setHasHydrated: (val) => set({ _hasHydrated: val }),
    }),
    {
      name: 'top10prom-shop',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    }
  )
)
