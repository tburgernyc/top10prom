'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { createClient } from '@/lib/supabase/browser'
import type { WeekHours } from '@/types/index'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Skeleton from '@/components/ui/Skeleton'

interface Step3DateTimeProps {
  boutiqueId: string
  preferredDate: string | null
  preferredTime: string | null
  onNext: (date: string, time: string) => void
  onBack: () => void
}

const TIME_SLOTS = [
  '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '1:00 PM', '1:30 PM',
  '2:00 PM', '2:30 PM', '3:00 PM', '3:30 PM',
  '4:00 PM', '4:30 PM', '5:00 PM', '5:30 PM',
]

const DAY_MAP: Record<number, keyof WeekHours> = {
  0: 'sunday', 1: 'monday', 2: 'tuesday', 3: 'wednesday',
  4: 'thursday', 5: 'friday', 6: 'saturday',
}

export function Step3DateTime({
  boutiqueId, preferredDate, preferredTime, onNext, onBack,
}: Step3DateTimeProps) {
  const shouldReduce = useReducedMotion()
  const [date, setDate] = useState(preferredDate ?? '')
  const [time, setTime] = useState(preferredTime ?? '')
  const [businessHours, setBusinessHours] = useState<WeekHours | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Min date: today + lead time (default 24h)
  const [leadTimeHours, setLeadTimeHours] = useState(24)

  useEffect(() => {
    if (!boutiqueId) return

    async function fetchSettings() {
      const supabase = createClient()
      const { data } = await supabase
        .from('boutique_settings')
        .select('business_hours, booking_lead_time_hours')
        .eq('boutique_id', boutiqueId)
        .single()

      if (data) {
        setBusinessHours(data.business_hours as unknown as WeekHours)
        setLeadTimeHours(data.booking_lead_time_hours ?? 24)
      }
      setLoading(false)
    }

    fetchSettings()
  }, [boutiqueId])

  const minDate = (() => {
    const d = new Date()
    d.setHours(d.getHours() + leadTimeHours)
    return d.toISOString().split('T')[0]
  })()

  function isDateClosed(dateStr: string): boolean {
    if (!businessHours || !dateStr) return false
    const d = new Date(dateStr + 'T12:00:00')
    const dayKey = DAY_MAP[d.getDay()] ?? 'sunday' as keyof WeekHours
    return businessHours[dayKey]?.open === null
  }

  function handleDateChange(val: string) {
    setDate(val)
    setTime('')
    setError('')
    if (val && isDateClosed(val)) {
      setError('The store is closed on that day. Please pick another date.')
    }
  }

  function handleNext() {
    if (!date || !time) {
      setError('Please select both a date and time.')
      return
    }
    if (isDateClosed(date)) {
      setError('The store is closed on that day. Please pick another date.')
      return
    }
    onNext(date, time)
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton minHeight="min-h-14" />
        <Skeleton minHeight="min-h-32" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-platinum">Choose your preferred appointment date and time:</p>

      <div className="space-y-2">
        <Input
          label="Preferred date"
          type="date"
          value={date}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleDateChange(e.target.value)}
          min={minDate}
          error={error && !time ? error : undefined}
        />
        {error && date && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {date && !isDateClosed(date) && (
        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="space-y-2"
        >
          <p className="text-sm text-platinum">Select a time:</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
            {TIME_SLOTS.map((slot) => (
              <button
                key={slot}
                onClick={() => setTime(slot)}
                className={[
                  'py-2 px-3 rounded-lg text-xs font-medium border transition-colors',
                  time === slot
                    ? 'bg-gold text-onyx border-gold'
                    : 'border-white/10 text-platinum hover:border-white/30 hover:text-ivory',
                ].join(' ')}
              >
                {slot}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <div className="pt-2 flex gap-3">
        <Button variant="ghost" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          disabled={!date || !time || isDateClosed(date)}
          onClick={handleNext}
        >
          Continue
        </Button>
      </div>
    </div>
  )
}
