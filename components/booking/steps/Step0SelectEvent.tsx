'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useShopStore } from '@/lib/store/shopStore'
import { Sparkles, Flower2 } from 'lucide-react'

interface Step0SelectEventProps {
  onNext: (eventType: 'prom' | 'wedding') => void
}

export function Step0SelectEvent({ onNext }: Step0SelectEventProps) {
  const shouldReduce = useReducedMotion()
  const setEventType = useShopStore((s) => s.setEventType)

  function handleSelect(type: 'prom' | 'wedding') {
    setEventType(type)
    onNext(type)
  }

  const cards = [
    {
      type: 'prom' as const,
      icon: Sparkles,
      label: 'Prom',
      tagline: 'Your night. Your dress. Exclusively yours.',
      sub: 'No-duplicate guarantee — one dress per school.',
      gradient: 'from-gold/20 to-gold/5',
      border: 'border-gold/30 hover:border-gold/60',
      iconColor: 'text-gold',
    },
    {
      type: 'wedding' as const,
      icon: Flower2,
      label: 'Wedding',
      tagline: 'Your forever begins here.',
      sub: 'Bridal gowns + full party coordination.',
      gradient: 'from-platinum/10 to-platinum/5',
      border: 'border-platinum/20 hover:border-platinum/50',
      iconColor: 'text-platinum',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-ivory">What are you shopping for?</h2>
        <p className="text-sm text-platinum">We&apos;ll tailor your experience to your event.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {cards.map(({ type, icon: Icon, label, tagline, sub, gradient, border, iconColor }, idx) => (
          <motion.button
            key={type}
            initial={shouldReduce ? {} : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 26, delay: idx * 0.08 }}
            whileHover={shouldReduce ? {} : { y: -3, scale: 1.02 }}
            whileTap={shouldReduce ? {} : { scale: 0.97 }}
            onClick={() => handleSelect(type)}
            className={[
              `w-full rounded-2xl border-2 p-6 text-left transition-colors bg-gradient-to-br ${gradient} ${border}`,
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/60',
            ].join(' ')}
          >
            <Icon size={28} className={`mb-3 ${iconColor}`} />
            <p className="text-lg font-bold text-ivory mb-1">{label}</p>
            <p className="text-sm text-platinum leading-snug">{tagline}</p>
            <p className="text-xs text-white/40 mt-2">{sub}</p>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
