import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'

// Minimal interface matching how callers use ratelimits: `const { success } = await x.limit(ip)`
interface RatelimitLike {
  limit(identifier: string): Promise<{ success: boolean }>
}

// Graceful degradation when Redis env vars are absent (local dev, CI, preview builds).
// All requests are allowed through — rate limiting is best-effort, not load-bearing for
// correctness. Set UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN in production.
const noop: RatelimitLike = {
  limit: async () => ({ success: true }),
}

function createRatelimit(
  limiter: ConstructorParameters<typeof Ratelimit>[0]['limiter'],
  prefix: string
): RatelimitLike {
  const url = process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return noop

  const redis = new Redis({ url, token })
  return new Ratelimit({ redis, limiter, analytics: true, prefix })
}

/** 10 AI requests per minute per IP — protects Gemini API costs */
export const aiRatelimit = createRatelimit(
  Ratelimit.slidingWindow(10, '1 m'),
  'top10prom:ai'
)

/** 5 booking submissions per hour per IP — prevents spam */
export const bookingRatelimit = createRatelimit(
  Ratelimit.fixedWindow(5, '1 h'),
  'top10prom:booking'
)

/** 60 general API requests per minute per IP */
export const apiRatelimit = createRatelimit(
  Ratelimit.slidingWindow(60, '1 m'),
  'top10prom:api'
)
