import type { Metadata } from 'next'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { SkeletonCard } from '@/components/ui/Skeleton'
import type { Dress } from '@/types/index'
import CatalogClient from './CatalogClient'

export const metadata: Metadata = {
  title: 'Catalog | Top 10 Prom',
  description: 'Browse our collection of prom and wedding dresses.',
}

export default async function CatalogPage() {
  const supabase = await createClient()
  const { data: dressRows } = await supabase
    .from('dresses')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
  const dresses = (dressRows ?? []) as Dress[]

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-ivory mb-2">
        Dress Catalog
      </h1>
      <p className="text-platinum text-sm mb-6">
        Find your perfect look for prom or your wedding day.
      </p>

      <Suspense
        fallback={
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        }
      >
        <CatalogClient dresses={dresses} />
      </Suspense>
    </main>
  )
}
