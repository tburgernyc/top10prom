'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useShopStore } from '@/lib/store/shopStore'
import Carousel from '@/components/ui/Carousel'
import SizeGuide from '@/components/catalog/SizeGuide'
import DuplicateCheck from '@/components/catalog/DuplicateCheck'
import AvailabilityForm from '@/components/catalog/AvailabilityForm'
import Button from '@/components/ui/Button'
import type { Dress, DressImage } from '@/types/index'

interface DressDetailPanelProps {
  dress: Dress
}

function parseImages(raw: unknown): DressImage[] {
  if (!Array.isArray(raw)) return []
  return raw.filter(
    (item): item is DressImage =>
      typeof item === 'object' && item !== null && 'url' in item
  )
}

export default function DressDetailPanel({ dress }: DressDetailPanelProps) {
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false)
  const addToFittingRoom = useShopStore((s) => s.addToFittingRoom)
  const isInFittingRoom = useShopStore((s) => s.isInFittingRoom)
  const _hasHydrated = useShopStore((s) => s._hasHydrated)

  const images = parseImages(dress.images)
  const inFittingRoom = _hasHydrated && isInFittingRoom(dress.id)

  const priceDisplay =
    dress.price_cents != null
      ? `$${(dress.price_cents / 100).toFixed(0)}`
      : null

  // Build carousel items from all dress images
  const carouselItems =
    images.length > 0
      ? images.map((img, i) => (
          <div key={i} className="relative aspect-[3/4] rounded-2xl overflow-hidden">
            <Image
              src={img.url}
              alt={img.alt || dress.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))
      : [
          <div
            key="placeholder"
            className="relative aspect-[3/4] rounded-2xl overflow-hidden glass-light flex items-center justify-center"
          >
            <span className="text-8xl" aria-hidden="true">
              👗
            </span>
          </div>,
        ]

  return (
    <>
      <SizeGuide open={sizeGuideOpen} onClose={() => setSizeGuideOpen(false)} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image carousel */}
        <Carousel items={carouselItems} />

        {/* Details */}
        <div className="flex flex-col gap-6">
          {/* Name + designer */}
          <div>
            <h1 className="text-4xl font-bold text-ivory leading-tight">
              {dress.name}
            </h1>
            {dress.designer && (
              <p className="text-platinum mt-1 text-base">{dress.designer}</p>
            )}
          </div>

          {/* Price */}
          <p className="text-2xl font-bold text-gold">
            {priceDisplay ?? 'Price on request'}
          </p>

          {/* Color */}
          {dress.color && (
            <div className="flex items-center gap-2">
              <span
                className="w-4 h-4 rounded-full border border-white/20 shrink-0"
                style={{ backgroundColor: dress.color.toLowerCase() }}
                aria-hidden="true"
              />
              <span className="text-sm text-platinum">{dress.color}</span>
            </div>
          )}

          {/* Description */}
          {dress.description && (
            <p className="text-platinum text-sm leading-relaxed">
              {dress.description}
            </p>
          )}

          {/* Size guide trigger */}
          <button
            onClick={() => setSizeGuideOpen(true)}
            className="self-start text-xs text-gold underline underline-offset-2 hover:text-gold/80 transition-colors"
          >
            View size guide
          </button>

          {/* Primary actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              variant="primary"
              onClick={() => addToFittingRoom(dress.id)}
              disabled={inFittingRoom}
              aria-label={
                inFittingRoom
                  ? 'Already in fitting room'
                  : 'Add to fitting room'
              }
            >
              {inFittingRoom ? '✓ In Fitting Room' : 'Add to Fitting Room'}
            </Button>
            <Link
              href="/book"
              className="flex-1 text-center rounded-xl px-6 py-2.5 text-sm font-semibold glass-heavy text-ivory hover:bg-white/10 transition-colors border border-white/10"
            >
              Book Appointment
            </Link>
          </div>

          {/* Availability */}
          <div className="border-t border-white/10 pt-6">
            <AvailabilityForm dressId={dress.id} />
          </div>

          {/* Duplicate check */}
          <div className="border-t border-white/10 pt-6">
            <DuplicateCheck dressId={dress.id} />
          </div>
        </div>
      </div>
    </>
  )
}
