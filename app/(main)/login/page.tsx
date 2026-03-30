import type { Metadata } from 'next'
import { LoginForm } from '@/components/auth/LoginForm'

export const metadata: Metadata = {
  title: 'Sign In | Top 10 Prom',
  description: 'Sign in to your Top 10 Prom account.',
}

type Props = {
  searchParams: Promise<{ next?: string }>
}

export default async function LoginPage({ searchParams }: Props) {
  const { next } = await searchParams

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-ivory">Welcome back</h1>
          <p className="text-platinum text-sm">Sign in to your account</p>
        </div>
        <div className="glass-light rounded-2xl p-6">
          <LoginForm {...(next !== undefined && { redirectTo: next })} />
        </div>
      </div>
    </div>
  )
}
