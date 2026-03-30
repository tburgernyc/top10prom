'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { bookingStep4Schema } from '@/lib/schemas'

interface ContactValues {
  customer_name: string
  customer_email: string
  customer_phone: string
  parent_email: string
  parent_phone: string
  school_name: string
  event_date: string
  notes: string
}

interface Step4ContactProps {
  values: ContactValues
  eventType?: 'prom' | 'wedding'
  onNext: (values: ContactValues) => void
  onBack: () => void
}

export function Step4Contact({ values, eventType = 'prom', onNext, onBack }: Step4ContactProps) {
  const shouldReduce = useReducedMotion()
  const [form, setForm] = useState<ContactValues>(values)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof ContactValues, string>>>({})

  function update(key: keyof ContactValues, val: string) {
    setForm((prev) => ({ ...prev, [key]: val }))
    if (fieldErrors[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: undefined }))
    }
  }

  function handleNext() {
    const parsed = bookingStep4Schema.safeParse(form)
    if (!parsed.success) {
      const errors: Partial<Record<keyof ContactValues, string>> = {}
      for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
        errors[key as keyof ContactValues] = (msgs as string[])[0] ?? ''
      }
      setFieldErrors(errors)
      return
    }
    onNext(form)
  }

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="space-y-6"
    >
      <div className="space-y-4">
        <div>
          <p className="text-sm font-medium text-gold mb-3">Your information</p>
          <div className="space-y-3">
            <Input
              label="Full name"
              value={form.customer_name}
              onChange={(e) => update('customer_name', e.target.value)}
              error={fieldErrors.customer_name}
              required
            />
            <Input
              label="Email"
              type="email"
              value={form.customer_email}
              onChange={(e) => update('customer_email', e.target.value)}
              error={fieldErrors.customer_email}
              required
            />
            <Input
              label="Phone (optional)"
              type="tel"
              value={form.customer_phone}
              onChange={(e) => update('customer_phone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gold mb-1">Parent / guardian</p>
          <p className="text-xs text-platinum mb-3">
            Your parent or guardian will also receive booking confirmation.
          </p>
          <div className="space-y-3">
            <Input
              label="Parent / guardian email"
              type="email"
              value={form.parent_email}
              onChange={(e) => update('parent_email', e.target.value)}
              error={fieldErrors.parent_email}
              required
            />
            <Input
              label="Parent / guardian phone (optional)"
              type="tel"
              value={form.parent_phone}
              onChange={(e) => update('parent_phone', e.target.value)}
            />
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gold mb-3">Event details</p>
          <div className="space-y-3">
            <Input
              label={eventType === 'wedding' ? "Bride's name" : 'School name'}
              value={form.school_name}
              onChange={(e) => update('school_name', e.target.value)}
              error={fieldErrors.school_name}
              required
            />
            <Input
              label={eventType === 'wedding' ? 'Wedding date' : 'Prom date'}
              type="date"
              value={form.event_date}
              onChange={(e) => update('event_date', e.target.value)}
              error={fieldErrors.event_date}
              required
            />
            <div className="space-y-1">
              <label className="text-sm text-platinum">Notes (optional)</label>
              <textarea
                value={form.notes}
                onChange={(e) => update('notes', e.target.value)}
                rows={3}
                placeholder="Size preferences, questions, special requests…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-gold/50 resize-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button variant="primary" className="flex-1" onClick={handleNext}>
          Review Booking
        </Button>
      </div>
    </motion.div>
  )
}
