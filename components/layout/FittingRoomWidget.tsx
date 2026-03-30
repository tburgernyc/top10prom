'use client'

import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import { useShopStore } from '@/lib/store/shopStore'

export default function FittingRoomWidget() {
  const shouldReduce = useReducedMotion()
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const _hasHydrated = useShopStore((s) => s._hasHydrated)

  const count = fittingRoomIds.length
  const visible = _hasHydrated && count > 0

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, scale: 0.8, y: 8 }}
          animate={shouldReduce ? {} : { opacity: 1, scale: 1, y: 0 }}
          exit={shouldReduce ? {} : { opacity: 0, scale: 0.8, y: 8 }}
          transition={SPRING_STANDARD}
          className="fixed bottom-24 right-4 md:bottom-8 z-30"
        >
          <Link
            href="/fitting-room"
            aria-label={`Fitting room — ${count} item${count !== 1 ? 's' : ''}`}
            className="flex items-center gap-2 glass-heavy border border-gold/40 rounded-full px-4 py-2 shadow-lg hover:border-gold/70 transition-colors"
          >
            <span className="text-base" aria-hidden="true">✨</span>
            <span className="text-sm font-semibold text-ivory">
              {count}
            </span>
            <span className="text-xs text-platinum hidden sm:inline">
              in fitting room
            </span>
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
