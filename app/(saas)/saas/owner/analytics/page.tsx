import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { AvailabilityInquiry } from '@/types/index'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Analytics | Owner Portal' }

interface InquiryStats {
  total: number
  pending: number
  confirmed: number
  completed: number
  cancelled: number
}

function computeStats(inquiries: Pick<AvailabilityInquiry, 'status'>[]): InquiryStats {
  const stats: InquiryStats = { total: 0, pending: 0, confirmed: 0, completed: 0, cancelled: 0 }
  for (const inq of inquiries) {
    stats.total++
    stats[inq.status]++
  }
  return stats
}

export default async function OwnerAnalyticsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) redirect('/unauthorized')

  // Fetch last 90 days of inquiries for this boutique
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - 90)
  const ninetyDaysAgo = cutoff.toISOString()

  const { data: inquiries } = await supabase
    .from('availability_inquiries')
    .select('status, created_at, school_name')
    .eq('boutique_id', storeId)
    .gte('created_at', ninetyDaysAgo)
    .order('created_at', { ascending: false })

  const rows = (inquiries ?? []) as Pick<AvailabilityInquiry, 'status' | 'created_at' | 'school_name'>[]
  const stats = computeStats(rows)

  // Top schools by inquiry count
  const schoolCounts: Record<string, number> = {}
  for (const row of rows) {
    const school = row.school_name ?? 'Unknown'
    schoolCounts[school] = (schoolCounts[school] ?? 0) + 1
  }
  const topSchools = Object.entries(schoolCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  const conversionRate = stats.total > 0
    ? Math.round(((stats.confirmed + stats.completed) / stats.total) * 100)
    : 0

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-ivory">Analytics</h1>
        <p className="text-sm text-platinum mt-1">Last 90 days</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Requests', value: stats.total, color: 'text-ivory' },
          { label: 'Pending',        value: stats.pending,   color: 'text-amber-300' },
          { label: 'Confirmed',      value: stats.confirmed, color: 'text-emerald-300' },
          { label: 'Conversion',     value: `${conversionRate}%`, color: 'text-gold' },
        ].map((kpi) => (
          <div key={kpi.label} className="glass-light rounded-2xl p-4 space-y-1">
            <p className="text-xs text-platinum">{kpi.label}</p>
            <p className={`text-2xl font-bold ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Status breakdown */}
      <section className="space-y-3">
        <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Booking Status Breakdown
        </h2>
        <div className="glass-light rounded-2xl p-5 space-y-3">
          {(
            [
              { status: 'pending',   label: 'Pending',   count: stats.pending,   variant: 'warning' },
              { status: 'confirmed', label: 'Confirmed', count: stats.confirmed, variant: 'success' },
              { status: 'completed', label: 'Completed', count: stats.completed, variant: 'neutral' },
              { status: 'cancelled', label: 'Cancelled', count: stats.cancelled, variant: 'danger' },
            ] as const
          ).map(({ label, count, variant }) => (
            <div key={label} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant={variant}>{label}</Badge>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-32 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gold rounded-full transition-all"
                    style={{ width: stats.total > 0 ? `${(count / stats.total) * 100}%` : '0%' }}
                  />
                </div>
                <span className="text-sm text-ivory w-6 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Top schools */}
      {topSchools.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Top Schools by Inquiries
          </h2>
          <div className="glass-light rounded-2xl p-5 space-y-3">
            {topSchools.map(([school, count]) => (
              <div key={school} className="flex items-center justify-between text-sm">
                <span className="text-ivory truncate mr-4">{school}</span>
                <span className="text-gold font-semibold shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {stats.total === 0 && (
        <p className="text-sm text-platinum">
          No booking data yet for the last 90 days.
        </p>
      )}
    </div>
  )
}
