import { z } from 'zod'

// ── Auth ───────────────────────────────────────────────────────────────────
export const loginSchema = z.object({
  email: z.string().email('Enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

export const signupSchema = z
  .object({
    full_name: z.string().min(2, 'Full name is required'),
    email: z.string().email('Enter a valid email address'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine((d) => d.password === d.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

export type LoginValues = z.infer<typeof loginSchema>
export type SignupValues = z.infer<typeof signupSchema>

// ── Booking wizard (step-by-step) ──────────────────────────────────────────
export const bookingStep0Schema = z.object({
  event_type: z.enum(['prom', 'wedding'], 'Select an event type'),
})

export const bookingStep1Schema = z.object({
  // dress_id is optional — customers may book to browse/discover in store
  dress_id: z.string().uuid().optional().or(z.literal('')),
})

export const bookingStep2Schema = z.object({
  boutique_id: z.string().uuid('Select a store location'),
})

export const bookingStep3Schema = z.object({
  preferred_date: z.string().min(1, 'Select a date'),
  preferred_time: z.string().min(1, 'Select a time'),
})

export const bookingStep4Schema = z.object({
  customer_name: z.string().min(2, 'Your name is required'),
  customer_email: z.string().email('Enter a valid email'),
  customer_phone: z.string().optional(),
  // parent_email is REQUIRED — teenager protection. This is a business-critical invariant.
  parent_email: z.string().email('Parent/guardian email is required'),
  parent_phone: z.string().optional(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Prom/event date is required'),
  notes: z.string().optional(),
})

export const fullBookingSchema = bookingStep0Schema
  .merge(bookingStep1Schema)
  .merge(bookingStep2Schema)
  .merge(bookingStep3Schema)
  .merge(bookingStep4Schema)

export type BookingStep0Values = z.infer<typeof bookingStep0Schema>
export type BookingStep1Values = z.infer<typeof bookingStep1Schema>
export type BookingStep2Values = z.infer<typeof bookingStep2Schema>
export type BookingStep3Values = z.infer<typeof bookingStep3Schema>
export type BookingStep4Values = z.infer<typeof bookingStep4Schema>
export type FullBookingValues = z.infer<typeof fullBookingSchema>

// ── Availability inquiry (legacy form) ────────────────────────────────────
export const availabilitySchema = z.object({
  dress_id: z.string().uuid('Invalid dress'),
  boutique_id: z.string().uuid('Select a store location'),
  customer_name: z.string().min(2, 'Your name is required'),
  customer_email: z.string().email('Enter a valid email address'),
  customer_phone: z.string().optional(),
  parent_email: z.string().email('Enter a valid parent/guardian email'),
  parent_phone: z.string().optional(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Prom date is required'),
  preferred_date: z.string().min(1, 'Preferred appointment date is required'),
  preferred_time: z.string().min(1, 'Preferred time is required'),
  notes: z.string().optional(),
})

export type AvailabilityFormValues = z.infer<typeof availabilitySchema>

// ── Admin schemas ──────────────────────────────────────────────────────────
export const updateInquiryStatusSchema = z.object({
  inquiry_id: z.string().uuid(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']),
})

export const addInventorySchema = z.object({
  boutique_id: z.string().uuid('Select a boutique'),
  dress_id: z.string().uuid('Select a dress'),
  sizes_available: z.array(z.string()).min(1, 'Select at least one size'),
  quantity: z.number().int().min(0),
})

export const updateBoutiqueSettingsSchema = z.object({
  boutique_id: z.string().uuid(),
  booking_lead_time_hours: z.number().int().min(0),
  max_daily_appointments: z.number().int().min(1),
  appointment_duration_minutes: z.number().int().min(15),
  auto_confirm_bookings: z.boolean(),
  notification_email: z.string().email().optional().or(z.literal('')),
})

// ── Staff invite (SaaS RBAC) ───────────────────────────────────────────────
export const staffInviteSchema = z.object({
  email: z.string().email('Enter a valid email'),
  role: z.enum(['MANAGER', 'ASSOCIATE']),
})

export type StaffInviteValues = z.infer<typeof staffInviteSchema>

// ── Duplicate check ────────────────────────────────────────────────────────
export const duplicateCheckSchema = z.object({
  dress_id: z.string().uuid(),
  school_name: z.string().min(2, 'School name is required'),
  event_date: z.string().min(1, 'Event date is required'),
})

export type DuplicateCheckValues = z.infer<typeof duplicateCheckSchema>

// ── Vote ───────────────────────────────────────────────────────────────────
export const voteSchema = z.object({
  share_token: z.string(),
  dress_id: z.string().uuid(),
  voter_name: z.string().min(1).default('Anonymous'),
  vote: z.enum(['up', 'down']),
})

export type VoteValues = z.infer<typeof voteSchema>

// ── Walk-in registration ───────────────────────────────────────────────────
export const walkInSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  phone: z.string().optional(),
  email: z.string().email('Enter a valid email').optional().or(z.literal('')),
  notes: z.string().optional(),
})

export type WalkInValues = z.infer<typeof walkInSchema>

// ── Appointment status update ──────────────────────────────────────────────
export const appointmentStatusSchema = z.object({
  appointmentId: z.string().uuid(),
  status: z.enum(['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED']),
  salesFeedback: z.string().optional(),
})

export type AppointmentStatusValues = z.infer<typeof appointmentStatusSchema>
