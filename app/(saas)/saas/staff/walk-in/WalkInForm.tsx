'use client'

import { useActionState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { registerWalkInCustomer } from '@/lib/actions/staff'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'

export default function WalkInForm() {
  const router = useRouter()
  const { toast } = useToast()

  const [state, dispatch, isPending] = useActionState(registerWalkInCustomer, {
    status: 'idle',
    message: '',
  })

  useEffect(() => {
    if (state.status === 'success') {
      toast('Customer checked in!', 'success')
      router.push('/saas/staff/calendar')
    }
  }, [state.status, toast, router])

  return (
    <div className="glass-light rounded-2xl p-6 space-y-4">
      <form action={dispatch} className="space-y-4">
        <Input
          label="First Name"
          name="firstName"
          required
          autoComplete="given-name"
          {...(state.fieldErrors?.firstName
            ? { error: state.fieldErrors.firstName }
            : {})}
          placeholder="Jane"
        />
        <Input
          label="Last Name"
          name="lastName"
          required
          autoComplete="family-name"
          {...(state.fieldErrors?.lastName
            ? { error: state.fieldErrors.lastName }
            : {})}
          placeholder="Smith"
        />
        <Input
          label="Phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          {...(state.fieldErrors?.phone
            ? { error: state.fieldErrors.phone }
            : {})}
          placeholder="(555) 000-0000"
        />
        <Input
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          {...(state.fieldErrors?.email
            ? { error: state.fieldErrors.email }
            : {})}
          placeholder="jane@example.com"
        />

        {/* Notes textarea — built inline since Input is for <input> */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="notes"
            className="text-sm font-medium text-platinum"
          >
            Notes
          </label>
          <textarea
            id="notes"
            name="notes"
            rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none text-sm"
            placeholder="Optional notes about the customer…"
            maxLength={1000}
          />
        </div>

        {state.status === 'error' && (
          <div className="px-4 py-3 rounded-xl bg-rose-100 text-rose-800 text-sm font-medium">
            {state.message}
          </div>
        )}

        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isPending}
          className="w-full"
        >
          Check In Customer
        </Button>
      </form>
    </div>
  )
}
