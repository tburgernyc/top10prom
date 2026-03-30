import type { Metadata } from 'next'
import { VirtualTryOn } from '@/components/try-on/VirtualTryOn'

export const metadata: Metadata = {
  title: 'Virtual Try-On | Top 10 Prom',
  description: 'See how our dresses look on you with our Virtual Try-On experience.',
}

export default function TryOnPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-lg mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-ivory">Virtual Try-On</h1>
          <p className="text-sm text-platinum mt-1">
            Upload your photo and select a dress to preview your look
          </p>
        </div>
        <VirtualTryOn />
      </div>
    </main>
  )
}
