import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Top 10 Prom — Luxury Boutiques',
    short_name: 'Top 10 Prom',
    description:
      'Discover your perfect prom or wedding dress at Top 10 Prom boutiques. No-duplicate dress guarantee.',
    start_url: '/home',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#050505',
    theme_color: '#D4AF37',
    categories: ['shopping', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    screenshots: [],
  }
}
