import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { apiRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'
import { getClientIp } from '@/lib/request'

// GET ?from=ISO&to=ISO&boutiqueId=optional
// Requires authenticated user with system_role === 'SUPER_ADMIN'
export async function GET(request: Request) {
  const ip = getClientIp(await headers())
  const { success } = await apiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const querySchema = z.object({
    from: z.string().datetime({ offset: true }).optional(),
    to: z.string().datetime({ offset: true }).optional(),
    boutiqueId: z.string().uuid().optional(),
  })

  const { searchParams } = new URL(request.url)
  const q = querySchema.safeParse({
    from: searchParams.get('from') ?? undefined,
    to: searchParams.get('to') ?? undefined,
    boutiqueId: searchParams.get('boutiqueId') ?? undefined,
  })
  if (!q.success) {
    return NextResponse.json({ error: 'Invalid query parameters' }, { status: 400 })
  }
  const { from, to, boutiqueId } = q.data

  let query = supabase
    .from('appointments')
    .select('id, store_id, status, created_at')

  if (from) query = query.gte('created_at', from)
  if (to) query = query.lte('created_at', to)
  if (boutiqueId) query = query.eq('store_id', boutiqueId)

  const { data: appointments, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  const rows = appointments ?? []
  const totalAppointments = rows.length

  // Count by status
  const byStatus: Record<string, number> = {}
  for (const row of rows) {
    byStatus[row.status] = (byStatus[row.status] ?? 0) + 1
  }

  // Count by boutique (store_id)
  const boutiqueMap: Record<string, number> = {}
  for (const row of rows) {
    boutiqueMap[row.store_id] = (boutiqueMap[row.store_id] ?? 0) + 1
  }
  const byBoutique = Object.entries(boutiqueMap).map(([storeId, count]) => ({
    storeId,
    count,
  }))

  // Fetch school distribution from availability_inquiries for top schools
  let schoolQuery = supabase
    .from('availability_inquiries')
    .select('school_name')
    .not('school_name', 'is', null)

  if (from) schoolQuery = schoolQuery.gte('created_at', from)
  if (to) schoolQuery = schoolQuery.lte('created_at', to)

  const { data: inquiries } = await schoolQuery

  const schoolMap: Record<string, number> = {}
  for (const row of inquiries ?? []) {
    if (row.school_name) {
      schoolMap[row.school_name] = (schoolMap[row.school_name] ?? 0) + 1
    }
  }
  const topSchools = Object.entries(schoolMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10)
    .map(([school, count]) => ({ school, count }))

  return NextResponse.json({
    totalAppointments,
    byStatus,
    byBoutique,
    topSchools,
  })
}
