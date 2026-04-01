import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { STATIC_DRESSES } from '@/lib/data/dresses'
import DressCard from '@/components/catalog/DressCard'
import type { Dress } from '@/types/index'

export default async function FeaturedDresses() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(6)

  const dresses: Dress[] =
    data && data.length > 0
      ? (data as Dress[])
      : (STATIC_DRESSES.slice(0, 6) as unknown as Dress[])

  return (
    <section className="max-w-7xl mx-auto px-4 space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-1">
            New Arrivals
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-ivory">
            Featured Dresses
          </h2>
        </div>
        <Link
          href="/catalog"
          className="shrink-0 text-sm text-gold hover:text-gold/80 transition-colors"
        >
          View all →
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {dresses.map((dress) => (
          <DressCard
            key={dress.id}
            id={dress.id}
            name={dress.name}
            designer={dress.designer}
            color={dress.color}
            price_cents={dress.price_cents}
            images={dress.images}
            is_active={dress.is_active ?? true}
          />
        ))}
      </div>
    </section>
  )
}
