import { describe, it, expect } from 'vitest'
import {
  loginSchema,
  signupSchema,
  bookingStep0Schema,
  bookingStep4Schema,
  fullBookingSchema,
  duplicateCheckSchema,
  walkInSchema,
  appointmentStatusSchema,
} from '@/lib/schemas'

describe('loginSchema', () => {
  it('accepts valid credentials', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'password123' })
    expect(result.success).toBe(true)
  })

  it('rejects invalid email', () => {
    const result = loginSchema.safeParse({ email: 'not-an-email', password: 'password123' })
    expect(result.success).toBe(false)
  })

  it('rejects short password', () => {
    const result = loginSchema.safeParse({ email: 'user@example.com', password: 'short' })
    expect(result.success).toBe(false)
  })

  it('rejects missing fields', () => {
    expect(loginSchema.safeParse({}).success).toBe(false)
  })
})

describe('signupSchema', () => {
  const valid = {
    full_name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'Securepass1',
    confirm_password: 'Securepass1',
  }

  it('accepts valid signup data', () => {
    expect(signupSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects mismatched passwords', () => {
    const result = signupSchema.safeParse({ ...valid, confirm_password: 'different' })
    expect(result.success).toBe(false)
    if (!result.success) {
      const errors = result.error.flatten().fieldErrors
      expect(errors.confirm_password).toBeDefined()
    }
  })

  it('rejects too-short name', () => {
    expect(signupSchema.safeParse({ ...valid, full_name: 'J' }).success).toBe(false)
  })
})

describe('bookingStep0Schema', () => {
  it('accepts prom', () => {
    expect(bookingStep0Schema.safeParse({ event_type: 'prom' }).success).toBe(true)
  })

  it('accepts wedding', () => {
    expect(bookingStep0Schema.safeParse({ event_type: 'wedding' }).success).toBe(true)
  })

  it('rejects invalid event type', () => {
    expect(bookingStep0Schema.safeParse({ event_type: 'birthday' }).success).toBe(false)
  })

  it('rejects missing event type', () => {
    expect(bookingStep0Schema.safeParse({}).success).toBe(false)
  })
})

describe('bookingStep4Schema — parent_email required', () => {
  const valid = {
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    parent_email: 'mom@example.com',
    school_name: 'Lincoln High',
    event_date: '2026-05-15',
  }

  it('accepts valid data', () => {
    expect(bookingStep4Schema.safeParse(valid).success).toBe(true)
  })

  it('requires parent_email — teenager protection invariant', () => {
    const { parent_email: _pe, ...withoutParent } = valid
    const result = bookingStep4Schema.safeParse(withoutParent)
    expect(result.success).toBe(false)
  })

  it('rejects invalid parent email', () => {
    expect(bookingStep4Schema.safeParse({ ...valid, parent_email: 'not-valid' }).success).toBe(false)
  })
})

describe('duplicateCheckSchema', () => {
  it('accepts valid data', () => {
    const result = duplicateCheckSchema.safeParse({
      dress_id: '123e4567-e89b-12d3-a456-426614174000',
      school_name: 'Lincoln High',
      event_date: '2026-05-15',
    })
    expect(result.success).toBe(true)
  })

  it('rejects non-UUID dress_id', () => {
    expect(duplicateCheckSchema.safeParse({
      dress_id: 'not-a-uuid',
      school_name: 'Lincoln High',
      event_date: '2026-05-15',
    }).success).toBe(false)
  })
})

describe('walkInSchema', () => {
  it('accepts minimal walk-in data', () => {
    expect(walkInSchema.safeParse({ firstName: 'Jane', lastName: 'Doe' }).success).toBe(true)
  })

  it('rejects empty first name', () => {
    expect(walkInSchema.safeParse({ firstName: '', lastName: 'Doe' }).success).toBe(false)
  })
})

describe('appointmentStatusSchema', () => {
  it('accepts valid status update', () => {
    expect(appointmentStatusSchema.safeParse({
      appointmentId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'COMPLETED',
    }).success).toBe(true)
  })

  it('rejects invalid status value', () => {
    expect(appointmentStatusSchema.safeParse({
      appointmentId: '123e4567-e89b-12d3-a456-426614174000',
      status: 'DONE',
    }).success).toBe(false)
  })

  it('accepts all valid statuses', () => {
    const statuses = ['SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'NO_SHOW', 'CANCELLED'] as const
    statuses.forEach((s) => {
      expect(appointmentStatusSchema.safeParse({
        appointmentId: '123e4567-e89b-12d3-a456-426614174000',
        status: s,
      }).success).toBe(true)
    })
  })
})
