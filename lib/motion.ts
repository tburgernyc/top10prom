/**
 * Shared Motion spring presets.
 * Import these instead of inlining spring params in every animated component.
 */

/** General-purpose spring — buttons, modals, drawers, toasts */
export const SPRING_STANDARD = {
  type: 'spring',
  stiffness: 300,
  damping: 28,
} as const

/** Snappier spring — tooltips, small UI feedback */
export const SPRING_SNAPPY = {
  type: 'spring',
  stiffness: 400,
  damping: 30,
} as const

/** Gentle spring — whileInView scroll-reveal, staggered list entries */
export const SPRING_GENTLE = {
  type: 'spring',
  stiffness: 260,
  damping: 26,
} as const
