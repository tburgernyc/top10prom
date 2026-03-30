'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import { Heart, Plus, Check } from 'lucide-react'

interface DressCardProps {
  id: string
  name: string
  designer: string | null
  color: string | null
  price_cents: number | null
  images: unknown // JSON from DB — cast carefully
  is_active: boolean
  onAddToFittingRoom?: (id: string) => void
  onToggleWishlist?: (id: string) => void
  isInFittingRoom?: boolean
  isWishlisted?: boolean
}

export default function DressCard({
  id,
  name,
  designer,
  color,
  price_cents,
  images,
  is_active,
  onAddToFittingRoom,
  onToggleWishlist,
  isInFittingRoom = false,
  isWishlisted = false,
}: DressCardProps) {
  const shouldReduceMotion = useReducedMotion()

  const firstImage =
    Array.isArray(images) && images.length > 0
      ? (images[0] as { url: string }).url
      : null

  const priceDisplay =
    price_cents != null
      ? `$${(price_cents / 100).toFixed(0)}`
      : 'Price on request'

  return (
    <motion.div
      whileHover={shouldReduceMotion ? {} : { y: -4 }}
      transition={SPRING_STANDARD}
      className="glass-light rounded-2xl overflow-hidden flex flex-col active:scale-[0.98]"
    >
      {/* Image area */}
      <Link href={'/catalog/' + id} className="block">
        <div className="relative aspect-[3/4]">
          {firstImage ? (
            <Image
              src={firstImage}
              alt={name}
              fill
              className="object-cover rounded-t-2xl"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 rounded-t-2xl flex items-center justify-center">
              <span className="text-5xl">👗</span>
            </div>
          )}
          {!is_active && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-t-2xl">
              <span className="text-xs text-platinum uppercase tracking-wide">
                Unavailable
              </span>
            </div>
          )}
        </div>
      </Link>

      {/* Text area */}
      <Link href={'/catalog/' + id} className="block px-3 pt-3 pb-1">
        <p className="truncate text-sm font-medium text-ivory">
          {name}
        </p>
        {designer && (
          <p className="truncate text-xs text-platinum mt-0.5">
            {designer}
          </p>
        )}
        <p className="text-sm font-semibold text-gold mt-1">
          {priceDisplay}
        </p>
        {color && (
          <p className="text-xs text-platinum mt-0.5 truncate">
            {color}
          </p>
        )}
      </Link>

      {/* Action row */}
      <div className="flex items-center justify-between px-3 py-2 mt-auto">
        <button
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          onClick={() => onToggleWishlist?.(id)}
          className="p-1.5 rounded-full transition-colors hover:bg-white/10"
        >
          <Heart
            size={18}
            className={
              isWishlisted
                ? 'fill-gold text-gold'
                : 'text-platinum'
            }
          />
        </button>

        <button
          aria-label={
            isInFittingRoom ? 'Already in fitting room' : 'Add to fitting room'
          }
          onClick={() => onAddToFittingRoom?.(id)}
          className={[
            'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            isInFittingRoom
              ? 'bg-gold text-onyx'
              : 'glass-light text-platinum hover:text-ivory',
          ].join(' ')}
        >
          {isInFittingRoom ? <Check size={14} /> : <Plus size={14} />}
          {isInFittingRoom ? 'Added' : 'Try On'}
        </button>
      </div>
    </motion.div>
  )
}
