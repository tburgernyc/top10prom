import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = { title: 'Unauthorized' }

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center space-y-4 max-w-md">
        <div className="text-6xl">🔒</div>
        <h1 className="text-3xl font-bold text-ivory">Access Denied</h1>
        <p className="text-platinum">
          You don&apos;t have permission to access this page.
        </p>
        <Link
          href="/"
          className="inline-block mt-4 px-6 py-3 bg-gold text-onyx font-semibold rounded-xl hover:brightness-110 transition-all"
        >
          Go Home
        </Link>
      </div>
    </div>
  )
}
