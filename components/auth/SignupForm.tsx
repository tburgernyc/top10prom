'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { CheckCircle } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { signupAction, type AuthFormState } from '@/lib/actions/auth'

interface SignupFormProps {
  redirectTo?: string | undefined
}

const initialState: AuthFormState = { status: 'idle', message: '' }

export function SignupForm({ redirectTo }: SignupFormProps) {
  const [state, formAction, isPending] = useActionState(signupAction, initialState)

  if (state.status === 'success') {
    return (
      <div className="space-y-4 text-center">
        <div className="flex justify-center">
          <div className="w-16 h-16 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center">
            <CheckCircle size={32} className="text-gold" />
          </div>
        </div>
        <p className="text-ivory font-semibold">{state.message}</p>
        <Link
          href={redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : '/login'}
          className="block text-sm text-gold hover:underline"
        >
          Back to sign in
        </Link>
      </div>
    )
  }

  return (
    <form action={formAction} className="space-y-4">
      <Input
        label="Full name"
        name="full_name"
        type="text"
        autoComplete="name"
        required
        error={state.fieldErrors?.full_name}
      />

      <Input
        label="Email address"
        name="email"
        type="email"
        autoComplete="email"
        required
        error={state.fieldErrors?.email}
      />

      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="new-password"
        required
        hint="At least 8 characters"
        error={state.fieldErrors?.password}
      />

      <Input
        label="Confirm password"
        name="confirm_password"
        type="password"
        autoComplete="new-password"
        required
        error={state.fieldErrors?.confirm_password}
      />

      {state.status === 'error' && !state.fieldErrors && (
        <p className="text-sm text-rose-400">{state.message}</p>
      )}

      <Button
        type="submit"
        variant="primary"
        className="w-full"
        loading={isPending}
        disabled={isPending}
      >
        Create Account
      </Button>

      <p className="text-center text-sm text-platinum">
        Already have an account?{' '}
        <Link
          href={redirectTo ? `/login?next=${encodeURIComponent(redirectTo)}` : '/login'}
          className="text-gold hover:underline"
        >
          Sign in
        </Link>
      </p>
    </form>
  )
}
