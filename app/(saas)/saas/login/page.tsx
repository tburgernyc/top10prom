import type { Metadata } from 'next'
import Link from 'next/link'
import { Shield, Lock } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Partner Portal | Top 10 Prom',
  description: 'Authorized partner sign-in for Top 10 Prom boutique staff and owners.',
  robots: { index: false, follow: false },
}

export default function SaasLoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16 bg-onyx">

      {/* Ambient glow */}
      <div
        className="pointer-events-none fixed inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/4 -translate-x-1/2 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />
      </div>

      {/* Back to main site */}
      <div className="mb-8 w-full max-w-md">
        <Link
          href="/"
          className="text-sm text-platinum hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
        >
          ← Back to Top 10 Prom
        </Link>
      </div>

      {/* Card */}
      <div className="relative w-full max-w-md">
        {/* Top border accent */}
        <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 backdrop-blur-sm shadow-2xl shadow-black/40">

          {/* Brand + security badge */}
          <div className="mb-8 text-center space-y-3">
            <div className="inline-flex items-center justify-center h-14 w-14 rounded-2xl border border-gold/20 bg-gold/10 mx-auto">
              <Shield size={24} className="text-gold" aria-hidden="true" />
            </div>
            <div>
              <p className="text-xs font-semibold text-gold uppercase tracking-widest mb-1">
                Top 10 Prom
              </p>
              <h1 className="text-2xl font-bold text-ivory">Partner Portal</h1>
            </div>
          </div>

          {/* Security indicator strip */}
          <div className="mb-6 flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-3 py-2">
            <Lock size={12} className="text-emerald-400 shrink-0" aria-hidden="true" />
            <p className="text-xs text-emerald-400 font-medium">
              Secure connection · Access restricted to authorized partners
            </p>
          </div>

          {/* Login form — SaaS mode */}
          <LoginForm isSaasMode={true} />
        </div>

        {/* Bottom border accent */}
        <div className="absolute inset-x-0 -bottom-px h-px bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      {/* Footer */}
      <footer className="mt-10 w-full max-w-md text-center space-y-3">
        <p className="text-xs text-white/25 leading-relaxed">
          This portal is restricted to authorized boutique owners, managers, and associates.
          Unauthorized access attempts are logged and may be reported to law enforcement.
        </p>
        <p className="text-xs text-white/20">
          Not a partner?{' '}
          <Link
            href="/login"
            className="text-white/35 hover:text-platinum transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
          >
            Sign in as a customer instead
          </Link>
        </p>
      </footer>
    </div>
  )
}
