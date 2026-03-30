import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Textarea from '@/components/ui/Textarea'

describe('Textarea', () => {
  it('renders without a label', () => {
    render(<Textarea placeholder="Enter notes" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label and associates it with the textarea', () => {
    render(<Textarea label="Notes" />)
    expect(screen.getByLabelText('Notes')).toBeInTheDocument()
  })

  it('shows error message and sets aria-invalid', () => {
    render(<Textarea label="Bio" error="Too short" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Too short')
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows hint when no error is present', () => {
    render(<Textarea label="Bio" hint="Max 500 characters" />)
    expect(screen.getByText('Max 500 characters')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(<Textarea label="Bio" error="Required" hint="Max 500 characters" />)
    expect(screen.queryByText('Max 500 characters')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('links textarea to error via aria-describedby', () => {
    render(<Textarea label="Bio" error="Too long" />)
    const textarea = screen.getByRole('textbox')
    const errorId = textarea.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent('Too long')
  })

  it('passes additional props to the textarea', () => {
    render(<Textarea rows={6} data-testid="notes-area" />)
    const el = screen.getByTestId('notes-area')
    expect(el.tagName).toBe('TEXTAREA')
    expect(el).toHaveAttribute('rows', '6')
  })
})
