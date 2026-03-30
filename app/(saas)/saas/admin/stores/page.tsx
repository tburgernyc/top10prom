import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Boutique } from '@/types/index'
import Badge from '@/components/ui/Badge'
import { BoutiqueControlRow } from './BoutiqueControlRow'

export const metadata: Metadata = { title: 'Store Management | Super Admin' }

export default async function AdminStoresPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') redirect('/unauthorized')

  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('id, name, slug, city, state, is_active, subscription_status, created_at')
    .order('name', { ascending: true })

  const stores = (boutiques ?? []) as Pick<
    Boutique,
    'id' | 'name' | 'slug' | 'city' | 'state' | 'is_active' | 'subscription_status' | 'created_at'
  >[]

  const activeCount = stores.filter((s) => s.is_active).length

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ivory">Store Management</h1>
        <Badge variant="gold">{activeCount} / {stores.length} active</Badge>
      </div>

      {stores.length === 0 ? (
        <p className="text-sm text-platinum">No boutiques found.</p>
      ) : (
        <ul className="space-y-3">
          {stores.map((store) => (
            <BoutiqueControlRow key={store.id} store={store} />
          ))}
        </ul>
      )}
    </div>
  )
}
