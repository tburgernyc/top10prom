import type { Metadata } from 'next'
import WalkInForm from './WalkInForm'

export const metadata: Metadata = { title: 'Walk-In Registration' }

export default function WalkInPage() {
  return (
    <div className="p-4 md:p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold text-ivory mb-6">
        Register Walk-In Customer
      </h1>
      <WalkInForm />
    </div>
  )
}
