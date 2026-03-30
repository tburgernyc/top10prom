import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/server'
import { apiRatelimit } from '@/lib/ratelimit'
import { headers } from 'next/headers'
import { getClientIp } from '@/lib/request'

const postSchema = z.object({
  dress_ids: z.array(z.string().uuid()),
  share_token: z.string().uuid(),
})

const patchSchema = z.object({
  id: z.string().uuid(),
  dress_ids: z.array(z.string().uuid()),
})

// GET ?token=TOKEN — fetch fitting_room_sessions by share_token (public)
export async function GET(request: Request) {
  const ip = getClientIp(await headers())
  const { success } = await apiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const { searchParams } = new URL(request.url)
  const token = searchParams.get('token')

  if (!token) {
    return NextResponse.json({ error: 'token is required' }, { status: 400 })
  }

  const supabase = await createClient()
  const { data, error } = await supabase
    .from('fitting_room_sessions')
    .select('*')
    .eq('share_token', token)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Session not found' }, { status: 404 })
  }

  return NextResponse.json({ session: data })
}

// POST { dress_ids, share_token } — create a new fitting room session
export async function POST(request: Request) {
  const ip = getClientIp(await headers())
  const { success } = await apiRatelimit.limit(ip)
  if (!success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = postSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { dress_ids, share_token } = parsed.data

  const { data, error } = await supabase
    .from('fitting_room_sessions')
    .insert({
      user_id: user?.id ?? null,
      session_token: crypto.randomUUID(),
      dress_ids,
      share_token,
    })
    .select('id, share_token')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id, share_token: data.share_token }, { status: 201 })
}

// PATCH { id, dress_ids } — update dress_ids on an existing session
export async function PATCH(request: Request) {
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

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = patchSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { id, dress_ids } = parsed.data

  const { data, error } = await supabase
    .from('fitting_room_sessions')
    .update({ dress_ids })
    .eq('id', id)
    .eq('user_id', user.id)
    .select('id')
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Failed to update session' }, { status: 500 })
  }

  return NextResponse.json({ id: data.id })
}
