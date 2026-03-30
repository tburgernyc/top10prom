import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Boutique } from '@/types/index'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Billing | Super Admin' }

export default async function AdminBillingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') redirect('/unauthorized')

  const { data: boutiques } = await supabase
    .from('boutiques')
    .select('id, name, city, state, subscription_status, is_active, created_at')
    .order('subscription_status', { ascending: true })

  const stores = (boutiques ?? []) as Pick<
    Boutique,
    'id' | 'name' | 'city' | 'state' | 'subscription_status' | 'is_active' | 'created_at'
  >[]

  const active    = stores.filter((s) => s.subscription_status === 'ACTIVE')
  const pastDue   = stores.filter((s) => s.subscription_status === 'PAST_DUE')
  const cancelled = stores.filter((s) => s.subscription_status === 'CANCELLED')

  return (
    <div className="space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-ivory">Billing Overview</h1>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: 'Active',    count: active.length,    variant: 'success' as const },
          { label: 'Past Due',  count: pastDue.length,   variant: 'warning' as const },
          { label: 'Cancelled', count: cancelled.length, variant: 'danger'  as const },
        ].map((item) => (
          <div key={item.label} className="glass-light rounded-2xl p-4 text-center space-y-1">
            <p className="text-2xl font-bold text-ivory">{item.count}</p>
            <Badge variant={item.variant}>{item.label}</Badge>
          </div>
        ))}
      </div>

      {/* Past due — needs attention */}
      {pastDue.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-amber-300 uppercase tracking-wide">
            ⚠ Past Due — Requires Attention
          </h2>
          <ul className="space-y-2">
            {pastDue.map((s) => (
              <li key={s.id} className="glass-light rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-ivory">{s.name}</p>
                  <p className="text-xs text-platinum">
                    {[s.city, s.state].filter(Boolean).join(', ')}
                  </p>
                </div>
                <Badge variant="warning">PAST_DUE</Badge>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* All boutiques */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          All Subscriptions
        </h2>
        <div className="glass-light rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left px-4 py-2.5 text-xs text-platinum font-medium">Boutique</th>
                <th className="text-left px-4 py-2.5 text-xs text-platinum font-medium hidden sm:table-cell">Location</th>
                <th className="text-right px-4 py-2.5 text-xs text-platinum font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {stores.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                  <td className="px-4 py-2.5 text-ivory">{s.name}</td>
                  <td className="px-4 py-2.5 text-platinum hidden sm:table-cell">
                    {[s.city, s.state].filter(Boolean).join(', ') || '—'}
                  </td>
                  <td className="px-4 py-2.5 text-right">
                    <Badge variant={
                      s.subscription_status === 'ACTIVE'    ? 'success' :
                      s.subscription_status === 'PAST_DUE'  ? 'warning' :
                      'danger'
                    }>
                      {s.subscription_status}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="glass-light rounded-xl p-4 text-xs text-platinum">
        Billing is currently managed manually. Full Stripe integration is planned for a future phase.
      </div>
    </div>
  )
}
