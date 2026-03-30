'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/browser'

interface CrossLocationBadgeProps {
  dressId: string
  activeBoutiqueId?: string
}

interface BoutiqueName {
  id: string
  name: string
}

export function CrossLocationBadge({ dressId, activeBoutiqueId }: CrossLocationBadgeProps) {
  const [names, setNames] = useState<BoutiqueName[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function fetchLocations() {
      setLoading(true)
      const supabase = createClient()

      // Query 1: get boutique_ids that carry this dress (excluding active boutique)
      let inventoryQuery = supabase
        .from('dress_inventory')
        .select('boutique_id')
        .eq('dress_id', dressId)
        .eq('is_active', true)
        .gt('quantity', 0)

      if (activeBoutiqueId) {
        inventoryQuery = inventoryQuery.neq('boutique_id', activeBoutiqueId)
      }

      const { data: inventory } = await inventoryQuery

      if (cancelled) return

      const boutiqueIds = (inventory ?? []).map((row) => row.boutique_id)

      if (boutiqueIds.length === 0) {
        setNames([])
        setLoading(false)
        return
      }

      // Query 2: get boutique names
      const { data: boutiques } = await supabase
        .from('boutiques')
        .select('id, name')
        .in('id', boutiqueIds)
        .eq('is_active', true)

      if (!cancelled) {
        setNames((boutiques ?? []) as BoutiqueName[])
        setLoading(false)
      }
    }

    void fetchLocations()

    return () => {
      cancelled = true
    }
  }, [dressId, activeBoutiqueId])

  if (loading || names.length === 0) return null

  return (
    <div className="mt-2">
      <span className="inline-flex items-center gap-1.5 text-xs text-gold glass-light rounded-full px-3 py-1">
        <span className="font-semibold">{names.length}</span>
        {names.length === 1 ? ' other location' : ' other locations'}
      </span>
    </div>
  )
}
