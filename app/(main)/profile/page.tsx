import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { logoutAction } from '@/lib/actions/auth'
import type { AvailabilityInquiry } from '@/types/index'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { CalendarDays, MapPin, Clock } from 'lucide-react'

export const metadata: Metadata = {
  title: 'My Profile | Top 10 Prom',
  description: 'Manage your Top 10 Prom account and view your bookings.',
}

const STATUS_LABEL: Record<AvailabilityInquiry['status'], string> = {
  pending: 'Pending',
  confirmed: 'Confirmed',
  cancelled: 'Cancelled',
  completed: 'Completed',
}

const STATUS_VARIANT: Record<
  AvailabilityInquiry['status'],
  'neutral' | 'success' | 'warning' | 'danger'
> = {
  pending: 'warning',
  confirmed: 'success',
  cancelled: 'danger',
  completed: 'neutral',
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function ProfilePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login?next=/profile')
  }

  const displayName = user.user_metadata?.full_name as string | undefined
  const email = user.email ?? ''
  const initial = displayName?.charAt(0).toUpperCase() ?? email.charAt(0).toUpperCase() ?? '?'

  // Fetch user's bookings (matched by auth user ID or email)
  const { data: inquiries } = await supabase
    .from('availability_inquiries')
    .select('id, status, preferred_date, preferred_time, school_name, event_date, created_at, boutique_id, dress_id')
    .or(`customer_id.eq.${user.id},customer_email.eq.${email}`)
    .order('created_at', { ascending: false })
    .limit(20)

  const bookings = (inquiries ?? []) as Pick<
    AvailabilityInquiry,
    'id' | 'status' | 'preferred_date' | 'preferred_time' | 'school_name' | 'event_date' | 'created_at' | 'boutique_id' | 'dress_id'
  >[]

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Account card */}
        <div className="glass-light rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gold text-xl font-bold text-onyx shrink-0">
                {initial}
              </div>
              <div>
                {displayName && (
                  <p className="font-semibold text-ivory">{displayName}</p>
                )}
                <p className="text-sm text-platinum">{email}</p>
              </div>
            </div>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" size="sm">
                Sign out
              </Button>
            </form>
          </div>
        </div>

        {/* Bookings */}
        <section className="space-y-3">
          <h2 className="text-lg font-semibold text-ivory">My Appointments</h2>

          {bookings.length === 0 ? (
            <div className="glass-light rounded-2xl p-8 text-center space-y-3">
              <p className="text-platinum text-sm">No appointments yet.</p>
              <Link href="/book">
                <Button variant="primary" size="sm">Book Now</Button>
              </Link>
            </div>
          ) : (
            <ul className="space-y-3">
              {bookings.map((b) => (
                <li key={b.id} className="glass-light rounded-xl p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <Badge variant={STATUS_VARIANT[b.status]}>
                      {STATUS_LABEL[b.status]}
                    </Badge>
                    <span className="text-xs text-platinum">
                      Requested {formatDate(b.created_at)}
                    </span>
                  </div>
                  <div className="space-y-1.5 text-sm">
                    {b.preferred_date && (
                      <div className="flex items-center gap-2 text-ivory">
                        <CalendarDays size={14} className="text-gold shrink-0" />
                        <span>{formatDate(b.preferred_date)}{b.preferred_time ? ` at ${b.preferred_time}` : ''}</span>
                      </div>
                    )}
                    {b.school_name && (
                      <div className="flex items-center gap-2 text-platinum">
                        <MapPin size={14} className="text-gold shrink-0" />
                        <span>{b.school_name}</span>
                      </div>
                    )}
                    {b.event_date && (
                      <div className="flex items-center gap-2 text-platinum">
                        <Clock size={14} className="text-gold shrink-0" />
                        <span>Prom: {formatDate(b.event_date)}</span>
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Quick links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/catalog"
            className="glass-light rounded-2xl p-5 hover:bg-white/10 transition-colors"
          >
            <p className="font-semibold text-ivory mb-1">Browse Catalog</p>
            <p className="text-sm text-platinum">Find your perfect dress</p>
          </Link>
          <Link
            href="/book"
            className="glass-light rounded-2xl p-5 hover:bg-white/10 transition-colors"
          >
            <p className="font-semibold text-ivory mb-1">Book Appointment</p>
            <p className="text-sm text-platinum">Reserve your styling session</p>
          </Link>
        </div>

      </div>
    </main>
  )
}
