'use client'

import { useState, useActionState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { SPRING_STANDARD } from '@/lib/motion'
import { ChevronLeft, ChevronRight, X, Check } from 'lucide-react'
import { updateAppointmentStatus } from '@/lib/actions/appointments'
import type { AppointmentWithCustomer } from '@/types/index'

interface CalendarAgendaProps {
  appointments: AppointmentWithCustomer[]
  queryDate: string
  storeId: string
}

const STATUS_STYLES: Record<string, string> = {
  SCHEDULED:   'bg-amber-100  text-amber-800  border-amber-200',
  IN_PROGRESS: 'bg-blue-100   text-blue-800   border-blue-200',
  COMPLETED:   'bg-emerald-100 text-emerald-800 border-emerald-200',
  NO_SHOW:     'bg-rose-100   text-rose-800   border-rose-200',
  CANCELLED:   'bg-slate-100  text-slate-600  border-slate-200',
}

const STATUS_LABELS: Record<string, string> = {
  SCHEDULED: 'Scheduled',
  IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed',
  NO_SHOW: 'No Show',
  CANCELLED: 'Cancelled',
}

type AppointmentStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'NO_SHOW' | 'CANCELLED'

function navigateDate(currentDate: string, delta: number): string {
  const d = new Date(currentDate + 'T12:00:00')
  d.setDate(d.getDate() + delta)
  return d.toISOString().slice(0, 10)
}

function formatTimeChip(dateStr: string): { hour: string; period: string } {
  const d = new Date(dateStr)
  const raw = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
  const [timePart, period] = raw.split(' ')
  return { hour: timePart ?? raw, period: period ?? '' }
}

interface StatusModalProps {
  appointment: AppointmentWithCustomer
  onClose: () => void
}

function StatusModal({ appointment, onClose }: StatusModalProps) {
  const shouldReduce = useReducedMotion()
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus>(
    appointment.status as AppointmentStatus
  )
  const [salesFeedback, setSalesFeedback] = useState(
    appointment.sales_feedback ?? ''
  )

  const [state, dispatch, isPending] = useActionState(updateAppointmentStatus, {
    status: 'idle',
    message: '',
  })

  const statusOptions: AppointmentStatus[] = [
    'SCHEDULED',
    'IN_PROGRESS',
    'COMPLETED',
    'NO_SHOW',
  ]

  const springTransition = shouldReduce
    ? { duration: 0 }
    : SPRING_STANDARD

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={shouldReduce ? { duration: 0 } : { duration: 0.2 }}
    >
      <motion.div
        className="mt-auto glass-heavy rounded-t-3xl p-6 pb-10 max-h-[90vh] overflow-y-auto"
        initial={shouldReduce ? false : { y: '100%' }}
        animate={{ y: 0 }}
        exit={shouldReduce ? {} : { y: '100%' }}
        transition={springTransition}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <p className="text-sm text-platinum mb-1">
              Update Status
            </p>
            <h2 className="text-2xl font-bold text-ivory">
              {appointment.customer_name ?? 'Unknown Customer'}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-3 rounded-xl glass-light text-platinum active:scale-[0.98] min-w-[48px] min-h-[48px] flex items-center justify-center"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Status grid */}
        <form action={dispatch}>
          <input type="hidden" name="appointmentId" value={appointment.id} />
          <input type="hidden" name="status" value={selectedStatus} />
          <input type="hidden" name="salesFeedback" value={salesFeedback} />

          <div className="grid grid-cols-2 gap-3 mb-5">
            {statusOptions.map((s) => {
              const isSelected = selectedStatus === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSelectedStatus(s)}
                  className={[
                    'p-6 rounded-2xl border-2 text-left transition-all min-h-[48px] active:scale-[0.98]',
                    STATUS_STYLES[s] ?? '',
                    isSelected
                      ? 'border-gold ring-2 ring-gold/30'
                      : 'border-transparent',
                  ].join(' ')}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      {STATUS_LABELS[s]}
                    </span>
                    {isSelected && (
                      <Check size={16} className="text-gold" />
                    )}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Sales feedback */}
          <div className="mb-5">
            <label
              htmlFor="sales-feedback"
              className="block text-sm font-medium text-platinum mb-2"
            >
              Sales Notes / Feedback
            </label>
            <textarea
              id="sales-feedback"
              rows={4}
              value={salesFeedback}
              onChange={(e) => setSalesFeedback(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-ivory text-lg placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 resize-none"
              placeholder="Add notes about the appointment…"
            />
          </div>

          {/* State feedback */}
          {state.status !== 'idle' && (
            <div
              className={[
                'mb-4 px-4 py-3 rounded-xl text-sm font-medium',
                state.status === 'success'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-rose-100 text-rose-800',
              ].join(' ')}
            >
              {state.message}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full py-4 rounded-2xl bg-gold text-onyx font-bold text-lg active:scale-[0.98] disabled:opacity-60 min-h-[48px] transition-all"
          >
            {isPending ? 'Saving…' : 'Save Status'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function CalendarAgenda({
  appointments,
  queryDate,
}: CalendarAgendaProps) {
  const router = useRouter()
  const shouldReduce = useReducedMotion()
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithCustomer | null>(null)

  const springTransition = shouldReduce
    ? { duration: 0 }
    : SPRING_STANDARD

  return (
    <>
      {/* Date navigation */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={() =>
            router.push(
              '/saas/staff/calendar?date=' + navigateDate(queryDate, -1)
            )
          }
          className="p-4 glass-light rounded-2xl active:scale-[0.98] min-w-[64px] min-h-[64px] flex items-center justify-center text-ivory"
          aria-label="Previous day"
        >
          <ChevronLeft size={24} />
        </button>

        <span className="text-platinum text-sm font-medium">
          {queryDate}
        </span>

        <button
          type="button"
          onClick={() =>
            router.push(
              '/saas/staff/calendar?date=' + navigateDate(queryDate, 1)
            )
          }
          className="p-4 glass-light rounded-2xl active:scale-[0.98] min-w-[64px] min-h-[64px] flex items-center justify-center text-ivory"
          aria-label="Next day"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Appointments list */}
      {appointments.length === 0 ? (
        <div className="glass-light rounded-2xl p-10 flex flex-col items-center gap-4 text-center">
          <span className="text-5xl" role="img" aria-label="Calendar">
            📅
          </span>
          <p className="text-platinum text-lg">
            No appointments scheduled for this day.
          </p>
          <Link
            href="/saas/staff/walk-in"
            className="px-6 py-3 rounded-2xl bg-gold text-onyx font-semibold active:scale-[0.98] min-h-[48px] flex items-center"
          >
            Register Walk-In Customer
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {appointments.map((appt, i) => {
              const { hour, period } = formatTimeChip(appt.appointment_date)
              return (
                <motion.button
                  key={appt.id}
                  type="button"
                  onClick={() => setSelectedAppointment(appt)}
                  className="glass-light rounded-2xl p-4 w-full text-left flex items-start gap-4 active:scale-[0.98] min-h-[48px]"
                  initial={shouldReduce ? false : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ...springTransition, delay: i * 0.04 }}
                >
                  {/* Time chip */}
                  <div className="w-24 h-24 rounded-2xl bg-onyx border border-white/10 flex flex-col items-center justify-center shrink-0">
                    <span className="text-2xl font-bold text-ivory leading-none">
                      {hour}
                    </span>
                    <span className="text-xs text-platinum uppercase tracking-widest mt-1">
                      {period}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <p className="text-2xl font-bold text-ivory truncate">
                      {appt.customer_name ?? 'Unknown Customer'}
                    </p>

                    <div className="flex flex-wrap gap-2 mt-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border bg-onyx text-platinum border-white/10">
                        {appt.appointment_type === 'WALK_IN'
                          ? 'Walk-In'
                          : 'Appointment'}
                      </span>
                      <span
                        className={[
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
                          STATUS_STYLES[appt.status] ?? '',
                        ].join(' ')}
                      >
                        {STATUS_LABELS[appt.status] ?? appt.status}
                      </span>
                    </div>

                    {appt.notes && (
                      <p className="mt-2 text-sm text-platinum truncate">
                        {appt.notes}
                      </p>
                    )}
                  </div>
                </motion.button>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Status update modal */}
      <AnimatePresence>
        {selectedAppointment && (
          <StatusModal
            appointment={selectedAppointment}
            onClose={() => setSelectedAppointment(null)}
          />
        )}
      </AnimatePresence>
    </>
  )
}
