import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { BoutiqueSettings } from '@/types/index'
import { BoutiqueSettingsForm } from './BoutiqueSettingsForm'

export const metadata: Metadata = { title: 'Boutique Settings | Owner Portal' }

export default async function OwnerSettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) redirect('/unauthorized')

  const { data: settings } = await supabase
    .from('boutique_settings')
    .select('*')
    .eq('boutique_id', storeId)
    .maybeSingle()

  const current = settings as BoutiqueSettings | null

  return (
    <div className="space-y-6 max-w-lg">
      <h1 className="text-2xl font-bold text-ivory">Boutique Settings</h1>
      <div className="glass-light rounded-2xl p-6">
        <BoutiqueSettingsForm current={current} />
      </div>
    </div>
  )
}
