import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | Top 10 Prom',
  description: 'Terms and conditions for using Top 10 Prom services and booking appointments.',
}

export default function TermsPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-ivory mb-2">Terms of Service</h1>
        <p className="text-platinum/50 text-sm">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-sm text-platinum/70 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Appointments & Reservations</h2>
          <p>
            Styling appointments are complimentary. Dress reservations require a deposit at the time of booking. Deposits are applied to your final purchase. Cancellations made less than 24 hours before your appointment may forfeit the deposit.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">No-Duplicate Guarantee</h2>
          <p>
            The no-duplicate guarantee applies to confirmed reservations at a specific boutique location for a specific school and prom event date. The guarantee is school-specific and event-date-specific. Top 10 Prom is not responsible for duplicates arising from purchases at other retailers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Returns & Exchanges</h2>
          <p>
            All sales are final on special-order gowns. In-stock items may be exchanged within 7 days of purchase with the original receipt. Alterations are non-refundable.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Contact Us</h2>
          <p>
            Questions about these terms? Email us at{' '}
            <a href="mailto:hello@top10prom.com" className="text-gold hover:text-gold/80 transition-colors">
              hello@top10prom.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
