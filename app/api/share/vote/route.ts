import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { apiRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'

const schema = z.object({
  dressId: z.string().uuid('Valid dress ID required'),
  shareToken: z.string().uuid('Valid share token required'),
  vote: z.enum(['up', 'down']),
  voterName: z.string().min(1).default('Guest'),
})

export async function POST(request: Request) {
  const ip = (await headers()).get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await apiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    )
  }

  const { dressId, shareToken, vote, voterName } = parsed.data

  const supabase = await createClient()

  const { error } = await supabase
    .from('social_votes')
    .upsert(
      {
        dress_id: dressId,
        share_token: shareToken,
        voter_name: voterName,
        vote,
      },
      { onConflict: 'share_token,dress_id,voter_name' }
    )

  if (error) {
    return NextResponse.json({ error: 'Failed to record vote' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
