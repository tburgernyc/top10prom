'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionState } from '@/types/index'

export type WalkInState = ActionState<{ customerId: string }>

export async function registerWalkInCustomer(
  _prev: WalkInState,
  formData: FormData
): Promise<WalkInState> {
  const supabase = await createClient()

  // 1. Authenticate — JWT claims are the source of truth for store identity
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return { status: 'error', message: 'Unauthorized. Please log in again.' }
  }

  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) {
    return { status: 'error', message: 'No active store assignment found for your account.' }
  }

  // 2. Extract and validate form data
  const firstName = (formData.get('firstName') as string)?.trim()
  const lastName = (formData.get('lastName') as string)?.trim()
  const phone = (formData.get('phone') as string) || null
  const email = (formData.get('email') as string) || null
  const notes = (formData.get('notes') as string) || null

  if (!firstName || !lastName) {
    return {
      status: 'error',
      message: 'First and last name are required.',
      fieldErrors: {
        firstName: !firstName ? 'Required' : undefined,
        lastName: !lastName ? 'Required' : undefined,
      },
    }
  }

  // 3. Insert into the localized CRM table (store_customers)
  // Both writes must succeed — if the customer insert fails, no appointment is created.
  const { data: customer, error: customerError } = await supabase
    .from('store_customers')
    .insert({
      store_id: storeId,
      first_name: firstName,
      last_name: lastName,
      phone,
      email,
      notes,
    })
    .select('id')
    .single()

  if (customerError || !customer) {
    console.error('[Staff] Customer creation failed:', customerError)
    return { status: 'error', message: 'Failed to create customer record.' }
  }

  // 4. Auto-create a WALK_IN / IN_PROGRESS appointment for floor tracking
  const { error: apptError } = await supabase.from('appointments').insert({
    store_id: storeId,
    store_customer_id: customer.id,
    created_by_staff_id: user.id,
    appointment_type: 'WALK_IN' as const,
    status: 'IN_PROGRESS' as const,
    appointment_date: new Date().toISOString(),
    notes,
  })

  if (apptError) {
    // Non-fatal — customer was created; log the appointment failure
    console.error('[Staff] Walk-in appointment creation failed:', apptError)
  }

  // Refresh the floor hub to show the new walk-in
  revalidatePath('/saas/staff')

  return {
    status: 'success',
    message: `${firstName} ${lastName} checked in successfully.`,
    data: { customerId: customer.id },
  }
}
