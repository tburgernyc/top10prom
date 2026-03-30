import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Skeleton, { SkeletonCard, SkeletonText } from '@/components/ui/Skeleton'

describe('Skeleton', () => {
  it('renders with role=status and aria-busy=true', () => {
    render(<Skeleton />)
    const el = screen.getByRole('status')
    expect(el).toHaveAttribute('aria-busy', 'true')
  })

  it('has shimmer class', () => {
    render(<Skeleton />)
    expect(screen.getByRole('status').className).toContain('skeleton-shimmer')
  })

  it('uses min-h — NOT a fixed h- class', () => {
    render(<Skeleton />)
    const className = screen.getByRole('status').className
    // Must contain min-h (prevents layout shift)
    expect(className).toContain('min-h')
    // Must NOT contain a fixed height token like h-[120px]
    const hasFixedHeight = className.split(' ').some((token) => {
      return token.startsWith('h-[') || (token.startsWith('h-') && !token.startsWith('h-full') && !token.startsWith('h-auto'))
    })
    expect(hasFixedHeight).toBe(false)
  })

  it('accepts custom minHeight', () => {
    render(<Skeleton minHeight="min-h-[200px]" />)
    expect(screen.getByRole('status').className).toContain('min-h-[200px]')
  })

  it('SkeletonCard renders without crashing', () => {
    render(<SkeletonCard />)
    expect(screen.getAllByRole('status').length).toBeGreaterThan(0)
  })

  it('SkeletonText renders correct number of lines', () => {
    render(<SkeletonText lines={5} />)
    expect(screen.getAllByRole('status').length).toBe(5)
  })
})
