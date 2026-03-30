'use client'

import { useTransition } from 'react'
import { setStaffActiveStatus } from '@/lib/actions/owner'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import type { StoreStaff } from '@/types/index'

interface StaffRowProps {
  staff: StoreStaff & {
    profiles: { full_name: string | null; email: string | null } | null
  }
}

const ROLE_LABEL: Record<StoreStaff['role'], string> = {
  OWNER:     'Owner',
  MANAGER:   'Manager',
  ASSOCIATE: 'Associate',
}

export function StaffRow({ staff }: StaffRowProps) {
  const [isPending, startTransition] = useTransition()
  const name = staff.profiles?.full_name ?? staff.profiles?.email ?? 'Unknown'
  const email = staff.profiles?.email ?? ''

  function toggleStatus() {
    startTransition(async () => {
      await setStaffActiveStatus(staff.id, !staff.is_active)
    })
  }

  return (
    <li className="glass-light rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center shrink-0">
          <span className="text-gold text-sm font-bold">
            {name.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-sm font-medium text-ivory truncate">{name}</p>
          <p className="text-xs text-platinum truncate">{email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={staff.role === 'OWNER' ? 'gold' : 'neutral'}>
          {ROLE_LABEL[staff.role]}
        </Badge>
        {staff.role !== 'OWNER' && (
          <Button
            type="button"
            variant={staff.is_active ? 'danger' : 'secondary'}
            size="sm"
            loading={isPending}
            disabled={isPending}
            onClick={toggleStatus}
          >
            {staff.is_active ? 'Deactivate' : 'Reactivate'}
          </Button>
        )}
      </div>
    </li>
  )
}
