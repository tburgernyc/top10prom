'use client'

import { motion, useReducedMotion } from 'motion/react'
import Link from 'next/link'
import Button from '@/components/ui/Button'
import { CalendarDays, CheckCircle, Mail } from 'lucide-react'

interface BookingConfirmationProps {
  inquiryId?: string | undefined
  boutiqueName?: string | undefined
  preferredDate?: string | undefined
  preferredTime?: string | undefined
}

export function BookingConfirmation({ boutiqueName, preferredDate, preferredTime }: BookingConfirmationProps) {
  const shouldReduce = useReducedMotion()

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <motion.div
        initial={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        className="w-full max-w-sm text-center space-y-6"
      >
        <div className="relative flex items-center justify-center h-28">
          <motion.div
            initial={shouldReduce ? {} : { scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="absolute w-28 h-28 rounded-full bg-gold/5"
          />
          {!shouldReduce && (
            <motion.div
              initial={{ scale: 1, opacity: 0 }}
              animate={{ scale: 1.5, opacity: [0, 0.5, 0] }}
              transition={{ delay: 0.65, duration: 0.7, ease: 'easeOut' }}
              className="absolute w-20 h-20 rounded-full border border-gold/50"
            />
          )}
          <motion.div
            initial={shouldReduce ? {} : { scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
            className="relative w-20 h-20 rounded-full bg-gold/10 border border-gold/30 flex items-center justify-center"
          >
            <CheckCircle size={40} className="text-gold" />
          </motion.div>
        </div>

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.2 }}
          className="space-y-2"
        >
          <h1 className="text-2xl font-semibold text-ivory">Booking Requested!</h1>
          <p className="text-platinum text-sm">
            Your appointment request has been received. We&apos;ll confirm within 24 hours.
          </p>
        </motion.div>

        {(boutiqueName || preferredDate) && (
          <motion.div
            initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.3 }}
            className="glass-light rounded-2xl p-5 text-left space-y-3"
          >
            {boutiqueName && (
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-gold" />
                <span className="text-sm text-ivory">{boutiqueName}</span>
              </div>
            )}
            {preferredDate && preferredTime && (
              <div className="flex items-center gap-3">
                <CalendarDays size={16} className="text-gold" />
                <span className="text-sm text-ivory">{preferredDate} at {preferredTime}</span>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Mail size={16} className="text-gold" />
              <span className="text-sm text-platinum">
                Confirmation sent to you and your parent/guardian
              </span>
            </div>
          </motion.div>
        )}

        <motion.div
          initial={shouldReduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 28, delay: 0.4 }}
          className="flex flex-col gap-3"
        >
          <Link href="/profile">
            <Button variant="primary" className="w-full">View My Appointments</Button>
          </Link>
          <Link href="/catalog">
            <Button variant="ghost" className="w-full">Continue Browsing</Button>
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}
