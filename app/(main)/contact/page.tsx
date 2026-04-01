import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Us | Top 10 Prom',
  description: 'Get in touch with Top 10 Prom — questions about appointments, dresses, or your order.',
}

export default function ContactPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-10">
      <div>
        <p className="text-xs text-gold font-semibold uppercase tracking-widest mb-3">Get in Touch</p>
        <h1 className="text-4xl font-black text-ivory leading-tight mb-4">
          We&apos;d love to hear from you.
        </h1>
        <p className="text-platinum/70 leading-relaxed">
          Have a question about an appointment, a dress, or your order? Reach out and we&apos;ll get back to you as soon as possible.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div className="glass-light rounded-2xl p-6 space-y-2">
          <p className="text-xs text-gold/70 font-semibold uppercase tracking-widest">Email</p>
          <a
            href="mailto:hello@top10prom.com"
            className="text-ivory font-semibold hover:text-gold transition-colors"
          >
            hello@top10prom.com
          </a>
          <p className="text-platinum/50 text-xs">We respond within 1 business day.</p>
        </div>

        <div className="glass-light rounded-2xl p-6 space-y-2">
          <p className="text-xs text-gold/70 font-semibold uppercase tracking-widest">Book an Appointment</p>
          <p className="text-platinum/70 text-sm">The fastest way to get help is to book a private styling session.</p>
          <Link
            href="/book"
            className="inline-flex items-center text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
          >
            Book now →
          </Link>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-ivory font-bold text-lg">Find a Location</h2>
        <p className="text-platinum/60 text-sm">
          We have boutiques across the Atlanta metro — Marietta, Alpharetta, Buckhead, Smyrna, and Kennesaw.
        </p>
        <Link
          href="/boutiques"
          className="inline-flex items-center text-sm font-semibold text-gold hover:text-gold/80 transition-colors"
        >
          View all locations →
        </Link>
      </div>
    </main>
  )
}
