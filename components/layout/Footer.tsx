import Link from 'next/link'

export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 py-12 px-4"
      style={{ background: 'var(--color-onyx)' }}
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Col 1: Wordmark + tagline */}
        <div className="flex flex-col gap-2">
          <span className="font-bold text-lg text-gold">
            Top 10 Prom
          </span>
          <p className="text-sm text-platinum">
            Luxury prom &amp; bridal boutiques with a no-duplicate guarantee.
          </p>
        </div>

        {/* Col 2: Links */}
        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-ivory uppercase tracking-wider mb-1">
            Navigate
          </h3>
          <Link
            href="/catalog"
            className="text-sm text-platinum hover:text-gold transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/fitting-room"
            className="text-sm text-platinum hover:text-gold transition-colors"
          >
            Fitting Room
          </Link>
          <Link
            href="/book"
            className="text-sm text-platinum hover:text-gold transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            href="/wedding"
            className="text-sm text-platinum hover:text-gold transition-colors"
          >
            Wedding
          </Link>
          <Link
            href="/boutiques"
            className="text-sm text-platinum hover:text-gold transition-colors"
          >
            Find a Boutique
          </Link>
        </div>

        {/* Col 3: Legal */}
        <div className="flex flex-col gap-2">
          <p className="text-sm text-platinum">
            © 2026 Top 10 Prom. All rights reserved.
          </p>
          <p className="text-sm text-platinum">
            Built with ❤️ for prom queens everywhere.
          </p>
        </div>
      </div>
    </footer>
  )
}
