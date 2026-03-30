// NO 'use cache' directive here.
// This is a factory function that creates a Supabase client.
// 'use cache' belongs only on async data-fetching functions, never on client factories.
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

export function createAdminClient() {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) {
    console.warn('[Supabase Admin] SUPABASE_SERVICE_ROLE_KEY missing — admin client unavailable')
    return null
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
