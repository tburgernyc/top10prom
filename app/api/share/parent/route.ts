import { NextResponse } from 'next/server'
import { z } from 'zod'
import { apiRatelimit } from '@/lib/ratelimit'
import { sendParentShareEmail } from '@/lib/email'
import { headers } from 'next/headers'
import { getClientIp } from '@/lib/request'

const schema = z.object({
  parentEmail: z.string().email('A valid parent email is required'),
  parentName: z.string().min(1).default('Parent/Guardian'),
  dressName: z.string().min(1).default('dress picks'),
  shareUrl: z.string().url('A valid share URL is required'),
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

  const { parentEmail, parentName, dressName, shareUrl } = parsed.data

  const siteOrigin = process.env.NEXT_PUBLIC_APP_URL
  if (siteOrigin) {
    try {
      const { origin } = new URL(shareUrl)
      if (origin !== siteOrigin) {
        return NextResponse.json({ error: 'Invalid share URL' }, { status: 400 })
      }
    } catch {
      return NextResponse.json({ error: 'Invalid share URL' }, { status: 400 })
    }
  }

  await sendParentShareEmail({
    parentEmail,
    parentName,
    dressName,
    shareUrl,
  })

  return NextResponse.json({ success: true })
}
