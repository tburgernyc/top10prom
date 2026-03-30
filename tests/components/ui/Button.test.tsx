import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Button from '@/components/ui/Button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled and shows spinner when loading', () => {
    render(<Button loading>Loading</Button>)
    const btn = screen.getByRole('button')
    expect(btn).toBeDisabled()
    // Loader icon should be present (lucide Loader2)
    expect(btn.querySelector('svg')).toBeTruthy()
  })

  it('fires onClick when clicked and not disabled', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<Button onClick={() => { clicked = true }}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(clicked).toBe(true)
  })

  it('does not fire onClick when disabled', async () => {
    const user = userEvent.setup()
    let clicked = false
    render(<Button disabled onClick={() => { clicked = true }}>Click</Button>)
    await user.click(screen.getByRole('button'))
    expect(clicked).toBe(false)
  })

  it('applies variant classes — primary has gold background', () => {
    render(<Button variant="primary">Primary</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-gold')
  })

  it('applies variant classes — danger has rose background', () => {
    render(<Button variant="danger">Danger</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('bg-rose-600')
  })

  it('applies size classes — lg has larger padding', () => {
    render(<Button size="lg">Large</Button>)
    const btn = screen.getByRole('button')
    expect(btn.className).toContain('px-7')
  })
})
