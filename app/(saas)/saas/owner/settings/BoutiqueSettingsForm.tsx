'use client'

import { useActionState } from 'react'
import { updateBoutiqueSettings } from '@/lib/actions/owner'
import type { BoutiqueSettings } from '@/types/index'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface BoutiqueSettingsFormProps {
  current: BoutiqueSettings | null
}

const initialState = { status: 'idle' as const, message: '' }

export function BoutiqueSettingsForm({ current }: BoutiqueSettingsFormProps) {
  const [state, formAction, isPending] = useActionState(updateBoutiqueSettings, initialState)

  return (
    <form action={formAction} className="space-y-5">
      <Input
        label="Booking lead time (hours)"
        name="booking_lead_time_hours"
        type="number"
        min="0"
        defaultValue={current?.booking_lead_time_hours ?? 24}
        error={state.fieldErrors?.booking_lead_time_hours}
        hint="Minimum hours before a booking can be made"
      />

      <Input
        label="Max daily appointments"
        name="max_daily_appointments"
        type="number"
        min="1"
        defaultValue={current?.max_daily_appointments ?? 8}
        error={state.fieldErrors?.max_daily_appointments}
      />

      <Input
        label="Appointment duration (minutes)"
        name="appointment_duration_minutes"
        type="number"
        min="15"
        step="15"
        defaultValue={current?.appointment_duration_minutes ?? 60}
        error={state.fieldErrors?.appointment_duration_minutes}
      />

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-platinum" htmlFor="auto-confirm">
          Auto-confirm bookings
        </label>
        <select
          id="auto-confirm"
          name="auto_confirm_bookings"
          defaultValue={current?.auto_confirm_bookings ? 'true' : 'false'}
          className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent"
        >
          <option value="false">Manual review required</option>
          <option value="true">Auto-confirm immediately</option>
        </select>
      </div>

      <Input
        label="Notification email"
        name="notification_email"
        type="email"
        defaultValue={current?.notification_email ?? ''}
        error={state.fieldErrors?.notification_email}
        hint="Receives booking notification emails (optional)"
        placeholder="manager@yourboutique.com"
      />

      {state.status === 'error' && !state.fieldErrors && (
        <p className="text-sm text-rose-400">{state.message}</p>
      )}
      {state.status === 'success' && (
        <p className="text-sm text-emerald-400">{state.message}</p>
      )}

      <Button type="submit" variant="primary" loading={isPending} disabled={isPending}>
        Save Settings
      </Button>
    </form>
  )
}
