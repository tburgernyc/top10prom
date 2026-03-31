'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { SPRING_GENTLE } from '@/lib/motion'

export default function Hero() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center overflow-hidden">

      {/* ── Hero video background ──────────────────────────────────────────── */}
      {!shouldReduce && (
        <div className="absolute inset-0 -z-10" aria-hidden="true">
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            className="absolute inset-0 h-full w-full object-cover scale-[1.02]"
          >
            <source src="/video/hero.mp4" type="video/mp4" />
          </video>
          {/* Layered gradient: heavy at top/bottom, lighter in the middle so video shows */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                'linear-gradient(to bottom, rgba(10,10,10,0.75) 0%, rgba(10,10,10,0.35) 40%, rgba(10,10,10,0.35) 60%, rgba(10,10,10,0.82) 100%)',
              ].join(', '),
            }}
          />
          {/* Subtle gold centre glow on top of the video */}
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 60% 45% at 50% 55%, rgba(212,175,55,0.08) 0%, transparent 70%)',
            }}
          />
        </div>
      )}

      {/* Fallback glow when video is disabled (reduced motion) */}
      {shouldReduce && (
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 70% 50% at 50% 60%, rgba(212,175,55,0.07) 0%, transparent 70%)',
          }}
          aria-hidden="true"
        />
      )}

      {/* ── Content ───────────────────────────────────────────────────────── */}
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
        <h1 className="text-5xl md:text-7xl font-black text-ivory leading-tight tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.8)]">
          Your Perfect Dress.{' '}
          <span className="text-gold">Only Yours.</span>
        </h1>

        {/* Sub-headline */}
        <p className="text-lg md:text-xl text-platinum max-w-xl mx-auto leading-relaxed drop-shadow-[0_1px_6px_rgba(0,0,0,0.7)]">
          Discover luxury prom and bridal gowns at Top 10 Prom boutiques.
          We guarantee no one else at your event will wear the same dress.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/catalog"
            className="px-8 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx"
          >
            Browse Dresses
          </Link>
          <Link
            href="/book"
            className="px-8 py-4 glass-light text-ivory font-semibold rounded-xl hover:bg-white/10 active:scale-[0.97] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            Book Appointment
          </Link>
        </div>
      </motion.div>

      {/* Scroll indicator */}
      {!shouldReduce && (
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 0.5, y: 0 }}
          transition={{ delay: 1.5, ...SPRING_GENTLE }}
          aria-hidden="true"
        >
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[10px] text-platinum/60 uppercase tracking-[0.2em]">Scroll</span>
            <motion.div
              animate={{ y: [0, 5, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
              className="w-px h-6 bg-gradient-to-b from-platinum/40 to-transparent"
            />
          </div>
        </motion.div>
      )}
    </section>
  )
}
