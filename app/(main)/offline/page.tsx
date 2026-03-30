import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'You\'re Offline | Top 10 Prom',
}

export default function OfflinePage() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-6 max-w-sm">
        <div className="w-20 h-20 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gold"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3 3l18 18M8.111 8.111A5.985 5.985 0 006 12c0 1.655.67 3.152 1.757 4.243M12 6a6 6 0 015.905 5H19a3 3 0 010 6h-1M3 12a9 9 0 012.636-6.364M12 3a9 9 0 016.364 2.636"
            />
          </svg>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-ivory">
            You&apos;re offline
          </h1>
          <p className="text-platinum text-sm leading-relaxed">
            It looks like you&apos;ve lost your connection. Check your Wi-Fi or
            mobile data, then try again.
          </p>
        </div>

        <Link
          href="/home"
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-gold text-onyx font-semibold text-sm hover:opacity-90 transition-opacity"
        >
          Try again
        </Link>
      </div>
    </main>
  )
}
