'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Camera, Upload, Sparkles, ArrowRight } from 'lucide-react'
import { SPRING_GENTLE } from '@/lib/motion'

const STEPS = [
  {
    icon: Upload,
    title: 'Upload Your Photo',
    body: 'A full-length photo works best. Plain background, good lighting.',
  },
  {
    icon: Sparkles,
    title: 'Pick Any Dress',
    body: 'Browse our full catalog of 500+ styles across all designers.',
  },
  {
    icon: Camera,
    title: 'See Yourself In It',
    body: 'Side-by-side comparison — your photo next to the dress, instantly.',
  },
]

export default function TryOnPromo() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-gold/15 p-8 sm:p-12 mx-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(212,175,55,0.07) 0%, rgba(5,5,5,0.96) 60%, rgba(212,175,55,0.04) 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 0% 50%, rgba(212,175,55,0.08) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center gap-10 lg:gap-16">
        {/* Left copy */}
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={SPRING_GENTLE}
          className="lg:w-80 shrink-0 space-y-4"
        >
          <div className="flex items-center gap-2">
            <Camera size={16} className="text-gold" />
            <span className="text-gold text-[11px] font-semibold tracking-[0.22em] uppercase">
              Exclusively at Top 10
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-ivory leading-tight">
            Try On Any
            <br />
            Dress <span className="text-gold">Virtually.</span>
          </h2>
          <p className="text-platinum/60 text-sm leading-relaxed">
            Upload your photo, pick a dress, and see yourself in it — side-by-side
            — before you ever step foot in the store.
          </p>
          <Link
            href="/try-on"
            className="inline-flex items-center gap-2 font-semibold text-sm px-7 py-3.5 rounded-2xl bg-gold text-onyx hover:brightness-110 active:scale-[0.97] transition-all"
          >
            <Camera size={16} aria-hidden="true" /> Try It Now{' '}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Right steps */}
        <div className="flex-1 grid sm:grid-cols-3 gap-4">
          {STEPS.map(({ icon: Icon, title, body }, i) => (
            <motion.div
              key={title}
              initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ ...SPRING_GENTLE, delay: i * 0.08 }}
              className="glass-light rounded-2xl p-5 space-y-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gold" aria-hidden="true" />
                </span>
                <span className="text-[10px] text-gold/60 font-bold tracking-[0.15em] uppercase">
                  Step {i + 1}
                </span>
              </div>
              <h3 className="text-ivory font-semibold text-sm">{title}</h3>
              <p className="text-platinum/50 text-xs leading-relaxed">{body}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
