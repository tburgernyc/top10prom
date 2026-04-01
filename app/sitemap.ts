import type { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://top10prom.store',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: 'https://top10prom.store/home',
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: 'https://top10prom.store/catalog',
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: 'https://top10prom.store/book',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://top10prom.store/boutiques',
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: 'https://top10prom.store/try-on',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://top10prom.store/wedding',
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: 'https://top10prom.store/about',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: 'https://top10prom.store/contact',
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ]
}
