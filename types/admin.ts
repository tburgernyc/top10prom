import type { AvailabilityInquiry, Boutique, Dress, DressInventory, DressReservation, Profile } from './index'

// ── Admin role ─────────────────────────────────────────────────────────────
export type AdminRole = 'store_admin' | 'platform_admin'

export interface AdminUser extends Profile {
  role: AdminRole
  boutique_id?: string
  boutique_name?: string
}

// ── Inquiry with full join data ────────────────────────────────────────────
export interface AdminInquiry extends AvailabilityInquiry {
  dress: Pick<Dress, 'id' | 'name' | 'images' | 'color'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
  customer?: Pick<Profile, 'id' | 'full_name' | 'email'>
}

// ── Inventory table row ────────────────────────────────────────────────────
export interface AdminInventoryRow extends DressInventory {
  dress: Pick<Dress, 'id' | 'name' | 'designer' | 'style_number' | 'color' | 'images' | 'price_cents'>
}

// ── Reservation with dress info ────────────────────────────────────────────
export interface AdminReservation extends DressReservation {
  dress: Pick<Dress, 'id' | 'name' | 'color' | 'images'>
  customer?: Pick<Profile, 'id' | 'full_name' | 'email'>
}

// ── Dashboard metrics ──────────────────────────────────────────────────────
export interface DashboardMetrics {
  today_appointments: number
  pending_inquiries: number
  active_reservations: number
  total_dresses: number
  appointments_this_week: number
  revenue_this_week_cents: number
}

// ── Analytics event types ──────────────────────────────────────────────────
export type AnalyticsEventType =
  | 'page_view'
  | 'dress_view'
  | 'add_to_fitting_room'
  | 'share_fitting_room'
  | 'inquiry_submitted'
  | 'booking_confirmed'
  | 'duplicate_check'
  | 'aria_chat_opened'

// ── Admin filter state ─────────────────────────────────────────────────────
export interface AdminFilters {
  boutique_id: string | null
  status: string | null
  date_from: string | null
  date_to: string | null
  search: string
}

// ── Staff invite ───────────────────────────────────────────────────────────
export interface StaffInvite {
  email: string
  store_id: string
  role: 'MANAGER' | 'ASSOCIATE'
}
