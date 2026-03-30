'use client'

import Image from 'next/image'
import type { Dress, DressImage } from '@/types/index'

interface PreviewPaneProps {
  photoUrl: string
  dress: Dress | null
}

function getPrimaryImage(dress: Dress): string | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
}

export function PreviewPane({ photoUrl, dress }: PreviewPaneProps) {
  const dressImage = dress ? getPrimaryImage(dress) : null

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* User photo */}
      <div className="space-y-1.5">
        <p className="text-xs text-platinum text-center">Your Photo</p>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden glass-light">
          <Image
            src={photoUrl}
            alt="Your photo"
            fill
            className="object-cover"
            unoptimized
          />
        </div>
      </div>

      {/* Dress */}
      <div className="space-y-1.5">
        <p className="text-xs text-platinum text-center">Selected Dress</p>
        <div className="relative aspect-[3/4] rounded-xl overflow-hidden glass-light">
          {dressImage ? (
            <Image
              src={dressImage}
              alt={dress?.name ?? 'Selected dress'}
              fill
              className="object-cover"
              sizes="50vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-gold text-4xl" aria-hidden="true">✦</span>
            </div>
          )}
        </div>
        {dress && (
          <p className="text-xs text-ivory text-center truncate">{dress.name}</p>
        )}
      </div>
    </div>
  )
}
