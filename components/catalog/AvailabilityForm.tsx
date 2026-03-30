'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import Badge from '@/components/ui/Badge'

interface StockEntry {
  boutiqueId: string
  boutiqueName: string
  boutiqueCity: string | null
  boutiqueSlug: string | null
  quantity: number
}

interface AvailabilityFormProps {
  dressId: string
}

export default function AvailabilityForm({ dressId }: AvailabilityFormProps) {
  const [entries, setEntries] = useState<StockEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchAvailability() {
      const supabase = createClient()

      // Step 1: get boutique_ids that carry this dress
      const { data: inv } = await supabase
        .from('dress_inventory')
        .select('boutique_id, quantity')
        .eq('dress_id', dressId)
        .eq('is_active', true)
        .gt('quantity', 0)

      if (!inv?.length || cancelled) {
        if (!cancelled) setLoading(false)
        return
      }

      const boutiqueIds = inv.map((r) => r.boutique_id)

      // Step 2: get boutique details
      const { data: boutiques } = await supabase
        .from('boutiques')
        .select('id, name, city, slug')
        .in('id', boutiqueIds)
        .eq('is_active', true)

      if (cancelled) return

      const result: StockEntry[] = (boutiques ?? []).map((b) => {
        const invRow = inv.find((r) => r.boutique_id === b.id)
        return {
          boutiqueId: b.id,
          boutiqueName: b.name,
          boutiqueCity: b.city,
          boutiqueSlug: b.slug,
          quantity: invRow?.quantity ?? 0,
        }
      })

      setEntries(result)
      setLoading(false)
    }

    void fetchAvailability()

    return () => {
      cancelled = true
    }
  }, [dressId])

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-4 w-32 skeleton-shimmer rounded" />
        <div className="h-10 w-full skeleton-shimmer rounded-xl" />
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <p className="text-xs text-platinum/50">
        Availability information is currently unavailable. Contact your local boutique.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-semibold text-ivory flex items-center gap-2">
        <MapPin size={14} className="text-gold" aria-hidden="true" />
        Available At
      </h3>
      <ul className="space-y-2">
        {entries.map((entry) => (
          <li
            key={entry.boutiqueId}
            className="flex items-center justify-between gap-3 glass-light rounded-xl px-4 py-3"
          >
            <div>
              <p className="text-sm font-medium text-ivory">{entry.boutiqueName}</p>
              {entry.boutiqueCity && (
                <p className="text-xs text-platinum/60">{entry.boutiqueCity}</p>
              )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Badge variant="success">
                In stock
              </Badge>
              <Link
                href={`/book?boutique=${entry.boutiqueSlug ?? entry.boutiqueId}`}
                className="text-xs font-semibold text-gold hover:text-gold/80 transition-colors"
              >
                Book here →
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
