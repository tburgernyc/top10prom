import type { Metadata } from 'next'
import Hero from '@/components/landing/Hero'
import StatsBar from '@/components/landing/StatsBar'
import FeaturedDresses from '@/components/landing/FeaturedDresses'
import NoDuplicatePromo from '@/components/landing/NoDuplicatePromo'
import HowItWorksSection from '@/components/landing/HowItWorksSection'
import TryOnPromo from '@/components/landing/TryOnPromo'
import DesignerStrip from '@/components/landing/DesignerStrip'
import TestimonialsSection from '@/components/landing/TestimonialsSection'
import TrustSection from '@/components/landing/TrustSection'

export const metadata: Metadata = {
  title: 'Top 10 Prom | Luxury Prom & Bridal Boutiques in Atlanta',
  description:
    'Shop 500+ exclusive prom & bridal gowns at Top 10 Prom boutiques across Atlanta. No-duplicate guarantee — your dress, only yours.',
  openGraph: {
    title: 'Top 10 Prom — Your Perfect Dress. Only Yours.',
    description:
      'Luxury prom & bridal gowns. No duplicate guarantee. 5 Atlanta boutiques.',
    url: 'https://top10prom.store/home',
    siteName: 'Top 10 Prom',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Top 10 Prom',
    description: 'Your perfect dress. Only yours.',
  },
}

export default function HomePage() {
  return (
    <div className="min-h-screen space-y-16 pb-16">
      <Hero />
      <StatsBar />
      <FeaturedDresses />
      <NoDuplicatePromo />
      <HowItWorksSection />
      <TryOnPromo />
      <DesignerStrip />
      <TestimonialsSection />
      <TrustSection />
    </div>
  )
}
