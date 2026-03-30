'use server'

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { resend } from '@/lib/email'
import type { ActionState, BridalMemberRole, BridalMemberStatus } from '@/types/index'
import { z } from 'zod'

export type WeddingActionState = ActionState<{ partyId: string }>
export type MemberActionState = ActionState

const createPartySchema = z.object({
  bride_name:   z.string().min(2, 'Bride name is required'),
  wedding_date: z.string().min(1, 'Wedding date is required'),
  venue_name:   z.string().optional(),
  party_size:   z.coerce.number().int().min(1).max(20).optional(),
  notes:        z.string().optional(),
})

const addMemberSchema = z.object({
  party_id:     z.string().uuid(),
  member_name:  z.string().min(2, 'Member name is required'),
  member_email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  member_phone: z.string().optional(),
  role:         z.enum(['bride', 'maid_of_honor', 'bridesmaid', 'flower_girl', 'mother_of_bride', 'other']),
})

/** Create a new bridal party — auth required */
export async function createBridalParty(
  _prev: WeddingActionState,
  formData: FormData
): Promise<WeddingActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login?next=/wedding/party/new')

  const raw = {
    bride_name:   formData.get('bride_name') as string,
    wedding_date: formData.get('wedding_date') as string,
    venue_name:   (formData.get('venue_name') as string) || undefined,
    party_size:   formData.get('party_size') ? Number(formData.get('party_size')) : undefined,
    notes:        (formData.get('notes') as string) || undefined,
  }

  const parsed = createPartySchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      const first = msgs?.[0]
      if (first) fieldErrors[key] = first
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  const shareToken = crypto.randomUUID()

  const { data: party, error } = await supabase
    .from('bridal_parties')
    .insert({
      bride_id:     user.id,
      bride_name:   parsed.data.bride_name,
      wedding_date: parsed.data.wedding_date,
      venue_name:   parsed.data.venue_name ?? null,
      party_size:   parsed.data.party_size ?? null,
      notes:        parsed.data.notes ?? null,
      share_token:  shareToken,
    })
    .select('id')
    .single()

  if (error) {
    console.error('[Wedding] createBridalParty failed:', error)
    return { status: 'error', message: 'Failed to create bridal party.' }
  }

  redirect(`/wedding/party/${party.id}`)
}

/** Add a member to a bridal party */
export async function addBridalMember(
  _prev: MemberActionState,
  formData: FormData
): Promise<MemberActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'Unauthorized' }

  const raw = {
    party_id:     formData.get('party_id') as string,
    member_name:  formData.get('member_name') as string,
    member_email: (formData.get('member_email') as string) || '',
    member_phone: (formData.get('member_phone') as string) || undefined,
    role:         formData.get('role') as string,
  }

  const parsed = addMemberSchema.safeParse(raw)
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const [key, msgs] of Object.entries(parsed.error.flatten().fieldErrors)) {
      const first = msgs?.[0]
      if (first) fieldErrors[key] = first
    }
    return { status: 'error', message: 'Please fix the errors below.', fieldErrors }
  }

  // Verify the party belongs to this user
  const { data: party } = await supabase
    .from('bridal_parties')
    .select('id, bride_name, wedding_date, share_token')
    .eq('id', parsed.data.party_id)
    .eq('bride_id', user.id)
    .single()

  if (!party) return { status: 'error', message: 'Party not found or access denied.' }

  const { error } = await supabase.from('bridal_party_members').insert({
    party_id:     parsed.data.party_id,
    member_name:  parsed.data.member_name,
    member_email: parsed.data.member_email || null,
    member_phone: parsed.data.member_phone ?? null,
    role:         parsed.data.role as BridalMemberRole,
    status:       'invited' as BridalMemberStatus,
  })

  if (error) {
    console.error('[Wedding] addBridalMember failed:', error)
    return { status: 'error', message: 'Failed to add member.' }
  }

  // Send invite email if email provided (non-fatal)
  if (parsed.data.member_email && resend) {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://top10prom.com'
    void resend.emails.send({
      from: process.env.RESEND_FROM ?? 'Top 10 Prom <noreply@top10prom.com>',
      to: parsed.data.member_email,
      subject: `You've been invited to ${party.bride_name}'s bridal party`,
      html: `<p>You've been invited to join ${party.bride_name}'s bridal party for their wedding on ${party.wedding_date}.</p><p><a href="${appUrl}/wedding/party/${party.id}?token=${party.share_token}">View your invitation</a></p>`,
    }).catch((err: unknown) => {
      console.error('[Wedding] Member invite email failed:', err)
    })
  }

  revalidatePath(`/wedding/party/${parsed.data.party_id}`)
  return { status: 'success', message: `${parsed.data.member_name} added to your party.` }
}

/** Update a member's status */
export async function updateMemberStatus(
  memberId: string,
  partyId: string,
  status: BridalMemberStatus
): Promise<MemberActionState> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { status: 'error', message: 'Unauthorized' }

  // Double guard: user must own the party
  const { data: party } = await supabase
    .from('bridal_parties')
    .select('id')
    .eq('id', partyId)
    .eq('bride_id', user.id)
    .single()

  if (!party) return { status: 'error', message: 'Access denied.' }

  const { error } = await supabase
    .from('bridal_party_members')
    .update({ status })
    .eq('id', memberId)
    .eq('party_id', partyId)

  if (error) return { status: 'error', message: 'Failed to update status.' }

  revalidatePath(`/wedding/party/${partyId}`)
  return { status: 'success', message: 'Status updated.' }
}
