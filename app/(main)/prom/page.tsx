import type { Metadata } from 'next'
import Link from 'next/link'
import PromEventSetter from './PromEventSetter'

export const metadata: Metadata = {
  title: 'Prom Dresses | Top 10 Prom',
  description:
    'Discover exclusive prom dresses with our no-duplicate guarantee. One dress. One school. One night to remember.',
}

export default function PromPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <PromEventSetter />

      <div className="text-center py-16 space-y-6 max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold/30 bg-gold/5 text-gold text-sm font-medium mb-4">
          ✦ No-Duplicate Guarantee
        </div>

        <h1 className="text-4xl sm:text-5xl font-bold text-ivory leading-tight">
          Your Prom Dress,{' '}
          <span className="text-gold">Only Yours</span>
        </h1>

        <p className="text-lg text-platinum leading-relaxed">
          Every dress in our catalog is reserved exclusively for one student per school per prom.
          No awkward matching moments — just your night, your look.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/catalog?event=prom"
            className="px-8 py-3.5 rounded-xl bg-gold text-onyx font-semibold hover:opacity-90 transition-opacity text-center"
          >
            Browse Prom Dresses
          </Link>
          <Link
            href="/book"
            className="px-8 py-3.5 rounded-xl glass-light text-ivory font-semibold hover:bg-white/10 transition-colors text-center"
          >
            Book an Appointment
          </Link>
        </div>
      </div>

      {/* Why choose Top 10 Prom */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8 max-w-4xl mx-auto">
        <div className="glass-light rounded-2xl p-6 text-center space-y-3">
          <div className="text-3xl" role="img" aria-label="Exclusive designs">🎭</div>
          <h3 className="font-semibold text-ivory">500+ Exclusive Styles</h3>
          <p className="text-sm text-platinum">
            Curated collections from top designers, refreshed every season.
          </p>
        </div>
        <div className="glass-light rounded-2xl p-6 text-center space-y-3">
          <div className="text-3xl" role="img" aria-label="School exclusivity">🏫</div>
          <h3 className="font-semibold text-ivory">School-Wide Exclusivity</h3>
          <p className="text-sm text-platinum">
            We track reservations by school so your look stays yours alone.
          </p>
        </div>
        <div className="glass-light rounded-2xl p-6 text-center space-y-3">
          <div className="text-3xl" role="img" aria-label="Style consultants">👗</div>
          <h3 className="font-semibold text-ivory">Style Consultants</h3>
          <p className="text-sm text-platinum">
            Our experts help you find the perfect fit, color, and silhouette.
          </p>
        </div>
      </div>
    </main>
  )
}
