'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { Calendar, Sparkles, ShieldCheck, Star } from 'lucide-react'
import { SPRING_GENTLE } from '@/lib/motion'

const STEPS = [
  {
    icon: Calendar,
    num: '01',
    title: 'Book a Free Appointment',
    body: 'Choose a location and time. Private, no-crowd styling sessions — just you and your stylist.',
  },
  {
    icon: Sparkles,
    num: '02',
    title: 'Browse & Try On',
    body: '500+ styles in every boutique. Your stylist pulls looks based on your vision, body, and budget.',
  },
  {
    icon: ShieldCheck,
    num: '03',
    title: 'Reserve Your Dress',
    body: 'Lock in your style. It\'s now school-exclusive for your prom date — no one else can book it.',
  },
  {
    icon: Star,
    num: '04',
    title: 'Walk In as the Only One',
    body: 'No duplicates. No surprises. Just you, your dress, and the confidence you deserve.',
  },
]

export default function HowItWorksSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-8">
      {/* Header */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={SPRING_GENTLE}
        className="flex items-center gap-3"
      >
        <span className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase">
          How It Works
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      {/* Steps grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map(({ icon: Icon, num, title, body }, i) => (
          <motion.div
            key={num}
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING_GENTLE, delay: i * 0.08 }}
            className="relative glass-light rounded-3xl p-6 flex flex-col gap-4"
          >
            {/* Connector line (desktop only) */}
            {i < STEPS.length - 1 && (
              <div
                className="hidden lg:block absolute top-8 left-full w-4 h-px bg-gold/20 z-10"
                aria-hidden="true"
              />
            )}

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                <Icon size={16} className="text-gold" aria-hidden="true" />
              </div>
              <span className="text-[10px] font-black text-gold/40 tracking-[0.2em]">{num}</span>
            </div>

            <div>
              <h3 className="text-ivory font-semibold text-sm mb-1.5">{title}</h3>
              <p className="text-platinum/50 text-xs leading-relaxed">{body}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* CTA */}
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ ...SPRING_GENTLE, delay: 0.35 }}
        className="flex justify-center"
      >
        <Link
          href="/book"
          className="inline-flex items-center justify-center font-semibold text-sm px-8 py-4 rounded-2xl bg-gold text-onyx hover:brightness-110 active:scale-[0.97] transition-all"
        >
          Book Your Appointment →
        </Link>
      </motion.div>
    </section>
  )
}
