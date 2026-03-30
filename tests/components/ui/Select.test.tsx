import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Select from '@/components/ui/Select'

describe('Select', () => {
  it('renders a select element', () => {
    render(
      <Select label="Size">
        <option value="s">Small</option>
        <option value="l">Large</option>
      </Select>
    )
    expect(screen.getByRole('combobox')).toBeInTheDocument()
  })

  it('associates label with select', () => {
    render(
      <Select label="Color">
        <option value="red">Red</option>
      </Select>
    )
    expect(screen.getByLabelText('Color')).toBeInTheDocument()
  })

  it('renders placeholder as first disabled option', () => {
    render(
      <Select label="Size" placeholder="Choose a size">
        <option value="s">Small</option>
      </Select>
    )
    const placeholder = screen.getByRole('option', { name: 'Choose a size' })
    expect(placeholder).toBeDisabled()
  })

  it('shows error message and sets aria-invalid', () => {
    render(
      <Select label="Size" error="Required">
        <option value="s">Small</option>
      </Select>
    )
    expect(screen.getByRole('alert')).toHaveTextContent('Required')
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('shows hint when no error', () => {
    render(
      <Select label="Size" hint="Choose your US size">
        <option value="s">Small</option>
      </Select>
    )
    expect(screen.getByText('Choose your US size')).toBeInTheDocument()
  })

  it('hides hint when error is present', () => {
    render(
      <Select label="Size" error="Required" hint="Choose your US size">
        <option value="s">Small</option>
      </Select>
    )
    expect(screen.queryByText('Choose your US size')).not.toBeInTheDocument()
  })

  it('renders all children options', () => {
    render(
      <Select label="Event">
        <option value="prom">Prom</option>
        <option value="wedding">Wedding</option>
      </Select>
    )
    expect(screen.getByRole('option', { name: 'Prom' })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'Wedding' })).toBeInTheDocument()
  })
})
