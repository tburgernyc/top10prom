import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'
import type { Dress } from '@/types/index'
import DressCard from '@/components/catalog/DressCard'
import VoteOnDress from '@/components/social/VoteOnDress'

type FittingRoomSession = Database['public']['Tables']['fitting_room_sessions']['Row']

type Props = { params: Promise<{ token: string }> }

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Shared Fitting Room | Top 10 Prom',
    description: 'View and vote on prom dress picks',
    openGraph: {
      title: 'Prom Dress Picks | Top 10 Prom',
      description: 'Someone shared their fitting room with you. Vote on their picks!',
    },
    robots: { index: false, follow: false },
  }
}

export default async function ShareTokenPage({ params }: Props) {
  const { token } = await params
  const supabase = await createClient()

  // Fetch the session by share_token
  const { data: sessionRaw, error: sessionError } = await supabase
    .from('fitting_room_sessions')
    .select('id, dress_ids, share_token, session_token, user_id, created_at, updated_at')
    .eq('share_token', token)
    .single()

  if (sessionError || !sessionRaw) {
    notFound()
  }

  const session = sessionRaw as FittingRoomSession

  const dressIds = Array.isArray(session.dress_ids)
    ? (session.dress_ids as string[])
    : []

  if (dressIds.length === 0) {
    return (
      <main className="container mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-6" role="img" aria-label="Empty fitting room">
          👗
        </div>
        <h1 className="text-2xl font-bold text-ivory mb-3">No Dresses Yet</h1>
        <p className="text-platinum">This fitting room doesn&apos;t have any dresses saved.</p>
      </main>
    )
  }

  // Fetch the dresses
  const { data: dresses } = await supabase
    .from('dresses')
    .select('*')
    .in('id', dressIds)

  const dressList = (dresses ?? []) as Dress[]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-ivory mb-2">Fitting Room Picks</h1>
        <p className="text-platinum text-sm">
          Cast your vote on these {dressList.length} dress{dressList.length !== 1 ? 'es' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {dressList.map((dress) => (
          <div key={dress.id} className="flex flex-col gap-4">
            <DressCard
              id={dress.id}
              name={dress.name}
              designer={dress.designer}
              color={dress.color}
              price_cents={dress.price_cents}
              images={dress.images}
              is_active={dress.is_active ?? true}
            />
            <div className="flex justify-center">
              <VoteOnDress dressId={dress.id} shareToken={token} />
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
