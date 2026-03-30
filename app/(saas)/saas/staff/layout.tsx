import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function StaffLayout({
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
  const storeRole = user.app_metadata?.store_role as string | undefined

  const staffRoles = ['OWNER', 'MANAGER', 'ASSOCIATE']
  if (systemRole !== 'SUPER_ADMIN' && (!storeRole || !staffRoles.includes(storeRole))) {
    redirect('/unauthorized')
  }

  return (
    <div className="flex min-h-screen">
      {/* Tablet-optimized sidebar */}
      <aside className="w-52 glass-light border-r border-white/10 p-4 hidden md:flex flex-col gap-2">
        <div className="px-3 py-2 mb-4">
          <span className="text-xs font-semibold text-gold uppercase tracking-widest">
            Floor Staff
          </span>
          {storeRole && (
            <p className="text-[10px] text-platinum mt-0.5">{storeRole}</p>
          )}
        </div>
        {[
          { href: '/saas/staff', label: '🏠 Floor Hub' },
          { href: '/saas/staff/calendar', label: '📅 Calendar' },
          { href: '/saas/staff/walk-in', label: '🚶 Walk-In' },
          { href: '/saas/staff/clienteling', label: '👥 Clienteling' },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="px-3 py-2.5 rounded-lg text-sm text-platinum hover:text-ivory active:bg-white/10 hover:bg-white/5 transition-colors"
          >
            {item.label}
          </a>
        ))}
      </aside>
      <main className="flex-1 overflow-auto">{children}</main>
    </div>
  )
}
