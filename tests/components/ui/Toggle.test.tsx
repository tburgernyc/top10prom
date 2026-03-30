import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Toggle from '@/components/ui/Toggle'

describe('Toggle', () => {
  it('renders with label', () => {
    render(<Toggle label="Dark mode" checked={false} onChange={() => {}} />)
    expect(screen.getByText('Dark mode')).toBeInTheDocument()
  })

  it('has role="switch"', () => {
    render(<Toggle label="Notifications" checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toBeInTheDocument()
  })

  it('reflects unchecked state via aria-checked', () => {
    render(<Toggle label="Auto-confirm" checked={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('reflects checked state via aria-checked', () => {
    render(<Toggle label="Auto-confirm" checked onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('calls onChange with toggled value on click', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Auto-confirm" checked={false} onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when currently checked', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Toggle label="Auto-confirm" checked onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })

  it('is disabled when disabled prop is set', () => {
    render(<Toggle label="Locked" checked={false} onChange={() => {}} disabled />)
    expect(screen.getByRole('switch')).toBeDisabled()
  })

  it('renders description text', () => {
    render(
      <Toggle
        label="Auto-confirm"
        checked={false}
        onChange={() => {}}
        description="Automatically confirm appointments"
      />
    )
    expect(screen.getByText('Automatically confirm appointments')).toBeInTheDocument()
  })
})
