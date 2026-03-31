import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ServiceWorkerRegistration } from '@/components/pwa/ServiceWorkerRegistration'
import SplashVideoBackground from '@/components/ui/SplashVideoBackground'
import './globals.css'

// Resolve the canonical base URL for OG images and absolute links.
// NEXT_PUBLIC_APP_URL is set in production. VERCEL_URL is auto-injected by Vercel
// on preview deployments. Falls back to localhost for local development.
const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000')

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: 'Top 10 Prom — Luxury Prom & Bridal Boutiques',
    template: '%s | Top 10 Prom',
  },
  description:
    'Discover your perfect prom or wedding dress at Top 10 Prom. Guaranteed no-duplicate dresses. Book your private appointment today.',
  keywords: ['prom dresses', 'bridal gowns', 'boutique', 'no duplicate dress'],
  openGraph: {
    title: 'Top 10 Prom',
    description: 'Luxury prom & bridal boutiques with a no-duplicate guarantee.',
    type: 'website',
    images: [{ url: '/api/og', width: 1200, height: 630 }],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen bg-onyx text-ivory antialiased">
        <ServiceWorkerRegistration />
        <SplashVideoBackground />
        {children}
      </body>
    </html>
  )
}
