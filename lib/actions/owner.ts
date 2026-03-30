'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { sendStaffInviteEmail } from '@/lib/email'
import { updateBoutiqueSettingsSchema } from '@/lib/schemas'
import type { ActionState, Boutique } from '@/types/index'

export type OwnerActionState = ActionState

export async function inviteStaffMember(
  _prev: OwnerActionState,
  formData: FormData
): Promise<OwnerActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'error', message: 'Unauthorized' }

  // Verify caller has OWNER or SUPER_ADMIN role from JWT — no DB call needed
  const storeId = user.app_metadata?.store_id as string | undefined
  const storeRole = user.app_metadata?.store_role as string | undefined
  const systemRole = user.app_metadata?.system_role as string | undefined

  if (!storeId || (storeRole !== 'OWNER' && systemRole !== 'SUPER_ADMIN')) {
    return { status: 'error', message: 'You do not have permission to manage staff.' }
  }

  const email = (formData.get('email') as string)?.trim().toLowerCase()
  const role = formData.get('role') as string

  if (!email || !role) {
    return { status: 'error', message: 'Email and role are required.' }
  }

  if (!['MANAGER', 'ASSOCIATE'].includes(role)) {
    return { status: 'error', message: 'Invalid role selected.' }
  }

  // Look up the invited user by email in profiles
  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, email')
    .eq('email', email)
    .maybeSingle()

  if (!profile) {
    return {
      status: 'error',
      message: `No account found for ${email}. They must sign up on the app first before being added as staff.`,
    }
  }

  const { error } = await supabase.from('store_staff').insert({
    user_id: profile.id,
    store_id: storeId,
    role: role as 'MANAGER' | 'ASSOCIATE',
    is_active: true,
  })

  if (error) {
    // Handle duplicate staff member (Postgres unique constraint violation)
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'This person is already a staff member at your store.',
      }
    }
    console.error('[Owner] Invite staff failed:', error)
    return { status: 'error', message: 'Failed to add staff member.' }
  }

  // Send staff invite email (non-fatal)
  const { data: boutiqueData } = await supabase
    .from('boutiques')
    .select('name')
    .eq('id', storeId)
    .single()
  const boutiqueName = (boutiqueData as Pick<Boutique, 'name'> | null)?.name ?? 'our boutique'
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://top10prom.com'

  await sendStaffInviteEmail({
    inviteeEmail: email,
    boutiqueName,
    role,
    inviteLink: `${appUrl}/login`,
  })

  revalidatePath('/saas/owner/staff')
  return { status: 'success', message: `${profile.full_name ?? email} added to your team.` }
}

export async function updateBoutiqueSettings(
  _prev: OwnerActionState,
  formData: FormData
): Promise<OwnerActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'error', message: 'Unauthorized' }

  const storeId = user.app_metadata?.store_id as string | undefined
  const storeRole = user.app_metadata?.store_role as string | undefined
  const systemRole = user.app_metadata?.system_role as string | undefined

  if (!storeId || (storeRole !== 'OWNER' && systemRole !== 'SUPER_ADMIN')) {
    return { status: 'error', message: 'Unauthorized' }
  }

  const raw = {
    boutique_id: storeId,
    booking_lead_time_hours: Number(formData.get('booking_lead_time_hours')),
    max_daily_appointments: Number(formData.get('max_daily_appointments')),
    appointment_duration_minutes: Number(formData.get('appointment_duration_minutes')),
    auto_confirm_bookings: formData.get('auto_confirm_bookings') === 'true',
    notification_email: (formData.get('notification_email') as string) || '',
  }

  const parsed = updateBoutiqueSettingsSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      const first = msgs?.[0]
      if (first) fieldErrors[key] = first
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  // Double guard: JWT storeId + .eq('boutique_id', storeId)
  const { error } = await supabase
    .from('boutique_settings')
    .upsert({
      boutique_id: storeId,
      booking_lead_time_hours: parsed.data.booking_lead_time_hours,
      max_daily_appointments: parsed.data.max_daily_appointments,
      appointment_duration_minutes: parsed.data.appointment_duration_minutes,
      auto_confirm_bookings: parsed.data.auto_confirm_bookings,
      notification_email: parsed.data.notification_email || null,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'boutique_id' })

  if (error) {
    console.error('[Owner] updateBoutiqueSettings failed:', error)
    return { status: 'error', message: 'Failed to save settings.' }
  }

  revalidatePath('/saas/owner/settings')
  return { status: 'success', message: 'Settings saved successfully.' }
}

export async function setStaffActiveStatus(
  staffId: string,
  isActive: boolean
): Promise<OwnerActionState> {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { status: 'error', message: 'Unauthorized' }

  const storeId = user.app_metadata?.store_id as string | undefined
  const storeRole = user.app_metadata?.store_role as string | undefined
  const systemRole = user.app_metadata?.system_role as string | undefined

  if (!storeId || (storeRole !== 'OWNER' && systemRole !== 'SUPER_ADMIN')) {
    return { status: 'error', message: 'Unauthorized' }
  }

  // Double guard: JWT check above + .eq('store_id', storeId) below
  const { error } = await supabase
    .from('store_staff')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', staffId)
    .eq('store_id', storeId)

  if (error) {
    return { status: 'error', message: 'Failed to update staff status.' }
  }

  revalidatePath('/saas/owner/staff')
  return {
    status: 'success',
    message: isActive ? 'Staff member reactivated.' : 'Staff member deactivated.',
  }
}
