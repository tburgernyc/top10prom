import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { apiRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

// Checks whether a dress has already been reserved for a given school + event date
// combination. Used by the booking wizard to enforce the no-duplicate guarantee.
export async function GET(request: Request) {
  const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await apiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const dressId = searchParams.get('dress_id')
  const schoolName = searchParams.get('school_name')
  const eventDate = searchParams.get('event_date')

  if (!dressId || !schoolName || !eventDate) {
    return NextResponse.json(
      { error: 'dress_id, school_name, and event_date are required' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data, error } = await supabase
    .from('availability_inquiries')
    .select('id')
    .eq('dress_id', dressId)
    .eq('school_name', schoolName)
    .eq('event_date', eventDate)
    .in('status', ['pending', 'confirmed'])
    .limit(1)

  if (error) {
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }

  return NextResponse.json({
    isDuplicate: (data?.length ?? 0) > 0,
  })
}
