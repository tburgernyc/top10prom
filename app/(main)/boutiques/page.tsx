import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { STATIC_BOUTIQUES, type StaticBoutique } from '@/lib/data/boutiques'
import { StoreLocator } from '@/components/location/StoreLocator'
import { NearestStorePrompt } from '@/components/location/NearestStorePrompt'
import type { Database } from '@/types/database'

export const metadata: Metadata = {
  title: 'Visit a Boutique | Top 10 Prom',
  description: 'Private styling appointments at Top 10 Prom boutiques across Atlanta. Find the dress that\'s exclusively yours.',
}

type BoutiqueRow = Database['public']['Tables']['boutiques']['Row']

function toStaticBoutique(row: BoutiqueRow): StaticBoutique {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    address: row.address ?? '',
    city: row.city ?? '',
    state: row.state ?? 'GA',
    zip: row.zip ?? '',
    phone: row.phone ?? '',
    lat: row.lat ?? 0,
    lng: row.lng ?? 0,
  }
}

export default async function BoutiquesPage() {
  const supabase = await createClient()
  const { data } = await supabase
    .from('boutiques')
    .select('*')
    .eq('is_active', true)
    .order('name')

  const stores: StaticBoutique[] =
    data && data.length > 0
      ? (data as BoutiqueRow[]).map(toStaticBoutique)
      : STATIC_BOUTIQUES

  return (
    <main className="container mx-auto px-4 py-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-ivory mb-2">Visit a Top 10 Prom Boutique</h1>
        <p className="text-platinum">
          Private styling appointments at {stores.length} location{stores.length !== 1 ? 's' : ''} across Atlanta. Book your fitting and find the dress that&apos;s exclusively yours.
        </p>
      </div>

      <NearestStorePrompt stores={stores} />
      <StoreLocator stores={stores} />
    </main>
  )
}
