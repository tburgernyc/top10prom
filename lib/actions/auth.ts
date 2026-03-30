'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { loginSchema, signupSchema } from '@/lib/schemas'
import type { ActionState } from '@/types/index'

export type AuthFormState = ActionState

export async function loginAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const parsed = loginSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [key, msgs] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      const first = msgs?.[0]
      if (first) fieldErrors[key] = first
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword(parsed.data)

  if (error) {
    return { status: 'error', message: error.message }
  }

  // Read role from JWT claims (injected by custom_access_token_hook — no DB call)
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const systemRole = user?.app_metadata?.system_role as string | undefined
  const storeRole = user?.app_metadata?.store_role as string | undefined

  // Tier-aware redirect
  if (systemRole === 'SUPER_ADMIN') {
    redirect('/saas/admin')
  } else if (storeRole === 'OWNER') {
    redirect('/saas/owner')
  } else if (storeRole === 'MANAGER' || storeRole === 'ASSOCIATE') {
    redirect('/saas/staff')
  }

  // Customer: honour the redirect param or fall back to profile.
  // Only allow relative paths starting with / to prevent open-redirect attacks.
  const redirectParam = formData.get('redirect') as string | null
  const redirectTo = redirectParam && /^\/[^/\\]/.test(redirectParam) ? redirectParam : '/profile'
  redirect(redirectTo)
}

export async function signupAction(
  _prev: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const raw = {
    full_name: formData.get('full_name') as string,
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    confirm_password: formData.get('confirm_password') as string,
  }

  const parsed = signupSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [key, msgs] of Object.entries(
      parsed.error.flatten().fieldErrors
    )) {
      const first = msgs?.[0]
      if (first) fieldErrors[key] = first
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { full_name: parsed.data.full_name },
    },
  })

  if (error) {
    return { status: 'error', message: error.message }
  }

  return {
    status: 'success',
    message: 'Account created! Check your email to confirm your address.',
  }
}

export async function logoutAction(): Promise<never> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
