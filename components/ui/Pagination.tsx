import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface PaginationProps {
  /** Current 1-based page */
  page: number
  /** Total number of pages */
  totalPages: number
  onChange: (page: number) => void
  className?: string
}

export default function Pagination({
  page,
  totalPages,
  onChange,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  /** Build a compact window: first, last, current ±1, and ellipses */
  function buildPages(): (number | 'ellipsis')[] {
    const pages: (number | 'ellipsis')[] = []
    const delta = 1 // neighbors on each side of current

    const rangeStart = Math.max(2, page - delta)
    const rangeEnd   = Math.min(totalPages - 1, page + delta)

    pages.push(1)

    if (rangeStart > 2) pages.push('ellipsis')

    for (let i = rangeStart; i <= rangeEnd; i++) pages.push(i)

    if (rangeEnd < totalPages - 1) pages.push('ellipsis')

    if (totalPages > 1) pages.push(totalPages)

    return pages
  }

  const pages = buildPages()
  const isFirst = page === 1
  const isLast  = page === totalPages

  const btnBase = [
    'inline-flex items-center justify-center h-9 min-w-[2.25rem] px-2 rounded-lg text-sm',
    'transition-colors duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-onyx',
  ].join(' ')

  return (
    <nav
      aria-label="Pagination"
      className={['flex items-center gap-1', className].filter(Boolean).join(' ')}
    >
      {/* Previous */}
      <button
        onClick={() => onChange(page - 1)}
        disabled={isFirst}
        aria-label="Previous page"
        className={[
          btnBase,
          isFirst
            ? 'text-white/20 cursor-not-allowed'
            : 'text-platinum hover:text-ivory hover:bg-white/5',
        ].join(' ')}
      >
        <ChevronLeft size={16} aria-hidden="true" />
      </button>

      {/* Page buttons */}
      {pages.map((p, idx) =>
        p === 'ellipsis' ? (
          <span
            key={`ellipsis-${idx}`}
            aria-hidden="true"
            className="inline-flex h-9 w-9 items-center justify-center text-platinum/40 text-sm select-none"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            onClick={() => onChange(p)}
            aria-label={`Page ${p}`}
            aria-current={p === page ? 'page' : undefined}
            className={[
              btnBase,
              p === page
                ? 'bg-gold text-onyx font-semibold'
                : 'text-platinum hover:text-ivory hover:bg-white/5',
            ].join(' ')}
          >
            {p}
          </button>
        )
      )}

      {/* Next */}
      <button
        onClick={() => onChange(page + 1)}
        disabled={isLast}
        aria-label="Next page"
        className={[
          btnBase,
          isLast
            ? 'text-white/20 cursor-not-allowed'
            : 'text-platinum hover:text-ivory hover:bg-white/5',
        ].join(' ')}
      >
        <ChevronRight size={16} aria-hidden="true" />
      </button>
    </nav>
  )
}
