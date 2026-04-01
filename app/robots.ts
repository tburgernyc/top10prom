import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/saas/', '/api/', '/profile', '/fitting-room'],
    },
    sitemap: 'https://top10prom.store/sitemap.xml',
  }
}
