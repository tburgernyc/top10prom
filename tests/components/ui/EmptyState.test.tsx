import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Heart } from 'lucide-react'
import EmptyState from '@/components/ui/EmptyState'

describe('EmptyState', () => {
  it('renders the title', () => {
    render(<EmptyState title="No items" />)
    expect(screen.getByText('No items')).toBeInTheDocument()
  })

  it('renders description when provided', () => {
    render(<EmptyState title="No items" description="Add something to get started." />)
    expect(screen.getByText('Add something to get started.')).toBeInTheDocument()
  })

  it('does not render description when omitted', () => {
    const { container } = render(<EmptyState title="Empty" />)
    // Only the title paragraph should be present — no secondary p
    const paragraphs = container.querySelectorAll('p')
    expect(paragraphs).toHaveLength(1)
  })

  it('renders icon when provided', () => {
    render(<EmptyState title="No likes" icon={Heart} />)
    // Lucide renders an SVG
    expect(document.querySelector('svg')).toBeInTheDocument()
  })

  it('does not render icon container when icon is omitted', () => {
    const { container } = render(<EmptyState title="Empty" />)
    expect(container.querySelector('svg')).not.toBeInTheDocument()
  })

  it('renders action slot', () => {
    render(
      <EmptyState title="No dresses" action={<button>Browse catalog</button>} />
    )
    expect(screen.getByRole('button', { name: 'Browse catalog' })).toBeInTheDocument()
  })

  it('does not render action area when action is omitted', () => {
    render(<EmptyState title="Empty" />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('merges custom className', () => {
    const { container } = render(<EmptyState title="Empty" className="py-4" />)
    expect(container.firstChild).toHaveClass('py-4')
  })
})
