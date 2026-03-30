import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') redirect('/unauthorized')

  return (
    <div className="flex min-h-screen">
      <aside className="w-56 glass-light border-r border-white/10 p-4 hidden md:flex flex-col gap-2">
        <div className="px-3 py-2 mb-4">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest">
            Super Admin
          </span>
        </div>
        {[
          { href: '/saas/admin', label: 'Dashboard' },
          { href: '/saas/admin/stores', label: 'Stores' },
          { href: '/saas/admin/inventory', label: 'Inventory' },
          { href: '/saas/admin/billing', label: 'Billing' },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="px-3 py-2 rounded-lg text-sm text-platinum hover:text-ivory hover:bg-white/5 transition-colors"
          >
            {item.label}
          </Link>
        ))}
      </aside>
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
