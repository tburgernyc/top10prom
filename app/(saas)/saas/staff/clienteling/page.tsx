import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import ClientelingTable from './ClientelingTable'

export const metadata: Metadata = { title: 'Clienteling CRM | Staff' }

export type CustomerWithAppointments = {
  id: string
  first_name: string
  last_name: string
  phone: string | null
  email: string | null
  notes: string | null
  created_at: string
  appointments: Array<{
    id: string
    status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED'
    appointment_type: 'APPOINTMENT' | 'WALK_IN'
    appointment_date: string
  }>
}

export type SegmentCounts = {
  all: number
  recentWalkIns: number
  noShows: number
  completed: number
}

export default async function ClientelingPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const storeId = user.app_metadata?.store_id as string | undefined
  if (!storeId) redirect('/unauthorized')

  // Fetch customers with their appointments — typed explicitly, no `any` cast
  const { data } = await supabase
    .from('store_customers')
    .select(
      'id, first_name, last_name, phone, email, notes, created_at, appointments(id, status, appointment_type, appointment_date)'
    )
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })

  const customers = (data ?? []) as CustomerWithAppointments[]

  // Pre-compute segment counts server-side
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

  const segmentCounts: SegmentCounts = {
    all: customers.length,
    recentWalkIns: customers.filter((c) =>
      c.appointments?.some(
        (a) =>
          a.appointment_type === 'WALK_IN' &&
          new Date(a.appointment_date) >= sevenDaysAgo
      )
    ).length,
    noShows: customers.filter((c) =>
      c.appointments?.some((a) => a.status === 'NO_SHOW')
    ).length,
    completed: customers.filter((c) =>
      c.appointments?.some((a) => a.status === 'COMPLETED')
    ).length,
  }

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-ivory tracking-tight">
            Clienteling CRM
          </h1>
          <p className="text-platinum mt-1">
            {customers.length} customer
            {customers.length !== 1 ? 's' : ''} in your local database.
          </p>
        </div>
      </header>

      <ClientelingTable customers={customers} segmentCounts={segmentCounts} />
    </div>
  )
}
