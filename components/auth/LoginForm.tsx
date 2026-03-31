'use client'

import { useActionState } from 'react'
import Link from 'next/link'
import { Loader2, Lock } from 'lucide-react'

// Brand SVGs — lucide-react v1.x has no brand icons
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  )
}

function AppleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.53 3.96zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
    </svg>
  )
}
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
              <GoogleIcon />
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
              <AppleIcon />
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
