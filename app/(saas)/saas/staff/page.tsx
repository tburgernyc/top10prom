import type { Metadata } from 'next'
export const metadata: Metadata = { title: 'Staff — Floor Hub' }
export default function StaffFloorPage() {
  return <div className="p-6 space-y-4"><h1 className="text-2xl font-bold text-ivory">Floor Hub</h1><p className="text-platinum">Calendar, Walk-In, and Clienteling links in the sidebar.</p></div>
}
