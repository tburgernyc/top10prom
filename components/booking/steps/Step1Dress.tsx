'use client'

import { useState, useEffect } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import { useShopStore } from '@/lib/store/shopStore'
import { STATIC_DRESSES } from '@/lib/data/dresses'
import { createClient } from '@/lib/supabase/browser'
import type { Dress, DressImage } from '@/types/index'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import Image from 'next/image'
import { Check, Shirt, ChevronDown } from 'lucide-react'

export interface DressPreferences {
  occasion: string
  length: string
  color: string
  style: string
  timeOfDay: string
  season: string
  additionalNotes: string
}

interface Step1DressProps {
  selectedDressId: string | null
  onNext: (dressId: string, preferences?: DressPreferences) => void
}

const OCCASIONS = [
  'Prom', 'Homecoming', 'Sweet 16', 'Pageant', 'Wedding Guest',
  'Quinceañera', 'Gala / Black Tie', 'Military Ball', 'Other',
]
const LENGTHS = ['Floor length', 'Tea length / Midi', 'Mini / Short', 'Asymmetrical / Hi-Lo']
const COLORS = [
  'Open to anything', 'White / Ivory', 'Black', 'Navy / Dark Blue',
  'Red', 'Pink / Blush', 'Champagne / Gold', 'Purple', 'Green',
  'Blue', 'Coral / Orange', 'Multi-color / Print',
]
const STYLES = [
  'Ball gown', 'A-line / Princess', 'Mermaid / Trumpet',
  'Fitted / Sheath', 'Two-piece / Crop top', 'Off-shoulder',
  'Corset / Structured', 'Flowy / Chiffon', 'Sequin / Glitter',
]
const TIMES_OF_DAY = ['Morning (9 am – 12 pm)', 'Afternoon (12 pm – 4 pm)', 'Evening (4 pm – 7 pm)', 'Flexible']
const SEASONS = ['Spring (Mar – May)', 'Summer (Jun – Aug)', 'Fall (Sep – Nov)', 'Winter (Dec – Feb)']

function SelectField({ label, value, onChange, options, required }: {
  label: string
  value: string
  onChange: (v: string) => void
  options: string[]
  required?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm text-platinum">
        {label}{required && <span className="text-gold ml-0.5">*</span>}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full appearance-none rounded-xl bg-white/5 border border-white/10 px-4 py-3 pr-10 text-sm text-ivory focus:outline-none focus:border-gold/50 transition-colors"
        >
          <option value="" className="bg-onyx text-platinum">Select…</option>
          {options.map((o) => (
            <option key={o} value={o} className="bg-onyx text-ivory">{o}</option>
          ))}
        </select>
        <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-platinum/40 pointer-events-none" />
      </div>
    </div>
  )
}

function getPrimaryImage(dress: Dress): string | null {
  const images = dress.images as DressImage[] | null
  if (!Array.isArray(images) || images.length === 0) return null
  return images.find((img) => img.is_primary)?.url ?? images[0]?.url ?? null
}

