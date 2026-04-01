const STATS = [
  { value: '500+', label: 'Exclusive Designs' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '100%', label: 'No-Duplicate Guarantee' },
  { value: '5',    label: 'GA Boutique Locations' },
]

export default function StatsBar() {
  return (
    <section className="py-12 border-y border-white/10" aria-label="Key stats">
      <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        {STATS.map((stat) => (
          <div key={stat.label} className="space-y-1">
            <div className="text-3xl font-black text-gold">{stat.value}</div>
            <div className="text-sm text-platinum">{stat.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
