import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createHash } from 'crypto'
import { createClient } from '@/lib/supabase/server'
import { apiRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'
import { getClientIp } from '@/lib/request'

const schema = z.object({
  dressId: z.string().uuid('Valid dress ID required'),
  shareToken: z.string().uuid('Valid share token required'),
  vote: z.enum(['up', 'down']),
})

export async function POST(request: Request) {
  const ip = getClientIp(await headers())
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

  const { dressId, shareToken, vote } = parsed.data
  // Derive a deterministic, anonymous voter slot from IP + session — prevents vote stuffing
  // while avoiding storage of PII.
  const voterName = createHash('sha256').update(`${ip}:${shareToken}`).digest('hex').slice(0, 16)

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
