import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'
import StatsBar from '@/components/landing/StatsBar'
import FeaturedDresses from '@/components/landing/FeaturedDresses'
import NoDuplicatePromo from '@/components/landing/NoDuplicatePromo'
import TryOnPromo from '@/components/landing/TryOnPromo'
import DesignerStrip from '@/components/landing/DesignerStrip'
import TrustSection from '@/components/landing/TrustSection'

export const metadata: Metadata = {
  title: 'Home | Top 10 Prom',
}

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-16 pb-16">
      <Hero />
      <StatsBar />
      <FeaturedDresses />
      <NoDuplicatePromo />
      <TryOnPromo />
      <DesignerStrip />
      <TrustSection />
    </div>
  )
}
