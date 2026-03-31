'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2, Mail, Lock, Chrome, Apple } from 'lucide-react'
import Input from '@/components/ui/Input'
import { loginAction, type AuthFormState } from '@/lib/actions/auth'

interface LoginFormProps {
  redirectTo?: string | undefined
  /** true = Partner Portal (B2B/SaaS) — hides social logins, adjusts copy */
  isSaasMode?: boolean | undefined
}

const initialState: AuthFormState = { status: 'idle', message: '' }

export function LoginForm({ redirectTo, isSaasMode = false }: LoginFormProps) {
  const [state, formAction, isPending] = useActionState(loginAction, initialState)

  return (
    <div className="space-y-6">
      {/* Header copy */}
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-ivory">
          {isSaasMode ? 'Partner Portal' : 'Welcome back'}
        </h2>
        <p className="text-sm text-platinum">
          {isSaasMode
            ? 'Sign in with your authorized business credentials'
            : 'Sign in to your account to continue'}
        </p>
      </div>

      {/* ── Email / password form ───────────────────────────────────────── */}
      <form action={formAction} className="space-y-4" noValidate>
        {redirectTo && (
          <input type="hidden" name="redirect" value={redirectTo} />
        )}

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="you@example.com"
          error={state.fieldErrors?.email}
        />

        <div className="space-y-1.5">
          <Input
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
            placeholder="••••••••"
            error={state.fieldErrors?.password}
          />
          {!isSaasMode && (
            <div className="flex justify-end">
              <Link
                href="/forgot-password"
                className="text-xs text-platinum hover:text-gold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        {/* Server-level error (non-field) */}
        {state.status === 'error' && !state.fieldErrors && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-400"
          >
            <span className="mt-0.5 shrink-0" aria-hidden="true">⚠</span>
            {state.message}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isPending}
          className={[
            'relative w-full flex items-center justify-center gap-2',
            'px-5 py-3 rounded-xl text-sm font-semibold',
            'bg-gold text-onyx',
            'hover:brightness-110 active:brightness-95',
            'disabled:opacity-60 disabled:cursor-not-allowed',
            'transition-all duration-150',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx',
          ].join(' ')}
          aria-busy={isPending}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" aria-hidden="true" />
              <span>Signing in…</span>
            </>
          ) : (
            <span>{isSaasMode ? 'Sign In to Portal' : 'Sign In'}</span>
          )}
        </button>
      </form>

      {/* ── Social logins — B2C only ────────────────────────────────────── */}
      {!isSaasMode && (
        <>
          <div className="relative flex items-center gap-4" aria-hidden="true">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs text-white/30 font-medium uppercase tracking-widest">or</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Google */}
            <button
              type="button"
              aria-label="Continue with Google"
              className={[
                'flex items-center justify-center gap-2',
                'px-4 py-2.5 rounded-xl text-sm font-medium',
                'bg-white/5 border border-white/10 text-ivory',
                'hover:bg-white/10 hover:border-white/20 active:bg-white/[0.07]',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              ].join(' ')}
            >
              <Chrome size={16} className="text-[#4285F4]" aria-hidden="true" />
              Google
            </button>

            {/* Apple */}
            <button
              type="button"
              aria-label="Continue with Apple"
              className={[
                'flex items-center justify-center gap-2',
                'px-4 py-2.5 rounded-xl text-sm font-medium',
                'bg-white/5 border border-white/10 text-ivory',
                'hover:bg-white/10 hover:border-white/20 active:bg-white/[0.07]',
                'transition-all duration-150',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
              ].join(' ')}
            >
              <Apple size={16} aria-hidden="true" />
              Apple
            </button>
          </div>
        </>
      )}

      {/* ── Footer links ─────────────────────────────────────────────────── */}
      {!isSaasMode && (
        <p className="text-center text-sm text-platinum">
          Don&apos;t have an account?{' '}
          <Link
            href={redirectTo ? `/signup?next=${encodeURIComponent(redirectTo)}` : '/signup'}
            className="text-gold hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
          >
            Sign up free
          </Link>
        </p>
      )}

      {/* Security notice — SaaS only */}
      {isSaasMode && (
        <p className="flex items-center justify-center gap-1.5 text-xs text-white/30">
          <Lock size={11} aria-hidden="true" />
          Secured · TLS 1.3 · Session expires after 8 hours
        </p>
      )}
    </div>
  )
}
