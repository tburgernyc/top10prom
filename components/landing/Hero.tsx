'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { SPRING_GENTLE } from '@/lib/motion'

export default function Hero() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative flex flex-col items-center justify-center min-h-[80vh] px-4 text-center overflow-hidden">
      {/* Subtle gold radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={SPRING_GENTLE}
        className="relative z-10 max-w-3xl mx-auto space-y-6"
      >
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-light rounded-full text-xs text-gold font-medium">
          <span aria-hidden="true">✦</span>
          <span>No-Duplicate Dress Guarantee</span>
          <span aria-hidden="true">✦</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-black text-ivory leading-tight tracking-tight">
          Your Perfect Dress.{' '}
          <span className="text-gold">Only Yours.</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-platinum max-w-xl mx-auto leading-relaxed">
          Discover luxury prom and bridal gowns at Top 10 Prom boutiques.
          We guarantee no one else at your event will wear the same dress.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/catalog"
            className="px-8 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all"
          >
            Browse Dresses
          </Link>
          <Link
            href="/book"
            className="px-8 py-4 glass-light text-ivory font-semibold rounded-xl hover:bg-white/10 active:scale-[0.97] transition-all"
          >
            Book Appointment
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
