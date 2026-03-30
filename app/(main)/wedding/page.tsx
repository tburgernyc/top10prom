import type { Metadata } from 'next'
import Link from 'next/link'
import { BridalHero } from '@/components/wedding/BridalHero'

export const metadata: Metadata = {
  title: 'Wedding & Bridal | Top 10 Prom',
  description: 'Discover luxury bridal gowns and bridesmaid dresses at Top 10 Prom boutiques.',
}

const FEATURES = [
  {
    icon: '✦',
    title: 'Bridal Gown Collection',
    description: 'Hundreds of exclusive gowns from top designers, tried on in a private appointment.',
  },
  {
    icon: '♡',
    title: 'Bridal Party Coordinator',
    description: 'Invite your whole party, assign dresses, and track each member\'s progress.',
  },
  {
    icon: '◇',
    title: 'No-Duplicate Guarantee',
    description: 'We guarantee your gown is exclusive to your venue and date.',
  },
] as const

export default function WeddingPage() {
  return (
    <main>
      <BridalHero />

      {/* Features */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-8">
          {FEATURES.map((f) => (
            <div key={f.title} className="text-center space-y-3">
              <span className="text-3xl text-gold" aria-hidden="true">{f.icon}</span>
              <h3 className="font-semibold text-ivory">{f.title}</h3>
              <p className="text-sm text-platinum">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="max-w-md mx-auto px-4 space-y-4">
          <h2 className="text-2xl font-bold text-ivory">
            Ready to start planning?
          </h2>
          <p className="text-platinum text-sm">
            Create your bridal party profile or book a private appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/wedding/party/new"
              className="px-6 py-3 rounded-xl bg-gold text-onyx font-bold hover:brightness-110 transition-all"
            >
              Create Bridal Party
            </Link>
            <Link
              href="/catalog?event=wedding"
              className="px-6 py-3 rounded-xl glass-light text-ivory font-semibold hover:bg-white/10 transition-all"
            >
              Browse Gowns
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
