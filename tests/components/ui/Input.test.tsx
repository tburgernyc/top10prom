import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Input from '@/components/ui/Input'

describe('Input', () => {
  it('renders without a label', () => {
    render(<Input placeholder="Enter text" />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label and associates it with the input', () => {
    render(<Input label="Email" />)
    const input = screen.getByLabelText('Email')
    expect(input).toBeInTheDocument()
  })

  it('shows error message and sets aria-invalid', () => {
    render(<Input label="Email" error="Required" />)
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows hint when no error', () => {
    render(<Input label="Email" hint="We will never spam you" />)
    expect(screen.getByText('We will never spam you')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(<Input label="Email" error="Required" hint="We will never spam you" />)
    expect(screen.queryByText('We will never spam you')).not.toBeInTheDocument()
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })

  it('links input to error via aria-describedby', () => {
    render(<Input label="Email" error="Bad email" />)
    const input = screen.getByRole('textbox')
    const errorId = input.getAttribute('aria-describedby')
    expect(errorId).toBeTruthy()
    expect(document.getElementById(errorId!)).toHaveTextContent('Bad email')
  })

  it('passes additional props to the input', () => {
    render(<Input placeholder="Search..." data-testid="search-input" />)
    expect(screen.getByTestId('search-input')).toHaveAttribute('placeholder', 'Search...')
  })
})
