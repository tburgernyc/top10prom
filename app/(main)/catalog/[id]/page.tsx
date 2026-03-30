import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import DressDetailPanel from '@/components/catalog/DressDetailPanel'
import type { Dress } from '@/types/index'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('dresses')
    .select('name')
    .eq('id', id)
    .single()
  const dress = row as Pick<Dress, 'name'> | null

  return {
    title: dress?.name ?? 'Dress Details',
  }
}

export default async function DressDetailPage({ params }: Props) {
  const { id } = await params
  const supabase = await createClient()
  const { data: row } = await supabase
    .from('dresses')
    .select('*')
    .eq('id', id)
    .single()
  const dress = row as Dress | null

  if (!dress) {
    notFound()
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <Link
        href="/catalog"
        className="inline-flex items-center gap-1.5 text-sm text-platinum hover:text-ivory transition-colors mb-8"
      >
        ← Back to catalog
      </Link>
      <DressDetailPanel dress={dress} />
    </main>
  )
}
