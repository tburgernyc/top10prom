'use client'

import { useEffect } from 'react'
import { useShopStore } from '@/lib/store/shopStore'
import { BookingWizard } from '@/components/booking/BookingWizard'

interface WeddingBookingAdapterProps {
  initialDressId?: string | undefined
}

/**
 * Wraps BookingWizard with wedding-specific defaults.
 * Sets eventType to 'wedding' in Zustand store before rendering.
 */
export function WeddingBookingAdapter({ initialDressId }: WeddingBookingAdapterProps) {
  const setEventType = useShopStore((s) => s.setEventType)

  useEffect(() => {
    setEventType('wedding')
    return () => {
      // Reset to null when unmounting so wedding context doesn't leak
      setEventType(null)
    }
  }, [setEventType])

  return (
    <BookingWizard
      {...(initialDressId !== undefined && { initialDressId })}
    />
  )
}
