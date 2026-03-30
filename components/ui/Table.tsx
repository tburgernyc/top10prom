/**
 * Table — a styled wrapper around semantic <table> elements.
 *
 * Usage:
 *   <Table>
 *     <TableHead>
 *       <TableRow><TableHeader>Name</TableHeader></TableRow>
 *     </TableHead>
 *     <TableBody>
 *       <TableRow><TableCell>Alice</TableCell></TableRow>
 *     </TableBody>
 *   </Table>
 */

import type { HTMLAttributes, ThHTMLAttributes, TdHTMLAttributes } from 'react'

// ── Table (scroll wrapper + <table>) ──────────────────────────────────────────

export function Table({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-x-auto">
      <table
        className={[
          'w-full text-sm text-ivory border-collapse',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </div>
  )
}

// ── TableHead ─────────────────────────────────────────────────────────────────

export function TableHead({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={['border-b border-white/10', className].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

// ── TableBody ─────────────────────────────────────────────────────────────────

export function TableBody({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={className} {...props} />
}

// ── TableRow ──────────────────────────────────────────────────────────────────

export function TableRow({
  className = '',
  ...props
}: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={[
        'border-b border-white/5 transition-colors hover:bg-white/[0.03]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

// ── TableHeader (<th>) ────────────────────────────────────────────────────────

export function TableHeader({
  className = '',
  ...props
}: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      scope="col"
      className={[
        'px-4 py-3 text-left text-xs font-semibold text-platinum/70 uppercase tracking-wider whitespace-nowrap',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}

// ── TableCell (<td>) ──────────────────────────────────────────────────────────

export function TableCell({
  className = '',
  ...props
}: TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={[
        'px-4 py-3 text-ivory',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
}
