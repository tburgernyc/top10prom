'use client'

import { useState, useId, cloneElement } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SPRING_SNAPPY } from '@/lib/motion'

interface TooltipProps {
  content: string
  children: React.ReactElement<React.HTMLAttributes<HTMLElement>>
  side?: 'top' | 'bottom' | 'left' | 'right'
}

const sideClasses: Record<NonNullable<TooltipProps['side']>, string> = {
  top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
  bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
  left: 'right-full top-1/2 -translate-y-1/2 mr-2',
  right: 'left-full top-1/2 -translate-y-1/2 ml-2',
}

export default function Tooltip({
  content,
  children,
  side = 'top',
}: TooltipProps) {
  const shouldReduce = useReducedMotion()
  const [visible, setVisible] = useState(false)
  const tooltipId = useId()

  const show = () => setVisible(true)
  const hide = () => setVisible(false)

  const child = cloneElement(children, {
    'aria-describedby': visible ? tooltipId : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
  })

  return (
    <span className="relative inline-flex">
      {child}
      <AnimatePresence>
        {visible && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
            animate={shouldReduce ? {} : { opacity: 1, scale: 1 }}
            exit={shouldReduce ? {} : { opacity: 0, scale: 0.95 }}
            transition={SPRING_SNAPPY}
            className={[
              'pointer-events-none absolute z-50 whitespace-nowrap',
              'rounded-lg px-2.5 py-1.5 text-xs font-medium',
              'bg-onyx border border-white/10 text-ivory shadow-lg',
              sideClasses[side],
            ].join(' ')}
          >
            {content}
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  )
}
