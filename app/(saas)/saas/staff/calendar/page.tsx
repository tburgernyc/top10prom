import type { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import CalendarAgenda from './CalendarAgenda'

export const metadata: Metadata = { title: 'Staff Calendar' }

type AppointmentRow = {
  id: string
  store_id: string
  user_id: string | null
  store_customer_id: string | null
  appointment_date: string
  appointment_type: 'APPOINTMENT' | 'WALK_IN'
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED'
  notes: string | null
  sales_feedback: string | null
  purchased_dress_id: string | null
  created_by_staff_id: string | null
  updated_by_staff_id: string | null
  created_at: string
  updated_at: string | null
  store_customers: {
    first_name: string
    last_name: string
    phone: string | null
    email: string | null
  } | null
}

interface PageProps {
  searchParams: Promise<{ date?: string }>
}

export default async function StaffCalendarPage({ searchParams }: PageProps) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const storeId = user.app_metadata?.store_id as string | undefined

  if (!storeId) {
    return (
      <div className="p-4 md:p-6 max-w-4xl mx-auto">
        <div className="glass-light rounded-2xl p-6 text-center">
          <p className="text-rose-400 text-lg font-medium">
            No store assignment found for your account. Please contact your administrator.
          </p>
        </div>
      </div>
    )
  }

  const queryDate =
    (await searchParams).date ?? new Date().toISOString().slice(0, 10)

  const { data: appointments } = await supabase
    .from('appointments')
    .select('*, store_customers(first_name, last_name, phone, email)')
    .eq('store_id', storeId)
    .gte('appointment_date', `${queryDate}T00:00:00`)
    .lte('appointment_date', `${queryDate}T23:59:59`)
    .order('appointment_date', { ascending: true })

  const rows = (appointments ?? []) as AppointmentRow[]

  const normalized = rows.map((row) => ({
    ...row,
    customer_name: row.store_customers
      ? `${row.store_customers.first_name} ${row.store_customers.last_name}`
      : null,
    customer_phone: row.store_customers?.phone ?? null,
    customer_email: row.store_customers?.email ?? null,
  }))

  const displayDate = new Date(`${queryDate}T12:00:00`).toLocaleDateString(
    'en-US',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  )

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <h1 className="text-2xl font-bold text-ivory">
          {displayDate}
        </h1>
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gold/20 text-gold border border-gold/30">
          {normalized.length}{' '}
          {normalized.length === 1 ? 'appointment' : 'appointments'}
        </span>
      </div>
      <CalendarAgenda
        appointments={normalized}
        queryDate={queryDate}
        storeId={storeId}
      />
    </div>
  )
}
