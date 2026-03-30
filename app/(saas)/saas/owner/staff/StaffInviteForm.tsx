'use client'

import { useActionState } from 'react'
import { inviteStaffMember } from '@/lib/actions/owner'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

const initialState = { status: 'idle' as const, message: '' }

export function StaffInviteForm() {
  const [state, formAction, isPending] = useActionState(inviteStaffMember, initialState)

  return (
    <form action={formAction} className="space-y-4">
      <Input
        label="Email address"
        name="email"
        type="email"
        required
        autoComplete="off"
        error={state.fieldErrors?.email}
        placeholder="team@example.com"
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-platinum" htmlFor="invite-role">
          Role
        </label>
        <select
          id="invite-role"
          name="role"
          required
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="ASSOCIATE">Associate</option>
          <option value="MANAGER">Manager</option>
        </select>
        {state.fieldErrors?.role && (
          <p className="text-xs text-rose-400">{state.fieldErrors.role}</p>
        )}
      </div>

      {state.status === 'error' && !state.fieldErrors && (
        <p className="text-sm text-rose-400">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="text-sm text-emerald-400">{state.message}</p>
      )}

      <Button type="submit" variant="primary" loading={isPending} disabled={isPending}>
        Send Invitation
      </Button>
    </form>
  )
}
