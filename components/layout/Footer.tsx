import Link from 'next/link'

function InstagramIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TikTokIcon() {
  return (
    <svg width="16" height="18" viewBox="0 0 24 27" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer
      className="border-t border-white/10 pt-14 pb-8 px-4"
      style={{ background: 'var(--color-onyx)' }}
    >
      <div className="mx-auto max-w-7xl grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-8">

        {/* Col 1 — Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-bold text-xl text-gold tracking-tight">
            Top 10 Prom
          </span>
          <p className="text-sm text-platinum/70 leading-relaxed max-w-[220px]">
            Luxury prom &amp; bridal boutiques with a no-duplicate dress guarantee.
          </p>
          {/* Social links */}
          <div className="flex items-center gap-3 mt-1">
            <a
              href="#"
              aria-label="Follow us on Instagram"
              className="text-platinum/40 hover:text-gold transition-colors"
            >
              <InstagramIcon />
            </a>
            <a
              href="#"
              aria-label="Follow us on TikTok"
              className="text-platinum/40 hover:text-gold transition-colors"
            >
              <TikTokIcon />
            </a>
          </div>
          {/* Contact */}
          <a
            href="mailto:hello@top10prom.com"
            className="text-xs text-platinum/50 hover:text-gold transition-colors"
          >
            hello@top10prom.com
          </a>
        </div>

        {/* Col 2 — Shop */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-ivory/70 uppercase tracking-wider mb-1">
            Shop
          </h3>
          {[
            { label: 'Catalog', href: '/catalog' },
            { label: 'Fitting Room', href: '/fitting-room' },
            { label: 'Virtual Try-On', href: '/try-on' },
            { label: 'Book Appointment', href: '/book' },
            { label: 'Wedding', href: '/wedding' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-platinum/60 hover:text-gold transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Col 3 — Company */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-ivory/70 uppercase tracking-wider mb-1">
            Company
          </h3>
          {[
            { label: 'About Us', href: '/about' },
            { label: 'Find a Boutique', href: '/boutiques' },
            { label: 'Contact', href: '/contact' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-platinum/60 hover:text-gold transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Col 4 — Legal */}
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-semibold text-ivory/70 uppercase tracking-wider mb-1">
            Legal
          </h3>
          {[
            { label: 'Privacy Policy', href: '/privacy' },
            { label: 'Terms of Service', href: '/terms' },
            { label: 'Accessibility', href: '/accessibility' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="text-sm text-platinum/60 hover:text-gold transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

      </div>

      {/* Bottom bar */}
      <div className="mx-auto max-w-7xl mt-10 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
        <p className="text-xs text-platinum/30">
          © 2026 Top 10 Prom. All rights reserved.
        </p>
        <p className="text-xs text-platinum/25">
          Made with care for prom queens everywhere.
        </p>
      </div>
    </footer>
  )
}
