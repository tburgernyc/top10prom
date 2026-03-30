'use client'

import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import type { Dress } from '@/types/index'
import { useShopStore } from '@/lib/store/shopStore'
import DressCard from './DressCard'

interface DressCardGridProps {
  dresses: Dress[]
  emptyMessage?: string
}

export default function DressCardGrid({
  dresses,
  emptyMessage = 'No dresses found.',
}: DressCardGridProps) {
  const shouldReduceMotion = useReducedMotion()

  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const toggleWishlist = useShopStore((s) => s.toggleWishlist)
  const isInFittingRoom = useShopStore((s) => s.isInFittingRoom)
  const isWishlisted = useShopStore((s) => s.isWishlisted)

  if (dresses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
        <span className="text-6xl">👗</span>
        <p className="text-platinum text-sm">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      <AnimatePresence>
        {dresses.map((dress) => (
          <motion.div
            key={dress.id}
            layout
            initial={shouldReduceMotion ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, scale: 0.95 }}
            transition={SPRING_STANDARD}
          >
            <DressCard
              id={dress.id}
              name={dress.name}
              designer={dress.designer}
              color={dress.color}
              price_cents={dress.price_cents}
              images={dress.images}
              is_active={dress.is_active}
              onAddToFittingRoom={addToFittingRoom}
              onToggleWishlist={toggleWishlist}
              isInFittingRoom={isInFittingRoom(dress.id)}
              isWishlisted={isWishlisted(dress.id)}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
