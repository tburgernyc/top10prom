import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Radio from '@/components/ui/Radio'

describe('Radio', () => {
  it('renders with a label', () => {
    render(<Radio label="Option A" name="group" />)
    expect(screen.getByLabelText('Option A')).toBeInTheDocument()
  })

  it('is a radio input', () => {
    render(<Radio label="Option A" name="group" />)
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('is unchecked by default', () => {
    render(<Radio label="Option A" name="group" />)
    expect(screen.getByRole('radio')).not.toBeChecked()
  })

  it('can be checked', async () => {
    const user = userEvent.setup()
    render(<Radio label="Option A" name="group" />)
    await user.click(screen.getByRole('radio'))
    expect(screen.getByRole('radio')).toBeChecked()
  })

  it('renders hint text', () => {
    render(<Radio label="Express" name="shipping" hint="2-3 business days" />)
    expect(screen.getByText('2-3 business days')).toBeInTheDocument()
  })

  it('links hint via aria-describedby', () => {
    render(<Radio label="Express" name="shipping" hint="2-3 days" />)
    const radio = screen.getByRole('radio')
    const hintId = radio.getAttribute('aria-describedby')
    expect(hintId).toBeTruthy()
    expect(document.getElementById(hintId!)).toHaveTextContent('2-3 days')
  })

  it('is disabled when disabled prop is set', () => {
    render(<Radio label="Unavailable" name="group" disabled />)
    expect(screen.getByRole('radio')).toBeDisabled()
  })

  it('generates unique ids for same label in different groups', () => {
    render(
      <>
        <Radio label="Yes" name="question1" />
        <Radio label="Yes" name="question2" />
      </>
    )
    const radios = screen.getAllByRole('radio')
    expect(radios[0]!.id).not.toBe(radios[1]!.id)
  })
})
