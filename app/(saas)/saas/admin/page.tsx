import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Boutique } from '@/types/index'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Super Admin Dashboard' }

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') redirect('/unauthorized')

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const cutoff = thirtyDaysAgo.toISOString()

  // Parallel data fetches — all non-fatal (UI degrades gracefully on error)
  const [boutiquesResult, inquiriesResult, staffResult] = await Promise.all([
    supabase
      .from('boutiques')
      .select('id, name, city, state, is_active, subscription_status, created_at')
      .order('name', { ascending: true }),
    supabase
      .from('availability_inquiries')
      .select('id, status, created_at')
      .gte('created_at', cutoff),
    supabase
      .from('store_staff')
      .select('id, is_active')
      .eq('is_active', true),
  ])

  type BoutiqueRow = Pick<Boutique, 'id' | 'name' | 'city' | 'state' | 'is_active' | 'subscription_status' | 'created_at'>
  const boutiques   = (boutiquesResult.data ?? []) as BoutiqueRow[]
  const inquiries   = inquiriesResult.data ?? []
  const activeStaff = staffResult.data ?? []

  // Boutique stats
  const totalStores    = boutiques.length
  const activeStores   = boutiques.filter((b) => b.is_active).length
  const activeSubs     = boutiques.filter((b) => b.subscription_status === 'ACTIVE').length
  const pastDueSubs    = boutiques.filter((b) => b.subscription_status === 'PAST_DUE').length
  const cancelledSubs  = boutiques.filter((b) => b.subscription_status === 'CANCELLED').length
  const newStores      = boutiques.filter((b) => b.created_at >= cutoff).length

  // Inquiry stats (last 30 days)
  const totalInquiries  = inquiries.length
  const pendingCount    = inquiries.filter((i) => i.status === 'pending').length
  const confirmedCount  = inquiries.filter((i) => i.status === 'confirmed').length
  const completedCount  = inquiries.filter((i) => i.status === 'completed').length

  const kpis = [
    { label: 'Total Boutiques',  value: totalStores,           color: 'text-ivory' },
    { label: 'Active Stores',    value: activeStores,          color: 'text-emerald-300' },
    { label: 'Active Platform Staff', value: activeStaff.length, color: 'text-sky-300' },
    { label: 'Inquiries (30d)',   value: totalInquiries,        color: 'text-gold' },
  ]

  const subVariant = (status: Boutique['subscription_status']) =>
    status === 'ACTIVE' ? 'success' : status === 'PAST_DUE' ? 'warning' : 'danger'

  return (
    <div className="space-y-10 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Super Admin Dashboard</h1>
        <p className="text-sm text-platinum mt-1">Platform-wide overview — last 30 days</p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="glass-light rounded-2xl p-4 space-y-1">
            <p className="text-xs text-platinum">{kpi.label}</p>
            <p className={`text-3xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Subscription health */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Subscription Health
        </h2>
        <div className="glass-light rounded-2xl p-5 space-y-4">
          {[
            { label: 'Active',    count: activeSubs,    total: totalStores, variant: 'success' as const },
            { label: 'Past Due',  count: pastDueSubs,   total: totalStores, variant: 'warning' as const },
            { label: 'Cancelled', count: cancelledSubs, total: totalStores, variant: 'danger'  as const },
          ].map(({ label, count, total, variant }) => (
            <div key={label} className="flex items-center gap-4">
              <div className="w-24">
                <Badge variant={variant}>{label}</Badge>
              </div>
              <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold rounded-full transition-all"
                  style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
                />
              </div>
              <span className="text-sm text-ivory w-6 text-right font-medium">{count}</span>
            </div>
          ))}
        </div>

        {pastDueSubs > 0 && (
          <div className="glass-light rounded-xl px-4 py-3 flex items-center justify-between border border-amber-400/20">
            <p className="text-sm text-amber-300">
              {pastDueSubs} boutique{pastDueSubs > 1 ? 's' : ''} past due — review billing
            </p>
            <Link href="/saas/admin/billing" className="text-xs text-gold hover:text-gold/80 font-medium transition-colors">
              View Billing →
            </Link>
          </div>
        )}
      </section>

      {/* Inquiry pipeline (30d) */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Booking Pipeline — Last 30 Days
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total',     value: totalInquiries, color: 'text-ivory' },
            { label: 'Pending',   value: pendingCount,   color: 'text-amber-300' },
            { label: 'Confirmed', value: confirmedCount, color: 'text-emerald-300' },
            { label: 'Completed', value: completedCount, color: 'text-sky-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-light rounded-xl p-3 space-y-0.5">
              <p className="text-xs text-platinum">{label}</p>
              <p className={`text-xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* New boutiques this month */}
      {newStores > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            New Boutiques This Month
          </h2>
          <ul className="space-y-2">
            {boutiques
              .filter((b) => b.created_at >= cutoff)
              .map((b) => (
                <li key={b.id} className="glass-light rounded-xl px-4 py-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ivory">{b.name}</p>
                    <p className="text-xs text-platinum">
                      {[b.city, b.state].filter(Boolean).join(', ') || '—'}
                    </p>
                  </div>
                  <Badge variant={subVariant(b.subscription_status)}>
                    {b.subscription_status}
                  </Badge>
                </li>
              ))}
          </ul>
        </section>
      )}

      {/* Quick nav */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { href: '/saas/admin/stores',    label: 'Manage Stores',    desc: `${totalStores} boutiques` },
            { href: '/saas/admin/inventory', label: 'View Inventory',   desc: 'Global dress stock' },
            { href: '/saas/admin/billing',   label: 'Billing Overview', desc: `${activeSubs} active subs` },
          ].map(({ href, label, desc }) => (
            <Link
              key={href}
              href={href}
              className="glass-light rounded-2xl p-4 hover:bg-white/10 transition-colors group"
            >
              <p className="text-sm font-semibold text-ivory group-hover:text-gold transition-colors">
                {label}
              </p>
              <p className="text-xs text-platinum mt-0.5">{desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
