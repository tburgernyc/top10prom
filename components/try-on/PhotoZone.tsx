'use client'

import { useRef } from 'react'
import Image from 'next/image'
import { Camera, Upload, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface PhotoZoneProps {
  photoUrl: string | null
  onPhotoSelect: (dataUrl: string) => void
  onPhotoRemove: () => void
}

export function PhotoZone({ photoUrl, onPhotoSelect, onPhotoRemove }: PhotoZoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        onPhotoSelect(result)
      }
    }
    reader.readAsDataURL(file)
    // Reset so the same file can be re-selected
    e.target.value = ''
  }

  if (photoUrl) {
    return (
      <div className="relative w-full aspect-[3/4] rounded-2xl overflow-hidden glass-light">
        <Image
          src={photoUrl}
          alt="Your photo"
          fill
          className="object-cover"
          unoptimized
        />
        <button
          type="button"
          onClick={onPhotoRemove}
          className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white hover:bg-black/80 transition-colors"
          aria-label="Remove photo"
        >
          <X size={16} />
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="w-full aspect-[3/4] rounded-2xl glass-light border-dashed border-2 border-white/20 hover:border-gold/40 flex flex-col items-center justify-center gap-3 transition-colors group"
        aria-label="Upload your photo"
      >
        <div className="w-14 h-14 rounded-full bg-gold/10 flex items-center justify-center group-hover:bg-gold/20 transition-colors">
          <Upload size={24} className="text-gold" />
        </div>
        <div className="text-center px-4">
          <p className="text-sm font-medium text-ivory">Upload your photo</p>
          <p className="text-xs text-platinum mt-0.5">
            For best results, use a full-body photo with a plain background
          </p>
        </div>
      </button>

      {/* Camera capture on mobile */}
      <Button
        type="button"
        variant="ghost"
        className="w-full"
        onClick={() => {
          if (fileInputRef.current) {
            fileInputRef.current.setAttribute('capture', 'user')
            fileInputRef.current.click()
          }
        }}
      >
        <Camera size={16} />
        Take a Photo
      </Button>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-hidden="true"
        onChange={handleFileChange}
      />
    </div>
  )
}
