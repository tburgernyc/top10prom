import type { Metadata } from 'next'
import { BookingWizard } from '@/components/booking/BookingWizard'

export const metadata: Metadata = {
  title: 'Book Appointment | Top 10 Prom',
  description: 'Book a private styling appointment at your nearest Top 10 Prom boutique.',
}

type Props = {
  searchParams: Promise<{ dress?: string }>
}

export default async function BookPage({ searchParams }: Props) {
  const { dress } = await searchParams
  return (
    <main className="min-h-screen py-8">
      <BookingWizard {...(dress !== undefined && { initialDressId: dress })} />
    </main>
  )
}
