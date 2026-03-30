'use client'

import { useActionState, useTransition } from 'react'
import { addBridalMember, updateMemberStatus } from '@/lib/actions/wedding'
import type { BridalParty, BridalPartyMember, BridalMemberStatus } from '@/types/index'
import Badge from '@/components/ui/Badge'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface BridalPartyManagerProps {
  party: BridalParty
  members: BridalPartyMember[]
}

const ROLE_LABELS: Record<BridalPartyMember['role'], string> = {
  bride:           'Bride',
  maid_of_honor:   'Maid of Honor',
  bridesmaid:      'Bridesmaid',
  flower_girl:     'Flower Girl',
  mother_of_bride: 'Mother of Bride',
  other:           'Other',
}

const STATUS_VARIANT: Record<
  BridalMemberStatus,
  'neutral' | 'warning' | 'success' | 'gold'
> = {
  invited:   'warning',
  confirmed: 'success',
  fitted:    'gold',
  purchased: 'success',
}

const NEXT_STATUS: Record<BridalMemberStatus, BridalMemberStatus | null> = {
  invited:   'confirmed',
  confirmed: 'fitted',
  fitted:    'purchased',
  purchased: null,
}

const initialMemberState = { status: 'idle' as const, message: '' }

function MemberCard({ member, partyId }: { member: BridalPartyMember; partyId: string }) {
  const [isPending, startTransition] = useTransition()
  const nextStatus = NEXT_STATUS[member.status]

  function advance() {
    if (!nextStatus) return
    startTransition(async () => {
      await updateMemberStatus(member.id, partyId, nextStatus)
    })
  }

  return (
    <li className="glass-light rounded-xl px-4 py-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="text-sm font-semibold text-ivory truncate">{member.member_name}</p>
        <p className="text-xs text-platinum">{ROLE_LABELS[member.role]}</p>
        {member.member_email && (
          <p className="text-xs text-platinum/60 truncate">{member.member_email}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={STATUS_VARIANT[member.status]}>{member.status}</Badge>
        {nextStatus && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            loading={isPending}
            disabled={isPending}
            onClick={advance}
          >
            → {nextStatus}
          </Button>
        )}
      </div>
    </li>
  )
}

export function BridalPartyManager({ party, members }: BridalPartyManagerProps) {
  const [addState, addFormAction, isAdding] = useActionState(addBridalMember, initialMemberState)

  return (
    <div className="space-y-8">
      {/* Party header */}
      <div className="glass-light rounded-2xl p-5 space-y-2">
        <h2 className="text-xl font-bold text-ivory">{party.bride_name}&apos;s Bridal Party</h2>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-platinum">
          <span>Wedding: {party.wedding_date}</span>
          {party.venue_name && <span>Venue: {party.venue_name}</span>}
          <span>{members.length} member{members.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* Members list */}
      {members.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-platinum uppercase tracking-wide">
            Party Members
          </h3>
          <ul className="space-y-2">
            {members.map((m) => (
              <MemberCard key={m.id} member={m} partyId={party.id} />
            ))}
          </ul>
        </section>
      )}

      {/* Add member form */}
      <section className="space-y-3">
        <h3 className="text-sm font-semibold text-platinum uppercase tracking-wide">
          Add a Member
        </h3>
        <div className="glass-light rounded-2xl p-5">
          <form action={addFormAction} className="space-y-4">
            <input type="hidden" name="party_id" value={party.id} />

            <Input
              label="Full name"
              name="member_name"
              type="text"
              required
              error={addState.fieldErrors?.member_name}
            />
            <Input
              label="Email"
              name="member_email"
              type="email"
              error={addState.fieldErrors?.member_email}
              hint="Optional — used to send an invite"
            />
            <Input
              label="Phone"
              name="member_phone"
              type="tel"
              error={addState.fieldErrors?.member_phone}
            />

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-platinum" htmlFor="member-role">
                Role
              </label>
              <select
                id="member-role"
                name="role"
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
              >
                {Object.entries(ROLE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            {addState.status === 'error' && (
              <p className="text-sm text-rose-400">{addState.message}</p>
            )}
            {addState.status === 'success' && (
              <p className="text-sm text-emerald-400">{addState.message}</p>
            )}

            <Button type="submit" variant="primary" loading={isAdding} disabled={isAdding}>
              Add Member
            </Button>
          </form>
        </div>
      </section>
    </div>
  )
}
