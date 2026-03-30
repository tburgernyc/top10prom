import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { StoreStaff } from '@/types/index'
import Badge from '@/components/ui/Badge'
import { StaffInviteForm } from './StaffInviteForm'
import { StaffRow } from './StaffRow'

export const metadata: Metadata = { title: 'Staff Management | Owner Portal' }

interface StaffWithProfile extends StoreStaff {
  profiles: {
    full_name: string | null
    email: string | null
  } | null
}

export default async function OwnerStaffPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) redirect('/unauthorized')

  const { data: staffRows } = await supabase
    .from('store_staff')
    .select('id, user_id, store_id, role, is_active, created_at, updated_at, profiles(full_name, email)')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

  const staff = (staffRows ?? []) as StaffWithProfile[]
  const active = staff.filter((s) => s.is_active)
  const inactive = staff.filter((s) => !s.is_active)

  return (
    <div className="space-y-8 max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ivory">Staff Management</h1>
        <Badge variant="gold">{active.length} active</Badge>
      </div>

      {/* Invite form */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Invite a Team Member
        </h2>
        <div className="glass-light rounded-2xl p-5">
          <StaffInviteForm />
        </div>
      </section>

      {/* Active staff */}
      {active.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Active Staff
          </h2>
          <ul className="space-y-2">
            {active.map((s) => (
              <StaffRow key={s.id} staff={s} />
            ))}
          </ul>
        </section>
      )}

      {/* Inactive staff */}
      {inactive.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Deactivated
          </h2>
          <ul className="space-y-2">
            {inactive.map((s) => (
              <StaffRow key={s.id} staff={s} />
            ))}
          </ul>
        </section>
      )}

      {staff.length === 0 && (
        <p className="text-sm text-platinum">
          No staff members yet. Invite your first team member above.
        </p>
      )}
    </div>
  )
}
