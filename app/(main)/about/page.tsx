import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'About Us | Top 10 Prom',
  description: 'Meet the team behind Top 10 Prom — Atlanta\'s luxury prom and bridal boutique network with a no-duplicate guarantee.',
}

export default function AboutPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div>
        <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-3">Our Story</p>
        <h1 className="text-4xl font-black text-ivory leading-tight mb-4">
          Built for the girl who deserves to stand out.
        </h1>
        <p className="text-platinum/70 leading-relaxed">
          Top 10 Prom was founded with one mission: make sure no two girls at the same prom show up in the same dress. We combine a curated selection of over 500 designer styles with a school-exclusive reservation system — so when you walk in, you walk in as the only one.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-ivory">What makes us different</h2>
        <ul className="space-y-3">
          {[
            'No-duplicate guarantee — your dress is school-exclusive on prom night',
            'Private one-on-one styling appointments, no crowds',
            '500+ gowns from Sherri Hill, Jovani, Mac Duggal, and more',
            '5 boutique locations across the Atlanta metro',
            'Virtual try-on so you can explore styles before your appointment',
          ].map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-platinum/70">
              <span className="w-1 h-1 rounded-full bg-gold mt-2 shrink-0" aria-hidden="true" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="glass-light rounded-2xl p-6">
        <p className="text-platinum/60 text-sm italic leading-relaxed">
          &ldquo;We believe every girl deserves to feel like the only one in the room. That&apos;s not just a tagline — it&apos;s a promise we keep, one dress at a time.&rdquo;
        </p>
        <p className="text-gold text-xs font-semibold mt-3">— The Top 10 Prom Team</p>
      </div>
    </main>
  )
}
