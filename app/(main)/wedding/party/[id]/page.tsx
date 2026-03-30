import type { Metadata } from 'next'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { BridalParty, BridalPartyMember } from '@/types/index'
import { BridalPartyManager } from '@/components/wedding/BridalPartyManager'

export const metadata: Metadata = { title: 'Manage Bridal Party | Top 10 Prom' }

type Props = { params: Promise<{ id: string }> }

export default async function BridalPartyPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/login?next=/wedding/party/${id}`)

  const { data: party } = await supabase
    .from('bridal_parties')
    .select('*')
    .eq('id', id)
    .eq('bride_id', user.id)
    .single()

  if (!party) notFound()

  const { data: memberRows } = await supabase
    .from('bridal_party_members')
    .select('*')
    .eq('party_id', id)
    .order('created_at', { ascending: true })

  const members = (memberRows ?? []) as BridalPartyMember[]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <BridalPartyManager
          party={party as BridalParty}
          members={members}
        />
      </div>
    </main>
  )
}
