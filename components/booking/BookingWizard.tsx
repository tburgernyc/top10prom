'use client'

import { useActionState, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { BookingProgress } from './BookingProgress'
import { Step0SelectEvent } from './steps/Step0SelectEvent'
import { Step1Dress, type DressPreferences } from './steps/Step1Dress'
import { Step2Store } from './steps/Step2Store'
import { Step3DateTime } from './steps/Step3DateTime'
import { Step4Contact } from './steps/Step4Contact'
import { Step5Confirm } from './steps/Step5Confirm'
import { BookingConfirmation } from './BookingConfirmation'
import { submitBookingAction, type BookingFormState } from '@/lib/actions/booking'
import type { BookingStep } from '@/types/index'

interface WizardValues {
  event_type: 'prom' | 'wedding'
  dress_id: string
  boutique_id: string
  preferred_date: string
  preferred_time: string
  customer_name: string
  customer_email: string
  customer_phone: string
  parent_email: string
  parent_phone: string
  school_name: string
  event_date: string
  notes: string
}

const initialState: BookingFormState = { status: 'idle', message: '' }

const emptyValues: WizardValues = {
  event_type: 'prom',
  dress_id: '',
  boutique_id: '',
  preferred_date: '',
  preferred_time: '',
  customer_name: '',
  customer_email: '',
  customer_phone: '',
  parent_email: '',
  parent_phone: '',
  school_name: '',
  event_date: '',
  notes: '',
}

interface BookingWizardProps {
  initialDressId?: string
}

function formatPreferences(prefs: DressPreferences): string {
  const lines: string[] = ['Dress Preferences:']
  if (prefs.occasion) lines.push(`• Occasion: ${prefs.occasion}`)
  if (prefs.length) lines.push(`• Length: ${prefs.length}`)
  if (prefs.color) lines.push(`• Color: ${prefs.color}`)
  if (prefs.style) lines.push(`• Style: ${prefs.style}`)
  if (prefs.timeOfDay) lines.push(`• Preferred time: ${prefs.timeOfDay}`)
  if (prefs.season) lines.push(`• Season: ${prefs.season}`)
  if (prefs.additionalNotes) lines.push(`• Additional notes: ${prefs.additionalNotes}`)
  return lines.join('\n')
}

export function BookingWizard({ initialDressId }: BookingWizardProps) {
  const shouldReduce = useReducedMotion()
  const [step, setStep] = useState<BookingStep>(0)
  const [values, setValues] = useState<WizardValues>({
    ...emptyValues,
    dress_id: initialDressId ?? '',
  })

  const [bookingState, formAction, isPending] = useActionState(submitBookingAction, initialState)

  function mergeValues(partial: Partial<WizardValues>) {
    setValues((prev) => ({ ...prev, ...partial }))
  }

  // Show success screen after submission
  if (bookingState.status === 'success') {
    return (
      <BookingConfirmation
        {...(bookingState.data?.inquiryId !== undefined && { inquiryId: bookingState.data.inquiryId })}
        preferredDate={values.preferred_date}
        preferredTime={values.preferred_time}
      />
    )
  }

  const STEP_TITLES: Record<BookingStep, string> = {
    0: 'Your Event',
    1: 'Select Your Dress',
    2: 'Choose a Store',
    3: 'Pick a Date & Time',
    4: 'Your Information',
    5: 'Confirm Booking',
  }

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-5 sm:py-8 space-y-6 sm:space-y-8">
      <div className="space-y-4">
        {step > 0 && <BookingProgress currentStep={step} />}
        <h2 className="text-xl font-semibold text-ivory">{STEP_TITLES[step]}</h2>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={shouldReduce ? {} : { opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={shouldReduce ? {} : { opacity: 0, x: -20 }}
          transition={{ type: 'spring', stiffness: 320, damping: 32 }}
        >
          {step === 0 && (
            <Step0SelectEvent
              onNext={(eventType) => {
                mergeValues({ event_type: eventType })
                setStep(1)
              }}
            />
          )}
          {step === 1 && (
            <Step1Dress
              selectedDressId={values.dress_id || null}
              onNext={(dressId, preferences) => {
                const prefsNote = preferences ? formatPreferences(preferences) : ''
                // Merge prefs into notes; preserve any existing notes from Step4
                const existingNotes = values.notes && !values.notes.startsWith('Dress Preferences:')
                  ? values.notes
                  : ''
                const combinedNotes = [prefsNote, existingNotes].filter(Boolean).join('\n\n')
                mergeValues({ dress_id: dressId, notes: combinedNotes })
                setStep(2)
              }}
            />
          )}
          {step === 2 && (
            <Step2Store
              selectedBoutiqueId={values.boutique_id || null}
              onNext={(boutiqueId) => {
                mergeValues({ boutique_id: boutiqueId })
                setStep(3)
              }}
              onBack={() => setStep(1)}
            />
          )}
          {step === 3 && (
            <Step3DateTime
              boutiqueId={values.boutique_id}
              preferredDate={values.preferred_date || null}
              preferredTime={values.preferred_time || null}
              onNext={(date, time) => {
                mergeValues({ preferred_date: date, preferred_time: time })
                setStep(4)
              }}
              onBack={() => setStep(2)}
            />
          )}
          {step === 4 && (
            <Step4Contact
              values={{
                customer_name: values.customer_name,
                customer_email: values.customer_email,
                customer_phone: values.customer_phone,
                parent_email: values.parent_email,
                parent_phone: values.parent_phone,
                school_name: values.school_name,
                event_date: values.event_date,
                notes: values.notes,
              }}
              eventType={values.event_type}
              onNext={(contact) => {
                // If user adds notes in Step4, append them after dress preferences
                const prefsSection = values.notes.startsWith('Dress Preferences:')
                  ? values.notes
                  : ''
                const newNotes = contact.notes && contact.notes !== values.notes
                  ? [prefsSection, contact.notes].filter(Boolean).join('\n\n')
                  : values.notes
                mergeValues({ ...contact, notes: newNotes })
                setStep(5)
              }}
              onBack={() => setStep(3)}
            />
          )}
          {step === 5 && (
            <Step5Confirm
              values={values}
              formAction={formAction}
              state={bookingState}
              isPending={isPending}
              onBack={() => setStep(4)}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
