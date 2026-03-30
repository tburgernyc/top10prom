import type { Metadata } from 'next'
import FittingRoomSession from '@/components/catalog/FittingRoomSession'

export const metadata: Metadata = {
  title: 'Fitting Room | Top 10 Prom',
  description: 'Your saved dresses — try them on virtually or book an appointment.',
}

export default function FittingRoomPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-ivory mb-2">
          Your Fitting Room
        </h1>
        <p className="text-platinum mb-8">
          Save dresses from the catalog, then try them on virtually or book an appointment.
        </p>
        <FittingRoomSession />
      </div>
    </main>
  )
}
