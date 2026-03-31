import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Boutique } from '@/types/index'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Owner Dashboard' }

export default async function OwnerDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId    = user.app_metadata?.store_id    as string | undefined
  const systemRole = user.app_metadata?.system_role as string | undefined
  const storeRole  = user.app_metadata?.store_role  as string | undefined

  if (systemRole !== 'SUPER_ADMIN' && storeRole !== 'OWNER') redirect('/unauthorized')
  if (!storeId) redirect('/unauthorized')

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [
    boutiqueResult,
    appointmentsTodayResult,
    pendingInquiriesResult,
    activeStaffResult,
    customersResult,
    recentInquiriesResult,
  ] = await Promise.all([
    supabase
      .from('boutiques')
      .select('name, city, state, subscription_status')
      .eq('id', storeId)
      .single(),
    supabase
      .from('appointments')
      .select('id, status, appointment_date')
      .eq('store_id', storeId)
      .gte('appointment_date', todayStart.toISOString())
      .lte('appointment_date', todayEnd.toISOString())
      .order('appointment_date', { ascending: true }),
    supabase
      .from('availability_inquiries')
      .select('id')
      .eq('boutique_id', storeId)
      .eq('status', 'pending'),
    supabase
      .from('store_staff')
      .select('id, role')
      .eq('store_id', storeId)
      .eq('is_active', true),
    supabase
      .from('store_customers')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId),
    supabase
      .from('availability_inquiries')
      .select('id, status, customer_name, created_at')
      .eq('boutique_id', storeId)
      .gte('created_at', sevenDaysAgo.toISOString())
      .order('created_at', { ascending: false })
      .limit(5),
  ])

  const boutique       = boutiqueResult.data as Pick<Boutique, 'name' | 'city' | 'state' | 'subscription_status'> | null
  const appointmentsToday = appointmentsTodayResult.data ?? []
  const pendingInquiries  = pendingInquiriesResult.data ?? []
  const activeStaff       = activeStaffResult.data ?? []
  const customerCount     = customersResult.count ?? 0
  const recentInquiries   = recentInquiriesResult.data ?? []

  const todayScheduled  = appointmentsToday.filter((a) => a.status === 'SCHEDULED').length
  const todayInProgress = appointmentsToday.filter((a) => a.status === 'IN_PROGRESS').length
  const todayCompleted  = appointmentsToday.filter((a) => a.status === 'COMPLETED').length

  // Next upcoming appointment today
  const nextAppt = appointmentsToday.find((a) => a.status === 'SCHEDULED')
  const nextApptTime = nextAppt
    ? new Date(nextAppt.appointment_date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null

  const subVariant =
    boutique?.subscription_status === 'ACTIVE'   ? 'success' :
    boutique?.subscription_status === 'PAST_DUE' ? 'warning' : 'danger'

  return (
    <div className="space-y-10 max-w-3xl">

      {/* Store header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-ivory">
            {boutique?.name ?? 'Owner Dashboard'}
          </h1>
          {boutique && (
            <p className="text-sm text-platinum mt-0.5">
              {[boutique.city, boutique.state].filter(Boolean).join(', ')}
            </p>
          )}
        </div>
        {boutique && (
          <Badge variant={subVariant}>{boutique.subscription_status}</Badge>
        )}
      </div>

      {/* Today at a glance */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Today
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Total Today',  value: appointmentsToday.length, color: 'text-ivory' },
            { label: 'Scheduled',    value: todayScheduled,           color: 'text-amber-300' },
            { label: 'In Progress',  value: todayInProgress,          color: 'text-sky-300' },
            { label: 'Completed',    value: todayCompleted,           color: 'text-emerald-300' },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass-light rounded-2xl p-4 space-y-1">
              <p className="text-xs text-platinum">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {nextApptTime && (
          <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3">
            <span className="text-gold text-lg">⏰</span>
            <p className="text-sm text-ivory">
              Next appointment at <span className="font-semibold text-gold">{nextApptTime}</span>
            </p>
            <Link
              href="/saas/staff/calendar"
              className="ml-auto text-xs text-platinum hover:text-ivory transition-colors"
            >
              View calendar →
            </Link>
          </div>
        )}
      </section>

      {/* Store KPIs */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Store Overview
        </h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pending Inquiries', value: pendingInquiries.length, color: 'text-amber-300', href: '/saas/owner/analytics' },
            { label: 'Active Staff',      value: activeStaff.length,      color: 'text-sky-300',   href: '/saas/owner/staff' },
            { label: 'Total Customers',   value: customerCount,           color: 'text-ivory',     href: '/saas/staff/clienteling' },
          ].map(({ label, value, color, href }) => (
            <Link key={label} href={href} className="glass-light rounded-2xl p-4 space-y-1 hover:bg-white/10 transition-colors group">
              <p className="text-xs text-platinum">{label}</p>
              <p className={`text-3xl font-bold ${color}`}>{value}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent inquiries */}
      {recentInquiries.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
              Recent Inquiries
            </h2>
            <Link href="/saas/owner/analytics" className="text-xs text-gold hover:text-gold/80 transition-colors">
              View all →
            </Link>
          </div>
          <div className="glass-light rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {recentInquiries.map((inq, i) => (
                  <tr key={inq.id} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                    <td className="px-4 py-2.5 text-ivory">{inq.customer_name}</td>
                    <td className="px-4 py-2.5 text-platinum text-xs">
                      {new Date(inq.created_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <Badge
                        variant={
                          inq.status === 'confirmed' ? 'success' :
                          inq.status === 'pending'   ? 'warning' :
                          inq.status === 'completed' ? 'neutral' : 'danger'
                        }
                      >
                        {inq.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Quick nav */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { href: '/saas/owner/staff',     label: 'Staff',     desc: `${activeStaff.length} active` },
            { href: '/saas/owner/analytics', label: 'Analytics', desc: 'Booking stats' },
            { href: '/saas/owner/settings',  label: 'Settings',  desc: 'Store config' },
            { href: '/saas/staff/calendar',  label: 'Calendar',  desc: 'Today\'s schedule' },
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
