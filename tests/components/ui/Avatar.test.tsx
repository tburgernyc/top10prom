import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Avatar from '@/components/ui/Avatar'

describe('Avatar', () => {
  it('renders initials from a single-word name', () => {
    render(<Avatar name="Alice" />)
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('renders two initials from a full name', () => {
    render(<Avatar name="Jane Doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('uses only the first two words for initials', () => {
    render(<Avatar name="Mary Anne Smith" />)
    expect(screen.getByText('MA')).toBeInTheDocument()
  })

  it('uppercases initials', () => {
    render(<Avatar name="john doe" />)
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('has aria-label set to the name', () => {
    const { container } = render(<Avatar name="Jane Doe" />)
    expect(container.firstChild).toHaveAttribute('aria-label', 'Jane Doe')
  })

  it('renders an img when src is provided', () => {
    render(<Avatar name="Jane Doe" src="https://example.com/avatar.jpg" />)
    expect(screen.getByRole('img', { name: 'Jane Doe' })).toBeInTheDocument()
  })

  it('renders initials (no img) when src is null', () => {
    render(<Avatar name="Jane Doe" src={null} />)
    expect(screen.queryByRole('img')).not.toBeInTheDocument()
    expect(screen.getByText('JD')).toBeInTheDocument()
  })

  it('applies sm size classes', () => {
    const { container } = render(<Avatar name="Test" size="sm" />)
    expect(container.firstChild).toHaveClass('h-7', 'w-7')
  })

  it('applies md size classes by default', () => {
    const { container } = render(<Avatar name="Test" />)
    expect(container.firstChild).toHaveClass('h-9', 'w-9')
  })

  it('applies lg size classes', () => {
    const { container } = render(<Avatar name="Test" size="lg" />)
    expect(container.firstChild).toHaveClass('h-12', 'w-12')
  })
})
