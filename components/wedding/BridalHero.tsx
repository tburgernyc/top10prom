import Link from 'next/link'

export function BridalHero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      {/* Background accent */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 70% 50% at 50% 40%, rgba(212,175,55,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-3xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-light rounded-full text-xs text-gold font-medium">
          <span aria-hidden="true">✦</span>
          <span>Bridal &amp; Wedding Collections</span>
          <span aria-hidden="true">✦</span>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-ivory leading-tight tracking-tight">
          Your Dream Wedding.{' '}
          <span className="text-gold">Perfectly Dressed.</span>
        </h1>

        <p className="text-lg md:text-xl text-platinum max-w-xl mx-auto">
          From bridal gowns to bridesmaid dresses, we&apos;ll help you and your entire party
          look stunning on your most important day.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Link
            href="/wedding/party/new"
            className="px-8 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 transition-all"
          >
            Plan Your Bridal Party
          </Link>
          <Link
            href="/book?event=wedding"
            className="px-8 py-4 glass-light text-ivory font-semibold rounded-xl hover:bg-white/10 transition-all"
          >
            Book Bridal Appointment
          </Link>
        </div>
      </div>
    </section>
  )
}
