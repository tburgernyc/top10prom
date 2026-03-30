import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Alert from '@/components/ui/Alert'

describe('Alert', () => {
  it('renders children', () => {
    render(<Alert>Something went wrong.</Alert>)
    expect(screen.getByText('Something went wrong.')).toBeInTheDocument()
  })

  it('has role="alert"', () => {
    render(<Alert>Message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Alert title="Heads up">Please review your booking.</Alert>)
    expect(screen.getByText('Heads up')).toBeInTheDocument()
    expect(screen.getByText('Please review your booking.')).toBeInTheDocument()
  })

  it('defaults to info variant (blue classes)', () => {
    render(<Alert>Info</Alert>)
    expect(screen.getByRole('alert').className).toContain('bg-blue-500/10')
  })

  it('applies success variant classes', () => {
    render(<Alert variant="success">Done</Alert>)
    expect(screen.getByRole('alert').className).toContain('bg-emerald-500/10')
  })

  it('applies warning variant classes', () => {
    render(<Alert variant="warning">Careful</Alert>)
    expect(screen.getByRole('alert').className).toContain('bg-amber-500/10')
  })

  it('applies danger variant classes', () => {
    render(<Alert variant="danger">Error</Alert>)
    expect(screen.getByRole('alert').className).toContain('bg-rose-500/10')
  })

  it('renders dismiss button when onDismiss is provided', () => {
    render(<Alert onDismiss={() => {}}>Dismissable</Alert>)
    expect(screen.getByRole('button', { name: 'Dismiss alert' })).toBeInTheDocument()
  })

  it('calls onDismiss when dismiss button is clicked', async () => {
    const user = userEvent.setup()
    const onDismiss = vi.fn()
    render(<Alert onDismiss={onDismiss}>Dismissable</Alert>)
    await user.click(screen.getByRole('button', { name: 'Dismiss alert' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('does not render dismiss button when onDismiss is absent', () => {
    render(<Alert>Permanent</Alert>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
