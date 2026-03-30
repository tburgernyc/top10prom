'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'

interface CarouselProps {
  items: React.ReactNode[]
  className?: string
}

export default function Carousel({ items, className = '' }: CarouselProps) {
  const shouldReduce = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)

  const prev = useCallback(() => {
    setDirection(-1)
    setIndex((i) => (i - 1 + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => {
    setDirection(1)
    setIndex((i) => (i + 1) % items.length)
  }, [items.length])

  if (items.length === 0) return null

  if (items.length === 1) {
    return <div className={className}>{items[0]}</div>
  }

  const variants = {
    enter: (dir: number) => ({
      x: shouldReduce ? 0 : dir * 60,
      opacity: 0,
    }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({
      x: shouldReduce ? 0 : dir * -60,
      opacity: 0,
    }),
  }

  return (
    <div className={['relative overflow-hidden', className].filter(Boolean).join(' ')}>
      {/* Slide area */}
      <div className="relative w-full">
        <AnimatePresence custom={direction} mode="wait">
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={SPRING_STANDARD}
          >
            {items[index]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Prev button */}
      <button
        onClick={prev}
        aria-label="Previous slide"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
      >
        <ChevronLeft size={18} />
      </button>

      {/* Next button */}
      <button
        onClick={next}
        aria-label="Next slide"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white/80 hover:bg-black/70 transition-colors"
      >
        <ChevronRight size={18} />
      </button>

      {/* Dots */}
      <div className="flex justify-center gap-1.5 mt-3">
        {items.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > index ? 1 : -1)
              setIndex(i)
            }}
            aria-label={`Go to slide ${i + 1}`}
            className={[
              'h-1.5 rounded-full transition-all',
              i === index
                ? 'w-4 bg-gold'
                : 'w-1.5 bg-white/30 hover:bg-white/50',
            ].join(' ')}
          />
        ))}
      </div>
    </div>
  )
}
