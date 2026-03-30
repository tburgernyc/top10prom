'use client'

import { useEffect, useId, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',')

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

  useEffect(() => {
    if (open) {
      closeRef.current?.focus()
    }
  }, [open])

  // Close on Escape; trap focus within panel
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      if (e.key !== 'Tab') return

      const panel = panelRef.current
      if (!panel) return
      const focusable = Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE))
      if (focusable.length === 0) return

      const first = focusable[0]!
      const last  = focusable[focusable.length - 1]!

      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

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
