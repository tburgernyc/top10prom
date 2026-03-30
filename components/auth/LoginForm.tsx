'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { loginAction, type AuthFormState } from '@/lib/actions/auth'

interface LoginFormProps {
  redirectTo?: string | undefined
}

const initialState: AuthFormState = { status: 'idle', message: '' }

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <form action={formAction} className="space-y-4">
      {redirectTo && (
        <input type="hidden" name="redirect" value={redirectTo} />
      )}

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
        autoComplete="current-password"
        required
        error={state.fieldErrors?.password}
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
        Sign In
      </Button>

      <p className="text-center text-sm text-platinum">
        Don&apos;t have an account?{' '}
        <Link
          href={redirectTo ? `/signup?next=${encodeURIComponent(redirectTo)}` : '/signup'}
          className="text-gold hover:underline"
        >
          Sign up
        </Link>
      </p>
    </form>
  )
}
