import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/components/ui/Table'

function renderTable() {
  return render(
    <Table>
      <TableHead>
        <TableRow>
          <TableHeader>Name</TableHeader>
          <TableHeader>Status</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        <TableRow>
          <TableCell>Alice</TableCell>
          <TableCell>Active</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bob</TableCell>
          <TableCell>Inactive</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  )
}

describe('Table', () => {
  it('renders a table element', () => {
    renderTable()
    expect(screen.getByRole('table')).toBeInTheDocument()
  })

  it('renders column headers', () => {
    renderTable()
    expect(screen.getByRole('columnheader', { name: 'Name' })).toBeInTheDocument()
    expect(screen.getByRole('columnheader', { name: 'Status' })).toBeInTheDocument()
  })

  it('renders all rows including header row', () => {
    renderTable()
    expect(screen.getAllByRole('row')).toHaveLength(3) // 1 header + 2 body
  })

  it('renders cell content', () => {
    renderTable()
    expect(screen.getByRole('cell', { name: 'Alice' })).toBeInTheDocument()
    expect(screen.getByRole('cell', { name: 'Bob' })).toBeInTheDocument()
  })

  it('TableHeader has scope="col"', () => {
    renderTable()
    const th = screen.getByRole('columnheader', { name: 'Name' })
    expect(th).toHaveAttribute('scope', 'col')
  })

  it('wraps in a scrollable div', () => {
    const { container } = renderTable()
    expect(container.firstChild).toHaveClass('overflow-x-auto')
  })

  it('merges custom className on Table', () => {
    render(<Table className="mt-4"><tbody /></Table>)
    expect(screen.getByRole('table')).toHaveClass('mt-4')
  })
})
