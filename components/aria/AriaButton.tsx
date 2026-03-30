'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { MessageCircle, X } from 'lucide-react'
import { AriaPanel } from './AriaPanel'
import { SPRING_STANDARD } from '@/lib/motion'

export function AriaButton() {
  const shouldReduce = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <AriaPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />

      {/* FAB */}
      <motion.button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        whileTap={shouldReduce ? {} : { scale: 0.93 }}
        whileHover={shouldReduce ? {} : { scale: 1.06 }}
        transition={SPRING_STANDARD}
        className={[
          'fixed bottom-[4.5rem] right-4 md:bottom-6 md:right-6 z-50',
          'w-14 h-14 rounded-full',
          'bg-gold text-onyx',
          'flex items-center justify-center',
          'shadow-lg shadow-black/40',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx',
        ].join(' ')}
        aria-label={isOpen ? 'Close Aria' : 'Open Aria style concierge'}
        aria-expanded={isOpen}
        aria-controls="aria-panel"
      >
        <motion.div
          animate={{ rotate: isOpen ? 90 : 0 }}
          transition={SPRING_STANDARD}
        >
          {isOpen ? <X size={22} /> : <MessageCircle size={22} />}
        </motion.div>
      </motion.button>
    </>
  )
}
