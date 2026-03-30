'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import type { ActionState, Boutique } from '@/types/index'

export type AdminActionState = ActionState

function requireSuperAdmin(systemRole: string | undefined): AdminActionState | null {
  if (systemRole !== 'SUPER_ADMIN') {
    return { status: 'error', message: 'Unauthorized' }
  }
  return null
}

export async function setBoutiqueActiveStatus(
  boutiqueId: string,
  isActive: boolean
): Promise<AdminActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'Unauthorized' }

  const authError = requireSuperAdmin(user.app_metadata?.system_role as string | undefined)
  if (authError) return authError

  const { error } = await supabase
    .from('boutiques')
    .update({ is_active: isActive, updated_at: new Date().toISOString() })
    .eq('id', boutiqueId)

  if (error) {
    console.error('[Admin] setBoutiqueActiveStatus failed:', error)
    return { status: 'error', message: 'Failed to update boutique status.' }
  }

  revalidatePath('/saas/admin/stores')
  return {
    status: 'success',
    message: isActive ? 'Boutique activated.' : 'Boutique deactivated.',
  }
}

export async function setBoutiqueSubscriptionStatus(
  boutiqueId: string,
  subscriptionStatus: Boutique['subscription_status']
): Promise<AdminActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'Unauthorized' }

  const authError = requireSuperAdmin(user.app_metadata?.system_role as string | undefined)
  if (authError) return authError

  const { error } = await supabase
    .from('boutiques')
    .update({ subscription_status: subscriptionStatus, updated_at: new Date().toISOString() })
    .eq('id', boutiqueId)

  if (error) {
    console.error('[Admin] setBoutiqueSubscriptionStatus failed:', error)
    return { status: 'error', message: 'Failed to update subscription status.' }
  }

  revalidatePath('/saas/admin/stores')
  return { status: 'success', message: 'Subscription status updated.' }
}
