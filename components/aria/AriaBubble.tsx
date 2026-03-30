'use client'

import { motion, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'

interface AriaBubbleProps {
  role: 'user' | 'assistant'
  content: string
  index: number
}

export function AriaBubble({ role, content, index }: AriaBubbleProps) {
  const shouldReduce = useReducedMotion()
  const isUser = role === 'user'

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ ...SPRING_STANDARD, delay: index * 0.04 }}
      className={['flex', isUser ? 'justify-end' : 'justify-start'].join(' ')}
    >
      {!isUser && (
        <div
          className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 mr-2 mt-0.5"
          aria-hidden="true"
        >
          <span className="text-gold text-xs">✦</span>
        </div>
      )}
      <div
        className={[
          'max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed',
          isUser
            ? 'bg-gold text-onyx font-medium rounded-br-sm'
            : 'glass-light text-ivory rounded-bl-sm',
        ].join(' ')}
      >
        {content}
      </div>
    </motion.div>
  )
}
