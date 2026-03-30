'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'

// 4-phase processing labels
const PROCESSING_LABELS = [
  'Analyzing your photo…',
  'Mapping body contours…',
  'Applying dress overlay…',
  'Finalizing your look…',
] as const

interface ProcessingOverlayProps {
  isOpen: boolean
}

export function ProcessingOverlay({ isOpen }: ProcessingOverlayProps) {
  const shouldReduce = useReducedMotion()
  const [labelIdx, setLabelIdx] = useState(0)

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => {
      setLabelIdx((prev) => (prev + 1) % PROCESSING_LABELS.length)
    }, 900)

    return () => clearInterval(interval)
  }, [isOpen])

  const currentLabel = PROCESSING_LABELS[labelIdx] ?? PROCESSING_LABELS[0]

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          role="status"
          aria-live="polite"
          aria-label="Processing your virtual try-on"
          initial={shouldReduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={shouldReduce ? {} : { opacity: 0 }}
          transition={SPRING_STANDARD}
          className="fixed inset-0 z-40 bg-onyx/90 glass-heavy flex flex-col items-center justify-center gap-8 px-4"
        >
          {/* Scan-line animation container */}
          <div className="relative w-48 h-64 rounded-2xl overflow-hidden glass-light">
            {/* Animated scan line */}
            {!shouldReduce && (
              <div
                className="animate-scan absolute left-0 w-full h-0.5 bg-gold/60"
                aria-hidden="true"
              />
            )}
            {/* Corner marks */}
            {(['top-left', 'top-right', 'bottom-left', 'bottom-right'] as const).map((corner) => (
              <div
                key={corner}
                aria-hidden="true"
                className={[
                  'absolute w-5 h-5 border-gold',
                  corner === 'top-left'     && 'top-2 left-2 border-t-2 border-l-2',
                  corner === 'top-right'    && 'top-2 right-2 border-t-2 border-r-2',
                  corner === 'bottom-left'  && 'bottom-2 left-2 border-b-2 border-l-2',
                  corner === 'bottom-right' && 'bottom-2 right-2 border-b-2 border-r-2',
                ].filter(Boolean).join(' ')}
              />
            ))}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-5xl text-gold/20" aria-hidden="true">✦</span>
            </div>
          </div>

          {/* Processing label */}
          <div className="text-center space-y-2 min-h-[3rem]">
            <AnimatePresence mode="wait">
              <motion.p
                key={labelIdx}
                initial={shouldReduce ? {} : { opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={shouldReduce ? {} : { opacity: 0, y: -6 }}
                transition={{ type: 'spring', stiffness: 320, damping: 32 }}
                className="text-sm font-medium text-ivory"
              >
                {currentLabel}
              </motion.p>
            </AnimatePresence>
            <div className="flex gap-1 justify-center" aria-hidden="true">
              {PROCESSING_LABELS.map((_, i) => (
                <div
                  key={i}
                  className={[
                    'w-1.5 h-1.5 rounded-full transition-colors duration-300',
                    i === labelIdx
                      ? 'bg-gold'
                      : 'bg-white/20',
                  ].join(' ')}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
