'use client'

import { useState, useMemo, useCallback } from 'react'
import { Search, Download, MessageCircle } from 'lucide-react'
import type { CustomerWithAppointments, SegmentCounts } from './page'

type Segment = 'all' | 'recentWalkIns' | 'noShows' | 'completed'

const SEGMENT_LABELS: Record<Segment, string> = {
  all: 'All Customers',
  recentWalkIns: 'Recent Walk-ins',
  noShows: 'No-Shows',
  completed: 'Completed',
}

const STATUS_STYLES: Record<string, string> = {
  COMPLETED:   'bg-emerald-100 text-emerald-800',
  IN_PROGRESS: 'bg-blue-100   text-blue-800',
  SCHEDULED:   'bg-amber-100  text-amber-800',
  NO_SHOW:     'bg-rose-100   text-rose-800',
  CANCELLED:   'bg-slate-100  text-slate-600',
}

function getLatestAppointment(
  appts: CustomerWithAppointments['appointments']
): CustomerWithAppointments['appointments'][number] | null {
  if (!appts || appts.length === 0) return null
  return [...appts].sort(
    (a, b) =>
      new Date(b.appointment_date).getTime() -
      new Date(a.appointment_date).getTime()
  )[0] ?? null
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function exportToCsv(customers: CustomerWithAppointments[]): void {
  // Mailchimp/Klaviyo column format per spec
  const header = [
    'Email Address',
    'First Name',
    'Last Name',
    'Phone Number',
    'Last Visit',
    'Visit Status',
  ]

  const rows = customers.map((c) => {
    const latest = getLatestAppointment(c.appointments)
    return [
      c.email ?? '',
      c.first_name,
      c.last_name,
      c.phone ?? '',
      latest ? formatDate(latest.appointment_date) : '',
      latest?.status ?? '',
    ]
  })

  const csv = [header, ...rows]
    .map((row) =>
      row
        .map((cell) => `"${cell.replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n')

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `top10prom-clients-${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

interface ClientelingTableProps {
  customers: CustomerWithAppointments[]
  segmentCounts: SegmentCounts
}

export default function ClientelingTable({
  customers,
  segmentCounts,
}: ClientelingTableProps) {
  const [activeSegment, setActiveSegment] = useState<Segment>('all')
  const [search, setSearch] = useState('')

  const sevenDaysAgo = useMemo(() => {
    const d = new Date()
    d.setDate(d.getDate() - 7)
    return d
  }, [])

  const filtered = useMemo(() => {
    let list = customers

    switch (activeSegment) {
      case 'recentWalkIns':
        list = list.filter((c) =>
          c.appointments?.some(
            (a) =>
              a.appointment_type === 'WALK_IN' &&
              new Date(a.appointment_date) >= sevenDaysAgo
          )
        )
        break
      case 'noShows':
        list = list.filter((c) =>
          c.appointments?.some((a) => a.status === 'NO_SHOW')
        )
        break
      case 'completed':
        list = list.filter((c) =>
          c.appointments?.some((a) => a.status === 'COMPLETED')
        )
        break
    }

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (c) =>
          `${c.first_name} ${c.last_name}`.toLowerCase().includes(q) ||
          c.email?.toLowerCase().includes(q) ||
          c.phone?.includes(q)
      )
    }

    return list
  }, [customers, activeSegment, search, sevenDaysAgo])

  const handleExport = useCallback(() => {
    exportToCsv(filtered)
  }, [filtered])

  return (
    <div className="space-y-4">
      {/* Segment tabs + export */}
      <div className="flex flex-wrap items-center gap-2">
        {(Object.keys(SEGMENT_LABELS) as Segment[]).map((seg) => {
          const isActive = activeSegment === seg
          return (
            <button
              key={seg}
              type="button"
              onClick={() => setActiveSegment(seg)}
              className={[
                'px-4 py-2 rounded-xl text-sm font-semibold transition-all min-h-[40px] active:scale-[0.98]',
                isActive
                  ? 'bg-gold text-onyx'
                  : 'glass-light text-platinum hover:text-ivory',
              ].join(' ')}
            >
              {SEGMENT_LABELS[seg]}
              <span
                className={[
                  'ml-2 px-1.5 py-0.5 rounded-full text-xs',
                  isActive
                    ? 'bg-onyx/20 text-onyx'
                    : 'bg-white/10 text-platinum',
                ].join(' ')}
              >
                {segmentCounts[seg]}
              </span>
            </button>
          )
        })}

        <button
          type="button"
          onClick={handleExport}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-xl glass-light text-sm font-semibold text-platinum hover:text-ivory transition-colors min-h-[40px] active:scale-[0.98]"
          aria-label="Export to CSV"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-platinum pointer-events-none"
        />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or phone…"
          className="w-full h-11 pl-10 pr-4 rounded-xl bg-white/5 border border-white/10 text-ivory placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-gold/40 text-sm"
        />
      </div>

      {/* Customer list */}
      {filtered.length === 0 ? (
        <div className="glass-light rounded-2xl p-12 text-center text-platinum">
          {search
            ? `No customers match "${search}"`
            : 'No customers in this segment yet.'}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((c) => {
            const latest = getLatestAppointment(c.appointments)
            const smsUrl = c.phone
              ? `sms:${c.phone}?body=Hi ${c.first_name}, this is Top 10 Prom. How can we help you today?`
              : null

            return (
              <div
                key={c.id}
                className="glass-light rounded-2xl p-4 flex items-center gap-4"
              >
                {/* Avatar */}
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gold/20 text-base font-bold text-gold">
                  {c.first_name.charAt(0).toUpperCase()}
                  {c.last_name.charAt(0).toUpperCase()}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-ivory truncate">
                    {c.first_name} {c.last_name}
                  </p>
                  <p className="text-sm text-platinum truncate">
                    {c.email ?? c.phone ?? 'No contact info'}
                  </p>
                </div>

                {/* Latest visit + status */}
                {latest && (
                  <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                    <span
                      className={[
                        'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                        STATUS_STYLES[latest.status] ?? 'bg-slate-100 text-slate-600',
                      ].join(' ')}
                    >
                      {latest.status.replace('_', ' ')}
                    </span>
                    <span className="text-xs text-platinum">
                      {formatDate(latest.appointment_date)}
                    </span>
                  </div>
                )}

                {/* SMS button — mobile only */}
                {smsUrl && (
                  <a
                    href={smsUrl}
                    aria-label={`Text ${c.first_name}`}
                    className="flex items-center justify-center h-10 w-10 rounded-xl glass-light text-platinum hover:text-gold transition-colors active:scale-[0.98] min-h-[48px] min-w-[48px]"
                  >
                    <MessageCircle size={18} />
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
