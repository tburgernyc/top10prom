'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'
import Image from 'next/image'
import type { Dress, Boutique, DressImage } from '@/types/index'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { CalendarDays, MapPin, Clock, User, Mail, School } from 'lucide-react'
import type { BookingFormState } from '@/lib/actions/booking'

interface ConfirmValues {
  dress_id: string
  boutique_id: string
  preferred_date: string
  preferred_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  parent_email: string
  parent_phone: string
  school_name: string
  event_date: string
  notes: string
}

interface Step5ConfirmProps {
  values: ConfirmValues
  formAction: (payload: FormData) => void
  state: BookingFormState
  isPending: boolean
  onBack: () => void
}

export function Step5Confirm({ values, formAction, state, isPending, onBack }: Step5ConfirmProps) {
  const [dress, setDress] = useState<Dress | null>(null)
  const [boutique, setBoutique] = useState<Boutique | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchDetails() {
      const supabase = createClient()

      const [dressResult, boutiqueResult] = await Promise.all([
        values.dress_id
          ? supabase.from('dresses').select('*').eq('id', values.dress_id).single()
          : Promise.resolve({ data: null, error: null }),
        supabase.from('boutiques').select('*').eq('id', values.boutique_id).single(),
      ])

      if (!cancelled) {
        setDress((dressResult.data ?? null) as Dress | null)
        setBoutique((boutiqueResult.data ?? null) as Boutique | null)
        setLoading(false)
      }
    }

    fetchDetails()
    return () => { cancelled = true }
  }, [values.dress_id, values.boutique_id])

  function getPrimaryImage(d: Dress): string | null {
    const images = d.images as DressImage[] | null
    if (!Array.isArray(images) || images.length === 0) return null
    return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
  }

  const rows = [
    { icon: CalendarDays, label: 'Appointment', value: `${values.preferred_date} at ${values.preferred_time}` },
    { icon: MapPin, label: 'Store', value: boutique?.name ?? '—' },
    { icon: User, label: 'Name', value: values.customer_name },
    { icon: Mail, label: 'Email', value: values.customer_email },
    { icon: Mail, label: 'Parent email', value: values.parent_email },
    { icon: School, label: 'School', value: values.school_name },
    { icon: Clock, label: 'Prom date', value: values.event_date },
  ]

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} minHeight="min-h-12" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {dress ? (
        <div className="flex items-center gap-3 p-4 glass-light rounded-xl">
          {getPrimaryImage(dress) && (
            <Image
              src={getPrimaryImage(dress)!}
              alt={dress.name}
              width={64}
              height={64}
              className="w-16 h-16 rounded-lg object-cover shrink-0"
            />
          )}
          <div>
            <p className="text-ivory font-semibold">{dress.name}</p>
            {dress.designer && <p className="text-sm text-platinum">{dress.designer}</p>}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3 p-4 glass-light rounded-xl border border-white/10">
          <div className="w-12 h-12 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
            <span className="text-gold text-lg">✦</span>
          </div>
          <div>
            <p className="text-ivory font-semibold">Browse in store</p>
            <p className="text-sm text-platinum/60">Our stylists will help you find the perfect dress.</p>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {rows.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-start gap-3">
            <Icon size={16} className="text-gold mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-platinum">{label}</p>
              <p className="text-sm text-ivory">{value}</p>
            </div>
          </div>
        ))}
        {values.notes && (
          <div className="flex items-start gap-3">
            <div className="w-4 shrink-0" />
            <div>
              <p className="text-xs text-platinum">Notes</p>
              <p className="text-sm text-ivory">{values.notes}</p>
            </div>
          </div>
        )}
      </div>

      <div className="p-3 rounded-xl bg-gold/10 border border-gold/20 text-xs text-platinum">
        By confirming, you and your parent/guardian will each receive an email with your
        appointment details. Our team will follow up within 24 hours.
      </div>

      {state.status === 'error' && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
          {state.message}
        </div>
      )}

      <form action={formAction} className="space-y-0">
        <input type="hidden" name="dress_id" value={values.dress_id} />
        <input type="hidden" name="boutique_id" value={values.boutique_id} />
        <input type="hidden" name="preferred_date" value={values.preferred_date} />
        <input type="hidden" name="preferred_time" value={values.preferred_time} />
        <input type="hidden" name="customer_name" value={values.customer_name} />
        <input type="hidden" name="customer_email" value={values.customer_email} />
        <input type="hidden" name="customer_phone" value={values.customer_phone} />
        <input type="hidden" name="parent_email" value={values.parent_email} />
        <input type="hidden" name="parent_phone" value={values.parent_phone} />
        <input type="hidden" name="school_name" value={values.school_name} />
        <input type="hidden" name="event_date" value={values.event_date} />
        <input type="hidden" name="notes" value={values.notes} />

        <div className="flex gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="flex-1"
            disabled={isPending}
          >
            Back
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="flex-1"
            disabled={isPending}
          >
            {isPending ? 'Submitting…' : 'Confirm Booking'}
          </Button>
        </div>
      </form>
    </div>
  )
}
