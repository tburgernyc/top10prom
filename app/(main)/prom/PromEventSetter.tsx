'use client'

import { useEffect } from 'react'
import { useShopStore } from '@/lib/store/shopStore'

export default function PromEventSetter() {
  const setEventType = useShopStore((s) => s.setEventType)

  useEffect(() => {
    setEventType('prom')
  }, [setEventType])

  return null
}
