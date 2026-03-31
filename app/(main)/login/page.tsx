import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Top 10 Prom',
  description: 'Sign in to your Top 10 Prom account to save dresses, manage your fitting room, and book appointments.',
}

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams

  return (
    <div className="min-h-screen flex">

      {/* ── Left panel — form ──────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-16 xl:px-24">
        {/* Back to home */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-sm font-semibold text-gold hover:text-gold/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
          >
            ← Top 10 Prom
          </Link>
        </div>

        <div className="mx-auto w-full max-w-sm">
          <LoginForm {...(next !== undefined && { redirectTo: next })} isSaasMode={false} />
        </div>

        {/* Partner portal link */}
        <p className="mt-12 mx-auto text-xs text-white/25 text-center max-w-xs">
          Are you a boutique partner?{' '}
          <Link
            href="/saas/login"
            className="text-white/40 hover:text-platinum transition-colors underline underline-offset-2 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gold rounded-sm"
          >
            Access the Partner Portal
          </Link>
        </p>
      </div>

      {/* ── Right panel — editorial image (desktop only) ───────────────────── */}
      <div
        className="hidden lg:block relative w-[52%] xl:w-[56%] overflow-hidden"
        aria-hidden="true"
      >
        <Image
          src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1600&q=85&fit=crop"
          alt=""
          fill
          className="object-cover object-center"
          priority
          sizes="(min-width: 1024px) 52vw, 0vw"
        />

        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-onyx/60 via-onyx/20 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx/70 via-transparent to-transparent" />

        {/* Editorial copy */}
        <div className="absolute bottom-12 left-10 right-10">
          <div className="mb-4 inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gold/40 bg-gold/10 text-xs font-medium text-gold">
            <span aria-hidden="true">✦</span>
            No-Duplicate Guarantee
          </div>
          <h2 className="text-4xl xl:text-5xl font-bold text-ivory leading-tight">
            Find Your{' '}
            <span className="text-gold">Perfect Dress.</span>
            <br />
            Exclusively Yours.
          </h2>
          <p className="mt-4 text-platinum text-base max-w-md leading-relaxed">
            Luxury prom and bridal gowns. Reserved just for you — guaranteed no one else at
            your event will wear the same dress.
          </p>

          {/* Social proof */}
          <div className="mt-6 flex items-center gap-4">
            <div className="flex -space-x-2">
              {['K', 'J', 'A', 'M'].map((initial) => (
                <div
                  key={initial}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-onyx bg-gold/20 text-xs font-bold text-gold"
                >
                  {initial}
                </div>
              ))}
            </div>
            <p className="text-sm text-platinum">
              <span className="text-ivory font-semibold">10,000+</span> happy customers
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
