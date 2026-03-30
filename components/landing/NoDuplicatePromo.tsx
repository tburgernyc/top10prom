'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { ShieldCheck } from 'lucide-react'
import { SPRING_GENTLE } from '@/lib/motion'

const PILLARS = [
  {
    num: '01',
    title: 'Reserve Your Dress',
    body: 'Choose from 500+ styles and lock it in. Your selection is tied to your school.',
  },
  {
    num: '02',
    title: 'School-Wide Lock',
    body: "No other student at your school can book the same dress for the same prom night.",
  },
  {
    num: '03',
    title: 'Walk In Confident',
    body: 'Guaranteed exclusivity. Show up knowing you are the only one in your dress.',
  },
]

export default function NoDuplicatePromo() {
  const shouldReduce = useReducedMotion()

  return (
    <section
      className="relative overflow-hidden rounded-3xl border border-gold/15 mx-4"
      style={{
        background:
          'linear-gradient(135deg, rgba(212,175,55,0.06) 0%, rgba(5,5,5,0.95) 50%, rgba(212,175,55,0.04) 100%)',
      }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 60% at 100% 100%, rgba(212,175,55,0.10) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 grid lg:grid-cols-2 gap-0">
        {/* Left — headline */}
        <div className="px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-white/10">
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={SPRING_GENTLE}
          >
            <div className="flex items-center gap-2 mb-6">
              <ShieldCheck size={16} className="text-gold" />
              <span className="text-gold text-[11px] font-semibold tracking-[0.22em] uppercase">
                The No-Duplicate Guarantee
              </span>
            </div>

            <div className="flex items-end gap-4 mb-4 leading-none">
              <span
                className="font-black text-gold select-none"
                style={{ fontSize: 'clamp(6rem, 16vw, 11rem)', lineHeight: 0.85, opacity: 0.9 }}
              >
                0
              </span>
              <div className="pb-3">
                <p className="text-ivory/90 text-xl sm:text-2xl font-bold leading-tight">
                  duplicate<br />dresses.<br />
                  <span className="text-platinum/60 font-normal text-base">Ever.</span>
                </p>
              </div>
            </div>

            <p className="text-platinum/65 text-sm leading-relaxed max-w-sm mt-4">
              When you book with Top 10 Prom, your dress is exclusively yours
              at your school for prom night. No exceptions.
            </p>
          </motion.div>
        </div>

        {/* Right — 3 pillars + CTA */}
        <div className="px-8 py-12 sm:px-12 sm:py-16 flex flex-col justify-between gap-8">
          <div className="space-y-6">
            {PILLARS.map(({ num, title, body }, i) => (
              <motion.div
                key={num}
                initial={shouldReduce ? {} : { opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ ...SPRING_GENTLE, delay: i * 0.08 }}
                className="flex gap-4 rounded-xl p-2 -mx-2"
              >
                <span className="text-[11px] font-black text-gold/50 tracking-widest mt-0.5 shrink-0 w-6">
                  {num}
                </span>
                <div>
                  <h3 className="text-ivory font-semibold text-sm mb-1">{title}</h3>
                  <p className="text-platinum/55 text-xs leading-relaxed">{body}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: 0.3 }}
          >
            <Link
              href="/catalog"
              className="inline-flex items-center justify-center w-full sm:w-auto font-semibold text-sm px-8 py-4 rounded-2xl bg-gold text-onyx hover:brightness-110 active:scale-[0.97] transition-all"
            >
              Shop Your Exclusive Look
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
