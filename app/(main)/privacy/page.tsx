import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Top 10 Prom',
  description: 'How Top 10 Prom collects, uses, and protects your personal information.',
}

export default function PrivacyPage() {
  return (
    <main className="max-w-3xl mx-auto px-4 py-16 space-y-8">
      <div>
        <h1 className="text-3xl font-black text-ivory mb-2">Privacy Policy</h1>
        <p className="text-platinum/50 text-sm">Last updated: April 2026</p>
      </div>

      <div className="space-y-6 text-sm text-platinum/70 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Information We Collect</h2>
          <p>
            We collect information you provide when booking appointments, creating an account, or contacting us — including your name, email, phone number, school name, and appointment preferences. We also collect usage data to improve our services.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">How We Use Your Information</h2>
          <p>
            Your information is used to manage appointments, send booking confirmations, share looks with parents (when you choose to), and improve our services. We do not sell your personal information to third parties.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Data Security</h2>
          <p>
            We use industry-standard security measures including TLS encryption in transit and secure cloud storage. Your payment information is processed by our payment partners and never stored on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-ivory font-semibold text-base">Contact Us</h2>
          <p>
            For privacy questions or requests, contact us at{' '}
            <a href="mailto:hello@top10prom.com" className="text-gold hover:text-gold/80 transition-colors">
              hello@top10prom.com
            </a>.
          </p>
        </section>
      </div>
    </main>
  )
}
