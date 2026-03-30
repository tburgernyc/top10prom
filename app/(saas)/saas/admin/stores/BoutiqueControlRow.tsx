'use client'

import { useTransition } from 'react'
import { setBoutiqueActiveStatus, setBoutiqueSubscriptionStatus } from '@/lib/actions/admin'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { Boutique } from '@/types/index'

type StoreRow = Pick<
  Boutique,
  'id' | 'name' | 'slug' | 'city' | 'state' | 'is_active' | 'subscription_status'
>

interface BoutiqueControlRowProps {
  store: StoreRow
}

const SUB_VARIANT: Record<
  Boutique['subscription_status'],
  'success' | 'warning' | 'danger'
> = {
  ACTIVE:     'success',
  PAST_DUE:   'warning',
  CANCELLED:  'danger',
}

const NEXT_SUB_STATUS: Record<Boutique['subscription_status'], Boutique['subscription_status']> = {
  ACTIVE:    'PAST_DUE',
  PAST_DUE:  'CANCELLED',
  CANCELLED: 'ACTIVE',
}

export function BoutiqueControlRow({ store }: BoutiqueControlRowProps) {
  const [isPending, startTransition] = useTransition()

  function toggleActive() {
    startTransition(async () => {
      await setBoutiqueActiveStatus(store.id, !store.is_active)
    })
  }

  function cycleSubscription() {
    startTransition(async () => {
      await setBoutiqueSubscriptionStatus(store.id, NEXT_SUB_STATUS[store.subscription_status])
    })
  }

  return (
    <li className="glass-light rounded-xl px-4 py-3 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ivory truncate">{store.name}</p>
          <p className="text-xs text-platinum">
            {[store.city, store.state].filter(Boolean).join(', ')}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge variant={store.is_active ? 'success' : 'danger'}>
            {store.is_active ? 'Active' : 'Inactive'}
          </Badge>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <button
          type="button"
          onClick={cycleSubscription}
          disabled={isPending}
          className="text-xs px-2.5 py-1 rounded-lg border border-white/15 hover:border-white/30 transition-colors disabled:opacity-50"
        >
          <Badge variant={SUB_VARIANT[store.subscription_status]}>
            {store.subscription_status}
          </Badge>
        </button>
        <Button
          type="button"
          variant={store.is_active ? 'danger' : 'secondary'}
          size="sm"
          loading={isPending}
          disabled={isPending}
          onClick={toggleActive}
        >
          {store.is_active ? 'Deactivate' : 'Activate'}
        </Button>
      </div>
    </li>
  )
}
