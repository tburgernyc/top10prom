import type { Metadata } from 'next'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export const metadata: Metadata = { title: 'Floor Hub | Staff' }

export default async function StaffFloorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId   = user.app_metadata?.store_id   as string | undefined
  const storeRole = user.app_metadata?.store_role  as string | undefined

  if (!storeId) {
    return (
      <div className="p-4 md:p-6 max-w-3xl mx-auto">
        <div className="glass-light rounded-2xl p-6 text-center">
          <p className="text-rose-400 font-medium">
            No store assignment found. Please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  const todayStart = new Date()
  todayStart.setHours(0, 0, 0, 0)
  const todayEnd = new Date()
  todayEnd.setHours(23, 59, 59, 999)

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const [appointmentsResult, walkInsResult, customersResult] = await Promise.all([
    // Today's appointments
    supabase
      .from('appointments')
      .select('id, status, appointment_date, appointment_type, store_customers(first_name, last_name)')
      .eq('store_id', storeId)
      .gte('appointment_date', todayStart.toISOString())
      .lte('appointment_date', todayEnd.toISOString())
      .order('appointment_date', { ascending: true }),
    // Walk-ins this week
    supabase
      .from('appointments')
      .select('id')
      .eq('store_id', storeId)
      .eq('appointment_type', 'WALK_IN')
      .gte('appointment_date', sevenDaysAgo.toISOString()),
    // Total customers
    supabase
      .from('store_customers')
      .select('id', { count: 'exact', head: true })
      .eq('store_id', storeId),
  ])

  type ApptRow = {
    id: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED'
    appointment_date: string
    appointment_type: 'APPOINTMENT' | 'WALK_IN'
    store_customers: { first_name: string; last_name: string } | null
  }

  const appointments  = (appointmentsResult.data ?? []) as ApptRow[]
  const walkInsCount  = walkInsResult.data?.length ?? 0
  const customerCount = customersResult.count ?? 0

  const scheduled   = appointments.filter((a) => a.status === 'SCHEDULED')
  const inProgress  = appointments.filter((a) => a.status === 'IN_PROGRESS')
  const completed   = appointments.filter((a) => a.status === 'COMPLETED')

  // Next upcoming appointment
  const nextAppt = scheduled[0]
  const nextApptTime = nextAppt
    ? new Date(nextAppt.appointment_date).toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
      })
    : null
  const nextApptName = nextAppt?.store_customers
    ? `${nextAppt.store_customers.first_name} ${nextAppt.store_customers.last_name}`
    : 'Appointment'

  const todayDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const statusColor = (status: ApptRow['status']) => {
    switch (status) {
      case 'SCHEDULED':   return 'text-amber-300'
      case 'IN_PROGRESS': return 'text-sky-300'
      case 'COMPLETED':   return 'text-emerald-300'
      case 'NO_SHOW':     return 'text-rose-400'
      case 'CANCELLED':   return 'text-white/30'
    }
  }

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-ivory">Floor Hub</h1>
        <p className="text-sm text-platinum mt-0.5">
          {todayDate}
          {storeRole && (
            <span className="ml-2 text-gold">· {storeRole}</span>
          )}
        </p>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Today',       value: appointments.length, color: 'text-ivory' },
          { label: 'Scheduled',   value: scheduled.length,    color: 'text-amber-300' },
          { label: 'In Progress', value: inProgress.length,   color: 'text-sky-300' },
          { label: 'Completed',   value: completed.length,    color: 'text-emerald-300' },
        ].map(({ label, value, color }) => (
          <div key={label} className="glass-light rounded-2xl p-4 space-y-1">
            <p className="text-xs text-platinum">{label}</p>
            <p className={`text-3xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Next up banner */}
      {nextApptTime ? (
        <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3 border border-gold/20">
          <span className="text-gold text-xl shrink-0">⏰</span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-ivory">
              Next up: <span className="text-gold">{nextApptName}</span> at{' '}
              <span className="text-gold">{nextApptTime}</span>
            </p>
          </div>
          <Link
            href="/saas/staff/calendar"
            className="ml-auto text-xs text-platinum hover:text-ivory transition-colors shrink-0"
          >
            Full calendar →
          </Link>
        </div>
      ) : (
        <div className="glass-light rounded-xl px-4 py-3 flex items-center gap-3">
          <span className="text-emerald-400 text-xl shrink-0">✓</span>
          <p className="text-sm text-platinum">
            {appointments.length === 0
              ? 'No appointments scheduled for today.'
              : 'All appointments for today are complete.'}
          </p>
        </div>
      )}

      {/* Today's schedule — first 5 */}
      {appointments.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
              Today&apos;s Schedule
            </h2>
            <Link
              href="/saas/staff/calendar"
              className="text-xs text-gold hover:text-gold/80 transition-colors"
            >
              Full view →
            </Link>
          </div>
          <div className="glass-light rounded-2xl overflow-hidden">
            <table className="w-full text-sm">
              <tbody>
                {appointments.slice(0, 5).map((appt, i) => {
                  const name = appt.store_customers
                    ? `${appt.store_customers.first_name} ${appt.store_customers.last_name}`
                    : '—'
                  const time = new Date(appt.appointment_date).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                  })
                  return (
                    <tr key={appt.id} className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}>
                      <td className="px-4 py-2.5 text-platinum w-20 text-xs">{time}</td>
                      <td className="px-4 py-2.5 text-ivory">{name}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span className={`text-xs font-medium ${statusColor(appt.status)}`}>
                          {appt.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {appointments.length > 5 && (
            <p className="text-xs text-platinum text-center">
              +{appointments.length - 5} more —{' '}
              <Link href="/saas/staff/calendar" className="text-gold hover:text-gold/80 transition-colors">
                view all
              </Link>
            </p>
          )}
        </section>
      )}

      {/* Quick actions */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Link
            href="/saas/staff/walk-in"
            className="glass-light rounded-2xl p-5 hover:bg-white/10 transition-colors group text-center"
          >
            <span className="text-3xl block mb-2">🚶</span>
            <p className="text-sm font-semibold text-ivory group-hover:text-gold transition-colors">
              Register Walk-In
            </p>
            <p className="text-xs text-platinum mt-0.5">{walkInsCount} this week</p>
          </Link>
          <Link
            href="/saas/staff/calendar"
            className="glass-light rounded-2xl p-5 hover:bg-white/10 transition-colors group text-center"
          >
            <span className="text-3xl block mb-2">📅</span>
            <p className="text-sm font-semibold text-ivory group-hover:text-gold transition-colors">
              Appointment Calendar
            </p>
            <p className="text-xs text-platinum mt-0.5">{appointments.length} today</p>
          </Link>
          <Link
            href="/saas/staff/clienteling"
            className="glass-light rounded-2xl p-5 hover:bg-white/10 transition-colors group text-center"
          >
            <span className="text-3xl block mb-2">👥</span>
            <p className="text-sm font-semibold text-ivory group-hover:text-gold transition-colors">
              Clienteling CRM
            </p>
            <p className="text-xs text-platinum mt-0.5">{customerCount} customers</p>
          </Link>
        </div>
      </section>
    </div>
  )
}
