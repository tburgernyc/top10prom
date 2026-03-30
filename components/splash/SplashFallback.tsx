import Link from 'next/link'

export function SplashFallback() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <section className="flex flex-col items-center justify-center flex-1 px-4 text-center min-h-screen">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-light rounded-full text-xs text-gold font-medium mb-4">
            <span aria-hidden="true">✦</span>
            <span>No-Duplicate Dress Guarantee</span>
            <span aria-hidden="true">✦</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-ivory leading-tight tracking-tight">
            Your Perfect Dress.{' '}
            <span className="text-gold">Only Yours.</span>
          </h1>
          <p className="text-lg md:text-xl text-platinum max-w-xl mx-auto">
            Discover luxury prom and bridal gowns at Top 10 Prom boutiques.
            We guarantee no one else at your event will wear the same dress.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link
              href="/catalog"
              className="px-8 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 transition-all"
            >
              Browse Dresses
            </Link>
            <Link
              href="/home"
              className="px-8 py-4 glass-light text-ivory font-semibold rounded-xl hover:bg-white/10 transition-all"
            >
              Explore
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 border-t border-white/10">
        <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '500+', label: 'Exclusive Designs' },
            { value: '50+', label: 'Boutique Locations' },
            { value: '10K+', label: 'Happy Customers' },
            { value: '100%', label: 'No Duplicate Guarantee' },
          ].map((stat) => (
            <div key={stat.label} className="space-y-1">
              <div className="text-3xl font-bold text-gold">{stat.value}</div>
              <div className="text-sm text-platinum">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
