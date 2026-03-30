import type { Metadata } from 'next'
import { SignupForm } from '@/components/auth/SignupForm'

export const metadata: Metadata = {
  title: 'Create Account | Top 10 Prom',
  description: 'Create your Top 10 Prom account.',
}

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function SignupPage({ searchParams }: Props) {
  const { next } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ivory">Create account</h1>
          <p className="text-platinum text-sm">
            Join Top 10 Prom to save dresses and book appointments
          </p>
        </div>
        <div className="glass-light rounded-2xl p-6">
          <SignupForm {...(next !== undefined && { redirectTo: next })} />
        </div>
      </div>
    </div>
  )
}
