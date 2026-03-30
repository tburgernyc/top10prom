import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Pagination from '@/components/ui/Pagination'

describe('Pagination', () => {
  it('renders nothing when totalPages is 1', () => {
    const { container } = render(<Pagination page={1} totalPages={1} onChange={() => {}} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders nav with aria-label', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('navigation', { name: 'Pagination' })).toBeInTheDocument()
  })

  it('renders previous and next buttons', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Next page' })).toBeInTheDocument()
  })

  it('disables Previous on first page', () => {
    render(<Pagination page={1} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Previous page' })).toBeDisabled()
  })

  it('disables Next on last page', () => {
    render(<Pagination page={5} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Next page' })).toBeDisabled()
  })

  it('calls onChange with page - 1 on Previous click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Previous page' }))
    expect(onChange).toHaveBeenCalledWith(2)
  })

  it('calls onChange with page + 1 on Next click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination page={3} totalPages={5} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Next page' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('calls onChange with the target page on page button click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    // page=3, totalPages=10 → window renders [1, 2, 3, 4, …, 10], so Page 4 exists
    render(<Pagination page={3} totalPages={10} onChange={onChange} />)
    await user.click(screen.getByRole('button', { name: 'Page 4' }))
    expect(onChange).toHaveBeenCalledWith(4)
  })

  it('marks current page with aria-current="page"', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page')
  })

  it('does not mark other pages as current', () => {
    render(<Pagination page={2} totalPages={5} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Page 1' })).not.toHaveAttribute('aria-current')
  })

  it('renders ellipsis for skipped pages', () => {
    render(<Pagination page={5} totalPages={10} onChange={() => {}} />)
    // Should have at least one ellipsis rendered
    expect(screen.getAllByText('…').length).toBeGreaterThanOrEqual(1)
  })

  it('always renders first and last page buttons', () => {
    render(<Pagination page={5} totalPages={10} onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Page 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Page 10' })).toBeInTheDocument()
  })
})
