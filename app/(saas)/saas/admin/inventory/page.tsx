import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Dress, Boutique } from '@/types/index'
import Badge from '@/components/ui/Badge'

export const metadata: Metadata = { title: 'Global Inventory | Super Admin' }

interface InventoryRow {
  id: string
  boutique_id: string
  dress_id: string
  sizes_available: string[]
  quantity: number
  dresses: Pick<Dress, 'name' | 'designer' | 'style_number'> | null
  boutiques: Pick<Boutique, 'name' | 'city'> | null
}

export default async function AdminInventoryPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const systemRole = user.app_metadata?.system_role as string | undefined
  if (systemRole !== 'SUPER_ADMIN') redirect('/unauthorized')

  const { data: inventoryRows } = await supabase
    .from('dress_inventory')
    .select('id, boutique_id, dress_id, sizes_available, quantity, dresses(name, designer, style_number), boutiques(name, city)')
    .order('boutique_id')
    .limit(200)

  const inventory = (inventoryRows ?? []) as InventoryRow[]

  // Group by boutique
  const byBoutique = new Map<string, { name: string; city: string | null; items: InventoryRow[] }>()
  for (const row of inventory) {
    const boutiqueId = row.boutique_id
    if (!byBoutique.has(boutiqueId)) {
      byBoutique.set(boutiqueId, {
        name: row.boutiques?.name ?? boutiqueId,
        city: row.boutiques?.city ?? null,
        items: [],
      })
    }
    byBoutique.get(boutiqueId)!.items.push(row)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-ivory">Global Inventory</h1>
        <Badge variant="neutral">{inventory.length} SKUs</Badge>
      </div>

      {byBoutique.size === 0 ? (
        <p className="text-sm text-platinum">No inventory records found.</p>
      ) : (
        Array.from(byBoutique.entries()).map(([boutiqueId, group]) => (
          <section key={boutiqueId} className="space-y-3">
            <h2 className="text-sm font-semibold text-platinum uppercase tracking-wide">
              {group.name}{group.city ? ` — ${group.city}` : ''}
            </h2>
            <div className="glass-light rounded-2xl overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left px-4 py-2.5 text-xs text-platinum font-medium">Dress</th>
                    <th className="text-left px-4 py-2.5 text-xs text-platinum font-medium hidden sm:table-cell">Designer</th>
                    <th className="text-left px-4 py-2.5 text-xs text-platinum font-medium">Sizes</th>
                    <th className="text-right px-4 py-2.5 text-xs text-platinum font-medium">Qty</th>
                  </tr>
                </thead>
                <tbody>
                  {group.items.map((row, i) => (
                    <tr
                      key={row.id}
                      className={i % 2 === 0 ? '' : 'bg-white/[0.02]'}
                    >
                      <td className="px-4 py-2.5 text-ivory">
                        {row.dresses?.name ?? '—'}
                        {row.dresses?.style_number && (
                          <span className="text-xs text-platinum ml-1.5">
                            #{row.dresses.style_number}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-platinum hidden sm:table-cell">
                        {row.dresses?.designer ?? '—'}
                      </td>
                      <td className="px-4 py-2.5 text-platinum">
                        {(row.sizes_available as string[]).join(', ') || '—'}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <Badge variant={row.quantity > 0 ? 'success' : 'danger'}>
                          {row.quantity}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      )}
    </div>
  )
}
