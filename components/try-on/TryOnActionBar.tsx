'use client'

import Button from '@/components/ui/Button'
import { Sparkles } from 'lucide-react'

interface TryOnActionBarProps {
  isReady: boolean
  isPending: boolean
  onTryOn: () => void
}

export function TryOnActionBar({ isReady, isPending, onTryOn }: TryOnActionBarProps) {
  return (
    <div className="space-y-2">
      <Button
        type="button"
        variant="primary"
        className="w-full"
        disabled={!isReady || isPending}
        loading={isPending}
        onClick={onTryOn}
      >
        <Sparkles size={16} />
        Virtual Try-On
      </Button>
      {!isReady && (
        <p className="text-center text-xs text-platinum">
          Upload a photo and select a dress to continue
        </p>
      )}
    </div>
  )
}
