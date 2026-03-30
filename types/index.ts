import type { Database } from './database'

// ── Convenience row types ──────────────────────────────────────────────────
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Dress = Database['public']['Tables']['dresses']['Row']
export type Boutique = Database['public']['Tables']['boutiques']['Row']
export type WishlistItem = Database['public']['Tables']['wishlist']['Row']
export type FittingRoomSession = Database['public']['Tables']['fitting_room_sessions']['Row']
export type AvailabilityInquiry = Database['public']['Tables']['availability_inquiries']['Row']
export type BoutiqueStaff = Database['public']['Tables']['boutique_staff']['Row']
export type DressInventory = Database['public']['Tables']['dress_inventory']['Row']
export type BoutiqueSettings = Database['public']['Tables']['boutique_settings']['Row']
export type DressReservation = Database['public']['Tables']['dress_reservations']['Row']
export type SocialVote = Database['public']['Tables']['social_votes']['Row']
export type PlatformAnalytic = Database['public']['Tables']['platform_analytics']['Row']
export type BridalParty = Database['public']['Tables']['bridal_parties']['Row']
export type BridalPartyMember = Database['public']['Tables']['bridal_party_members']['Row']
export type StoreStaff = Database['public']['Tables']['store_staff']['Row']
export type StoreCustomer = Database['public']['Tables']['store_customers']['Row']
export type Appointment = Database['public']['Tables']['appointments']['Row']

// ── RBAC role types ────────────────────────────────────────────────────────
export type UserRole = 'customer' | 'staff' | 'store_admin' | 'platform_admin'
export type SystemRole = 'SUPER_ADMIN' | 'USER'
export type StoreRole = 'OWNER' | 'MANAGER' | 'ASSOCIATE'

// ── Event type context ─────────────────────────────────────────────────────
export type EventType = 'prom' | 'wedding'

// ── Server Action return type (all actions use this) ──────────────────────
export type ActionState<T = void> = {
  status: 'idle' | 'success' | 'error'
  message: string
  data?: T
  fieldErrors?: Partial<Record<string, string>>
}

// ── Bridal party ───────────────────────────────────────────────────────────
export type BridalMemberRole =
  | 'bride'
  | 'maid_of_honor'
  | 'bridesmaid'
  | 'flower_girl'
  | 'mother_of_bride'
  | 'other'
export type BridalMemberStatus = 'invited' | 'confirmed' | 'fitted' | 'purchased'

export interface BridalPartyWithMembers extends BridalParty {
  members: BridalPartyMember[]
}

// ── Dress ──────────────────────────────────────────────────────────────────
export type DressEventTypes = EventType[]

export interface DressImage {
  url: string
  alt: string
  order: number
  is_primary?: boolean
}

export interface SizeChart {
  sizes: SizeEntry[]
  notes?: string
}

export interface SizeEntry {
  label: string
  bust?: number
  waist?: number
  hips?: number
  hollow_to_hem?: number
}

// ── Boutique ───────────────────────────────────────────────────────────────
export interface DayHours {
  open: string | null
  close: string | null
}

export type WeekHours = {
  monday: DayHours
  tuesday: DayHours
  wednesday: DayHours
  thursday: DayHours
  friday: DayHours
  saturday: DayHours
  sunday: DayHours
}

// ── Enriched join types ────────────────────────────────────────────────────
export interface DressWithInventory extends Dress {
  inventory: DressInventory[]
}

export interface BoutiqueWithSettings extends Boutique {
  settings: BoutiqueSettings | null
}

export interface InquiryWithDressAndBoutique extends AvailabilityInquiry {
  dress: Pick<Dress, 'id' | 'name' | 'images'>
  boutique: Pick<Boutique, 'id' | 'name' | 'slug'>
}

export interface AppointmentWithCustomer extends Appointment {
  customer_name: string | null
  customer_phone: string | null
  customer_email: string | null
}

// ── Fitting room ───────────────────────────────────────────────────────────
export interface FittingRoomDress {
  dress_id: string
  added_at: string
}

// ── Store selector ─────────────────────────────────────────────────────────
export interface BoutiqueOption {
  id: string
  name: string
  slug: string
  city: string | null
  state: string | null
  distance_miles?: number
}

// ── Duplicate check ────────────────────────────────────────────────────────
export interface DuplicateCheckResult {
  is_available: boolean
  conflicting_reservation?: Pick<DressReservation, 'school_name' | 'event_date' | 'status'>
}

// ── Booking wizard ─────────────────────────────────────────────────────────
export type BookingStep = 0 | 1 | 2 | 3 | 4 | 5

export interface BookingWizardState {
  step: BookingStep
  event_type: EventType | null
  selected_dress_id: string | null
  selected_boutique_id: string | null
  preferred_date: string | null
  preferred_time: string | null
  customer_name: string
  customer_email: string
  customer_phone: string
  parent_email: string
  parent_phone: string
  school_name: string
  event_date: string | null
  notes: string
}

// ── Clienteling segments ───────────────────────────────────────────────────
export type ClientSegment = 'all' | 'recentWalkIns' | 'noShows' | 'completed'

export interface SegmentCounts {
  all: number
  recentWalkIns: number
  noShows: number
  completed: number
}
