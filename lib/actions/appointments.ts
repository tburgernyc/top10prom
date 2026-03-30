'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionState } from '@/types/index'

export type AppointmentUpdateState = ActionState

export async function updateAppointmentStatus(
  _prev: AppointmentUpdateState,
  formData: FormData
): Promise<AppointmentUpdateState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'error', message: 'Unauthorized' }

  // JWT claims are the source of truth — never trust formData for store scoping
  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) return { status: 'error', message: 'No active store assignment' }

  const appointmentId = formData.get('appointmentId') as string
  const status = formData.get('status') as
    | 'SCHEDULED'
    | 'IN_PROGRESS'
    | 'COMPLETED'
    | 'NO_SHOW'
    | 'CANCELLED'
  const salesFeedback = (formData.get('salesFeedback') as string) || null

  if (!appointmentId || !status) {
    return { status: 'error', message: 'Appointment ID and status are required.' }
  }

  // Double guard: JWT claim check above + RLS policy on the table.
  // The .eq('store_id', storeId) is an explicit defense-in-depth check.
  const { error } = await supabase
    .from('appointments')
    .update({
      status,
      sales_feedback: salesFeedback,
      updated_by_staff_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq('id', appointmentId)
    .eq('store_id', storeId)

  if (error) {
    console.error('[Appointments] Update failed:', error)
    return { status: 'error', message: 'Failed to update appointment.' }
  }

  revalidatePath('/saas/staff/calendar')
  revalidatePath('/saas/staff')

  return { status: 'success', message: 'Appointment updated.' }
}
