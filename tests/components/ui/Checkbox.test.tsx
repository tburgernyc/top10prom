import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Checkbox from '@/components/ui/Checkbox'

describe('Checkbox', () => {
  it('renders with a label', () => {
    render(<Checkbox label="Accept terms" />)
    expect(screen.getByLabelText('Accept terms')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Checkbox label="Subscribe" />)
    expect(screen.getByRole('checkbox')).not.toBeChecked()
  })

  it('can be checked', async () => {
    const user = userEvent.setup()
    render(<Checkbox label="Subscribe" />)
    await user.click(screen.getByRole('checkbox'))
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('renders as controlled checked', () => {
    render(<Checkbox label="Agree" checked onChange={() => {}} />)
    expect(screen.getByRole('checkbox')).toBeChecked()
  })

  it('shows error message', () => {
    render(<Checkbox label="Agree" error="You must agree" />)
    expect(screen.getByRole('alert')).toHaveTextContent('You must agree')
  })

  it('shows hint text', () => {
    render(<Checkbox label="Subscribe" hint="Optional newsletter" />)
    expect(screen.getByText('Optional newsletter')).toBeInTheDocument()
  })

  it('is disabled when disabled prop is set', () => {
    render(<Checkbox label="Locked" disabled />)
    expect(screen.getByRole('checkbox')).toBeDisabled()
  })

  it('sets aria-invalid when error is present', () => {
    render(<Checkbox label="Agree" error="Required" />)
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-invalid', 'true')
  })
})
