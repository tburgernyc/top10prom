'use client'

import { motion, useReducedMotion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import type { Dress, DressImage } from '@/types/index'

interface ResultOverlayProps {
  photoUrl: string
  dress: Dress | null
  dressId?: string | undefined
  onTryAnother: () => void
}

function getPrimaryImage(dress: Dress): string | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
}

export function ResultOverlay({ photoUrl, dress, dressId, onTryAnother }: ResultOverlayProps) {
  const shouldReduce = useReducedMotion()
  const dressImage = dress ? getPrimaryImage(dress) : null

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className="space-y-5"
    >
      {/* Success badge */}
      <div className="flex items-center gap-2 text-sm text-emerald-300">
        <CheckCircle size={16} />
        <span>Your virtual look is ready!</span>
      </div>

      {/* Side-by-side result */}
      <div className="grid grid-cols-2 gap-3">
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

        <div className="space-y-1.5">
          <p className="text-xs text-platinum text-center">
            {dress?.name ?? 'Your Dress'}
          </p>
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
        </div>
      </div>

      {/* Note about beta */}
      <p className="text-xs text-platinum text-center">
        Full compositing coming soon. Book an in-store appointment to see it in person.
      </p>

      {/* CTAs */}
      <div className="flex flex-col gap-3">
        <Link href={dressId ? `/book?dress=${dressId}` : '/book'}>
          <Button variant="primary" className="w-full">
            Book Appointment
          </Button>
        </Link>
        <Button variant="ghost" className="w-full" onClick={onTryAnother}>
          Try Another Dress
        </Button>
      </div>
    </motion.div>
  )
}
