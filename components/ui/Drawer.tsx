'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'
import { useFocusTrap } from '@/lib/a11y'

interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  side?: 'bottom' | 'right'
  children: React.ReactNode
  className?: string
}

export default function Drawer({
  open,
  onClose,
  title,
  side = 'bottom',
  children,
  className = '',
}: DrawerProps) {
  const shouldReduce = useReducedMotion()
  const titleId = useId()
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const prevFocusRef = useRef<HTMLElement | null>(null)

  useFocusTrap(panelRef, open, onClose)

  // Focus the close button on open; restore focus to trigger element on close
  useEffect(() => {
    if (open) {
      prevFocusRef.current = document.activeElement as HTMLElement
      closeRef.current?.focus()
    } else {
      prevFocusRef.current?.focus()
      prevFocusRef.current = null
    }
  }, [open])

  const hiddenStyle =
    side === 'bottom' ? { y: '100%' } : { x: '100%' }
  const visibleStyle =
    side === 'bottom' ? { y: 0 } : { x: 0 }

  const panelClasses =
    side === 'bottom'
      ? 'fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-2xl'
      : 'fixed inset-y-0 right-0 z-50 h-full w-full max-w-sm overflow-y-auto'

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0 }}
            animate={shouldReduce ? {} : { opacity: 1 }}
            exit={shouldReduce ? {} : { opacity: 0 }}
            transition={SPRING_STANDARD}
            className="fixed inset-0 z-40 bg-black/70"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? titleId : undefined}
            initial={shouldReduce ? {} : hiddenStyle}
            animate={shouldReduce ? {} : visibleStyle}
            exit={shouldReduce ? {} : hiddenStyle}
            transition={SPRING_STANDARD}
            className={[
              panelClasses,
              'glass-heavy shadow-2xl p-6',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              {title && (
                <h2
                  id={titleId}
                  className="text-lg font-semibold text-ivory"
                >
                  {title}
                </h2>
              )}
              <button
                ref={closeRef}
                onClick={onClose}
                aria-label="Close drawer"
                className="ml-auto text-white/40 hover:text-white/80 transition-colors p-1 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
