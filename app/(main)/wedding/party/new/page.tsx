import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { BridalPartyForm } from '@/components/wedding/BridalPartyForm'

export const metadata: Metadata = {
  title: 'New Bridal Party | Top 10 Prom',
}

export default async function NewBridalPartyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/wedding/party/new')

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-ivory">Create Bridal Party</h1>
          <p className="text-sm text-platinum mt-1">
            Set up your bridal party to manage your team&apos;s dresses and appointments.
          </p>
        </div>
        <div className="glass-light rounded-2xl p-6">
          <BridalPartyForm />
        </div>
      </div>
    </main>
  )
}
