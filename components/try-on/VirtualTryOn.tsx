'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/browser'
import { useShopStore } from '@/lib/store/shopStore'
import type { Dress } from '@/types/index'
import { PhotoZone } from './PhotoZone'
import { DressPicker } from './DressPicker'
import { PreviewPane } from './PreviewPane'
import { ProcessingOverlay } from './ProcessingOverlay'
import { ResultOverlay } from './ResultOverlay'
import { TryOnActionBar } from './TryOnActionBar'

type TryOnPhase = 'idle' | 'ready' | 'processing' | 'result'

// Simulated processing duration (ms) — replaced with real AI call in a future phase
const PROCESSING_DURATION_MS = 3600

export function VirtualTryOn() {
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)
  const hasHydrated    = useShopStore((s) => s._hasHydrated)

  const [photoUrl,        setPhotoUrl]        = useState<string | null>(null)
  const [selectedDressId, setSelectedDressId] = useState<string | null>(null)
  const [selectedDress,   setSelectedDress]   = useState<Dress | null>(null)
  const [phase,           setPhase]           = useState<TryOnPhase>('idle')

  // Derive readiness without setState-in-effect
  const isReady = photoUrl !== null && selectedDressId !== null

  // Update phase based on readiness (without setState-in-effect for selectedIdx)
  // Phase transitions are driven by explicit user actions, not effects

  // Fetch full dress object when selectedDressId changes
  useEffect(() => {
    if (!selectedDressId) return
    let cancelled = false
    const dressIdToFetch = selectedDressId
    async function fetchDress() {
      const supabase = createClient()
      const { data } = await supabase
        .from('dresses')
        .select('*')
        .eq('id', dressIdToFetch)
        .single()
      if (!cancelled) {
        setSelectedDress(data as Dress | null)
      }
    }
    void fetchDress()
    return () => { cancelled = true }
  }, [selectedDressId])

  function handlePhotoSelect(url: string) {
    setPhotoUrl(url)
    if (phase === 'result') setPhase('ready')
  }

  function handlePhotoRemove() {
    setPhotoUrl(null)
    if (phase === 'result' || phase === 'ready') setPhase('idle')
  }

  function handleDressSelect(dressId: string) {
    setSelectedDressId(dressId)
    if (phase === 'result') setPhase('ready')
  }

  function handleTryOn() {
    if (!isReady) return
    setPhase('processing')
    setTimeout(() => {
      setPhase('result')
    }, PROCESSING_DURATION_MS)
  }

  function handleTryAnother() {
    setSelectedDressId(null)
    setSelectedDress(null)
    setPhase('idle')
  }

  if (!hasHydrated) {
    // Hydration guard — render nothing until Zustand has rehydrated
    return null
  }

  if (phase === 'result' && photoUrl) {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-ivory">Your Virtual Look</h2>
        <ResultOverlay
          photoUrl={photoUrl}
          dress={selectedDress}
          {...(selectedDressId !== null && { dressId: selectedDressId })}

          onTryAnother={handleTryAnother}
        />
        <ProcessingOverlay isOpen={false} />
      </div>
    )
  }

  return (
    <>
      <ProcessingOverlay isOpen={phase === 'processing'} />

      <div className="space-y-6">
        {/* Step 1: Photo */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Step 1 — Your Photo
          </h2>
          <PhotoZone
            photoUrl={photoUrl}
            onPhotoSelect={handlePhotoSelect}
            onPhotoRemove={handlePhotoRemove}
          />
        </section>

        {/* Step 2: Select Dress */}
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Step 2 — Choose a Dress
          </h2>
          <DressPicker
            fittingRoomIds={fittingRoomIds}
            selectedDressId={selectedDressId}
            onSelect={handleDressSelect}
          />
        </section>

        {/* Preview (visible once both are selected) */}
        {photoUrl && selectedDress && (
          <section className="space-y-3">
            <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
              Preview
            </h2>
            <PreviewPane photoUrl={photoUrl} dress={selectedDress} />
          </section>
        )}

        {/* Action bar */}
        <TryOnActionBar
          isReady={isReady}
          isPending={phase === 'processing'}
          onTryOn={handleTryOn}
        />
      </div>
    </>
  )
}
