import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiRatelimit } from '@/lib/ratelimit'
import { sendParentShareEmail } from '@/lib/email'
import { headers } from 'next/headers'

const schema = z.object({
  parentEmail: z.string().email('A valid parent email is required'),
  parentName: z.string().min(1).default('Parent/Guardian'),
  dressName: z.string().min(1).default('dress picks'),
  shareUrl: z.string().url('A valid share URL is required'),
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

  const { parentEmail, parentName, dressName, shareUrl } = parsed.data

  await sendParentShareEmail({
    parentEmail,
    parentName,
    dressName,
    shareUrl,
  })

  return NextResponse.json({ success: true })
}