export function Step1Dress({ selectedDressId, onNext }: Step1DressProps) {
  const shouldReduce = useReducedMotion()
  const isHydrated = useShopStore((s) => s._hasHydrated)
  const fittingRoomIds = useShopStore((s) => s.fittingRoomIds)

  const [mode, setMode] = useState<'choose' | 'preferences'>('choose')
  const [dresses, setDresses] = useState<Dress[]>([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<string | null>(selectedDressId)

  const [prefs, setPrefs] = useState<DressPreferences>({
    occasion: '',
    length: '',
    color: '',
    style: '',
    timeOfDay: '',
    season: '',
    additionalNotes: '',
  })
  const [prefsError, setPrefsError] = useState('')

  // Load dresses: fitting room first, then full static catalog as fallback
  useEffect(() => {
    if (!isHydrated) return

    async function load() {
      try {
        const supabase = createClient()

        if (fittingRoomIds.length > 0) {
          const { data } = await supabase
            .from('dresses')
            .select('*')
            .in('id', fittingRoomIds)

          const fetched = (data as Dress[]) ?? []
          if (fetched.length > 0) {
            setDresses(fetched)
            setLoading(false)
            return
          }
          // IDs from static catalog — resolve locally
          const fromStatic = (STATIC_DRESSES as unknown as Dress[]).filter((d) =>
            fittingRoomIds.includes(d.id)
          )
          if (fromStatic.length > 0) {
            setDresses(fromStatic)
            setLoading(false)
            return
          }
        }

        // No fitting room — load full catalog
        const { data } = await supabase
          .from('dresses')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(48)

        const rows = (data as Dress[]) ?? []
        setDresses(rows.length > 0 ? rows : (STATIC_DRESSES as unknown as Dress[]))
      } catch {
        setDresses(STATIC_DRESSES as unknown as Dress[])
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [isHydrated, fittingRoomIds])

  function handlePrefsNext() {
    if (!prefs.occasion) {
      setPrefsError('Please select an occasion.')
      return
    }
    setPrefsError('')
    onNext('', prefs)
  }

  function handleSkip() {
    onNext('', undefined)
  }

  if (!isHydrated || loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => <Skeleton key={i} minHeight="min-h-20" />)}
      </div>
    )
  }

  return (
    <motion.div
      initial={shouldReduce ? {} : { opacity: 0, x: 12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className="space-y-6"
    >
      {/* Mode toggle */}
      <div className="flex gap-2 p-1 bg-white/5 border border-white/10 rounded-xl">
        <button
          onClick={() => setMode('choose')}
          className={[
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
            mode === 'choose'
              ? 'bg-gold/20 text-gold border border-gold/30'
              : 'text-platinum/60 hover:text-ivory',
          ].join(' ')}
        >
          I have a dress in mind
        </button>
        <button
          onClick={() => setMode('preferences')}
          className={[
            'flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors',
            mode === 'preferences'
              ? 'bg-gold/20 text-gold border border-gold/30'
              : 'text-platinum/60 hover:text-ivory',
          ].join(' ')}
        >
          Help me find one
        </button>
      </div>

      {/* ── Mode A: choose a specific dress ── */}
      {mode === 'choose' && (
        <div className="space-y-4">
          <p className="text-sm text-platinum/70">
            {fittingRoomIds.length > 0
              ? 'Select the dress from your fitting room, or browse below.'
              : 'Select a dress from our catalog to book around.'}
          </p>

          {dresses.length === 0 ? (
            <div className="text-center py-8 space-y-2">
              <Shirt size={32} className="text-platinum/20 mx-auto" />
              <p className="text-platinum/50 text-sm">No dresses loaded.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
              {dresses.map((dress, idx) => {
                const isSelected = selected === dress.id
                const imgSrc = getPrimaryImage(dress)
                return (
                  <motion.button
                    key={dress.id}
                    initial={shouldReduce ? {} : { opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ ...SPRING_STANDARD, delay: Math.min(idx * 0.04, 0.3) }}
                    onClick={() => setSelected(dress.id)}
                    className={[
                      'w-full flex items-center gap-4 p-4 rounded-xl border-2 text-left transition-colors',
                      isSelected
                        ? 'border-gold bg-gold/10'
                        : 'border-white/10 glass-light hover:border-white/20',
                    ].join(' ')}
                    aria-pressed={isSelected}
                  >
                    {imgSrc && (
                      <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 bg-white/5">
                        <Image src={imgSrc} alt={dress.name} width={56} height={56}
                          className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-ivory font-medium truncate">{dress.name}</p>
                      {dress.designer && <p className="text-sm text-platinum/60 truncate">{dress.designer}</p>}
                      {dress.style_number && <p className="text-xs text-platinum/40">Style #{dress.style_number}</p>}
                    </div>
                    {isSelected && <Check size={18} className="text-gold shrink-0" />}
                  </motion.button>
                )
              })}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              variant="ghost"
              className="flex-1 text-platinum/50 hover:text-platinum text-sm"
              onClick={handleSkip}
            >
              Skip — decide in store
            </Button>
            <Button
              variant="primary"
              className="flex-1"
              disabled={!selected}
              onClick={() => selected && onNext(selected)}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {/* ── Mode B: dress preferences form ── */}
      {mode === 'preferences' && (
        <div className="space-y-5">
          <p className="text-sm text-platinum/70">
            Tell us what you&apos;re looking for and our stylists will have options ready when you arrive.
          </p>

          <div className="space-y-4">
            <SelectField
              label="Occasion"
              value={prefs.occasion}
              onChange={(v) => { setPrefs((p) => ({ ...p, occasion: v })); setPrefsError('') }}
              options={OCCASIONS}
              required
            />
            <SelectField
              label="Dress length"
              value={prefs.length}
              onChange={(v) => setPrefs((p) => ({ ...p, length: v }))}
              options={LENGTHS}
            />
            <SelectField
              label="Color preference"
              value={prefs.color}
              onChange={(v) => setPrefs((p) => ({ ...p, color: v }))}
              options={COLORS}
            />
            <SelectField
              label="Style / silhouette"
              value={prefs.style}
              onChange={(v) => setPrefs((p) => ({ ...p, style: v }))}
              options={STYLES}
            />
            <SelectField
              label="Preferred appointment time"
              value={prefs.timeOfDay}
              onChange={(v) => setPrefs((p) => ({ ...p, timeOfDay: v }))}
              options={TIMES_OF_DAY}
            />
            <SelectField
              label="Time of year / season"
              value={prefs.season}
              onChange={(v) => setPrefs((p) => ({ ...p, season: v }))}
              options={SEASONS}
            />

            <div className="space-y-1.5">
              <label className="text-sm text-platinum">Anything else? (optional)</label>
              <textarea
                value={prefs.additionalNotes}
                onChange={(e) => setPrefs((p) => ({ ...p, additionalNotes: e.target.value }))}
                rows={3}
                placeholder="Budget, size range, inspirations, things to avoid…"
                className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-3 text-sm text-ivory placeholder:text-white/30 focus:outline-none focus:border-gold/50 resize-none"
              />
            </div>
          </div>

          {prefsError && (
            <p className="text-sm text-red-400">{prefsError}</p>
          )}

          <div className="flex gap-3">
            <Button
              variant="ghost"
              className="flex-1 text-platinum/50 hover:text-platinum text-sm"
              onClick={handleSkip}
            >
              Skip — decide in store
            </Button>
            <Button variant="primary" className="flex-1" onClick={handlePrefsNext}>
              Continue
            </Button>
          </div>
        </div>
      )}
    </motion.div>
  )
}
