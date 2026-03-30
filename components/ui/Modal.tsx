'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'
import { useFocusTrap } from '@/lib/a11y'

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  className?: string
}

export default function Modal({
  open,
  onClose,
  title,
  children,
  className = '',
}: ModalProps) {
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
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: 16 }}
            animate={shouldReduce ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: 8 }}
            transition={SPRING_STANDARD}
            className={[
              'fixed inset-x-4 top-1/2 -translate-y-1/2 z-50',
              'max-w-lg mx-auto glass-heavy rounded-2xl p-6 shadow-2xl',
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
                aria-label="Close modal"
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
