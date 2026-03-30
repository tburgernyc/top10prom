import type { ReadonlyHeaders } from 'next/dist/server/web/spec-extension/adapters/headers'

/**
 * Extract a reliable client IP for rate-limiting.
 *
 * Prefers `x-real-ip` (set by Vercel's infrastructure and not spoofable by clients)
 * over `x-forwarded-for` (which clients can prepend arbitrary values to).
 * Falls back to 127.0.0.1 in local/CI environments where neither header is present.
 */
export function getClientIp(h: ReadonlyHeaders): string {
  return (
    h.get('x-real-ip') ??
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    '127.0.0.1'
  )
}
