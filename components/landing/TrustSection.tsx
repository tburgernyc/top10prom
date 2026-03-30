'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { MapPin, Calendar, Sparkles, ArrowRight } from 'lucide-react'
import { SPRING_GENTLE } from '@/lib/motion'

const spring = (delay = 0) => ({ ...SPRING_GENTLE, delay })

export default function TrustSection() {
  const shouldReduce = useReducedMotion()
  const init = shouldReduce ? {} : { opacity: 0, y: 20 }

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-4">
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={spring()}
        className="flex items-center gap-3"
      >
        <span className="text-[11px] text-gold font-semibold tracking-[0.22em] uppercase">
          Why Top 10 Prom
        </span>
        <div className="flex-1 h-px bg-white/10" />
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-fr">
        {/* Card 1 — big feature, spans 2 cols on lg */}
        <motion.div
          initial={init}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring(0)}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl glass-light p-8 sm:p-10 flex flex-col justify-between min-h-[220px]"
        >
          <div
            className="absolute right-0 bottom-0 pointer-events-none select-none"
            style={{
              fontSize: '11rem',
              lineHeight: 1,
              fontWeight: 900,
              color: 'rgba(212,175,55,0.05)',
              transform: 'translate(12%, 18%)',
            }}
            aria-hidden="true"
          >
            1K+
          </div>
          <div>
            <Sparkles size={20} className="text-gold mb-4" />
            <h3 className="text-ivory font-bold text-2xl sm:text-3xl leading-tight mb-2">
              Over <span className="text-gold">500 styles</span>
              <br />in every boutique.
            </h3>
            <p className="text-platinum/55 text-sm leading-relaxed max-w-sm">
              Ballgowns, A-lines, mermaid cuts, two-piece sets — every
              silhouette, color, and size range from the world&apos;s top prom
              designers.
            </p>
          </div>
          <Link
            href="/catalog"
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
          >
            Browse the collection <ArrowRight size={14} />
          </Link>
        </motion.div>

        {/* Card 2 — locations */}
        <motion.div
          initial={init}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring(0.06)}
          className="relative overflow-hidden rounded-3xl glass-light p-7 flex flex-col justify-between min-h-[220px]"
        >
          <div>
            <MapPin size={20} className="text-gold mb-4" />
            <p className="text-[10px] text-gold/70 font-semibold tracking-[0.2em] uppercase mb-1">
              Atlanta Metro
            </p>
            <h3 className="text-ivory font-bold text-xl leading-snug mb-2">
              5+ Boutique
              <br />Locations
            </h3>
            <ul className="space-y-0.5">
              {['Marietta', 'Alpharetta', 'Buckhead', 'Smyrna', 'Kennesaw'].map(
                (city) => (
                  <li
                    key={city}
                    className="text-xs text-platinum/50 flex items-center gap-1.5"
                  >
                    <span
                      className="w-1 h-1 rounded-full bg-gold/40"
                      aria-hidden="true"
                    />
                    {city}
                  </li>
                )
              )}
            </ul>
          </div>
          <Link
            href="/boutiques"
            className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-gold hover:text-gold/80 transition-colors"
          >
            Find your nearest store <ArrowRight size={12} />
          </Link>
        </motion.div>

        {/* Card 3 — designers */}
        <motion.div
          initial={init}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring(0.10)}
          className="relative overflow-hidden rounded-3xl glass-light p-7 flex flex-col justify-between min-h-[200px]"
        >
          <div>
            <p className="text-[10px] text-gold/70 font-semibold tracking-[0.2em] uppercase mb-2">
              Featured Labels
            </p>
            <div className="flex flex-wrap gap-1.5">
              {[
                'Johnathan Kayne',
                'Ashley Lauren',
                'Jessica Angel',
                'Kate Parker',
                'Sherri Hill',
              ].map((d) => (
                <span
                  key={d}
                  className="text-[11px] text-platinum/60 bg-white/5 border border-white/10 rounded-full px-2.5 py-0.5"
                >
                  {d}
                </span>
              ))}
              <span className="text-[11px] text-gold bg-gold/10 border border-gold/20 rounded-full px-2.5 py-0.5">
                + more
              </span>
            </div>
          </div>
          <p className="text-platinum/40 text-xs mt-4 leading-relaxed">
            New arrivals added weekly from every major prom house.
          </p>
        </motion.div>

        {/* Card 4 — personal appointments */}
        <motion.div
          initial={init}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={spring(0.14)}
          className="lg:col-span-2 relative overflow-hidden rounded-3xl border border-gold/20 p-8 sm:p-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 min-h-[160px]"
          style={{
            background:
              'linear-gradient(135deg, rgba(212,175,55,0.08) 0%, rgba(5,5,5,0.6) 100%)',
          }}
        >
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-2xl bg-gold/15 border border-gold/25 flex items-center justify-center shrink-0">
              <Calendar size={20} className="text-gold" />
            </div>
            <div>
              <h3 className="text-ivory font-bold text-lg sm:text-xl">
                Personal Styling Appointments
              </h3>
              <p className="text-platinum/55 text-sm mt-1 leading-relaxed max-w-md">
                One-on-one time with an expert stylist. No crowds, no rushing —
                just you, your mom, and the perfect dress.
              </p>
            </div>
          </div>
          <Link
            href="/book"
            className="shrink-0 inline-flex items-center justify-center font-semibold text-sm px-7 py-3.5 rounded-2xl bg-gold text-onyx hover:brightness-110 active:scale-[0.97] transition-all whitespace-nowrap"
          >
            Book Appointment
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
