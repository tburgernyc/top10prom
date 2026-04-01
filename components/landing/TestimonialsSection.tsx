'use client'

import { motion, useReducedMotion } from 'motion/react'
import { SPRING_GENTLE } from '@/lib/motion'

const TESTIMONIALS = [
  {
    quote:
      'I walked into prom knowing I was the only girl in this dress. That confidence is priceless.',
    name: 'Ava M.',
    school: 'Marietta High School',
    initials: 'AM',
  },
  {
    quote:
      'The styling appointment was so personal. They pulled twelve dresses based on exactly what I described.',
    name: 'Jordan T.',
    school: 'Alpharetta High School',
    initials: 'JT',
  },
  {
    quote:
      'My mom cried when I found the one. The whole experience felt like it was made just for us.',
    name: 'Isabella R.',
    school: 'Kennesaw Mountain HS',
    initials: 'IR',
  },
]

function StarRow() {
  return (
    <div className="flex gap-0.5" aria-label="5 stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M6 1l1.236 2.506L10 3.882 7.939 5.89l.472 3.11L6 7.506l-2.411 1.494.472-3.11L2 3.882l2.764-.376L6 1z"
            fill="var(--color-gold)"
          />
        </svg>
      ))}
    </div>
  )
}

export default function TestimonialsSection() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6">
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={SPRING_GENTLE}
        className="flex items-center gap-3"
      >
        <span className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase">
          Real Stories
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {TESTIMONIALS.map(({ quote, name, school, initials }, i) => (
          <motion.div
            key={name}
            initial={shouldReduce ? {} : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ ...SPRING_GENTLE, delay: i * 0.08 }}
            className="glass-light rounded-3xl p-7 flex flex-col gap-5"
          >
            <StarRow />
            <p className="text-platinum/80 text-sm leading-relaxed italic flex-1">
              &ldquo;{quote}&rdquo;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-gold">{initials}</span>
              </div>
              <div>
                <p className="text-ivory text-xs font-semibold">{name}</p>
                <p className="text-gold/60 text-[10px]">{school}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
