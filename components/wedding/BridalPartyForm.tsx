'use client'

import { useActionState } from 'react'
import { createBridalParty } from '@/lib/actions/wedding'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const initialState = { status: 'idle' as const, message: '' }

export function BridalPartyForm() {
  const [state, formAction, isPending] = useActionState(createBridalParty, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <Input
        label="Bride's name"
        name="bride_name"
        type="text"
        required
        autoComplete="name"
        error={state.fieldErrors?.bride_name}
        placeholder="Jane Smith"
      />

      <Input
        label="Wedding date"
        name="wedding_date"
        type="date"
        required
        error={state.fieldErrors?.wedding_date}
      />

      <Input
        label="Venue name"
        name="venue_name"
        type="text"
        error={state.fieldErrors?.venue_name}
        placeholder="The Grand Ballroom (optional)"
      />

      <Input
        label="Estimated party size"
        name="party_size"
        type="number"
        min="1"
        max="20"
        error={state.fieldErrors?.party_size}
        hint="Including bride, bridesmaids, and other members"
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-platinum" htmlFor="wedding-notes">
          Notes
        </label>
        <textarea
          id="wedding-notes"
          name="notes"
          rows={3}
          placeholder="Color scheme, style preferences, any special requests…"
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent resize-none"
        />
      </div>

      {state.status === 'error' && (
        <p className="text-sm text-rose-400">{state.message}</p>
      )}

      <Button type="submit" variant="primary" loading={isPending} disabled={isPending}>
        Create Bridal Party
      </Button>
    </form>
  )
}
