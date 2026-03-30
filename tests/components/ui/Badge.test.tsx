import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Badge from '@/components/ui/Badge'

describe('Badge', () => {
  it('renders children', () => {
    render(<Badge>New</Badge>)
    expect(screen.getByText('New')).toBeInTheDocument()
  })

  it('defaults to neutral variant', () => {
    render(<Badge>Tag</Badge>)
    expect(screen.getByText('Tag').className).toContain('text-slate-300')
  })

  it('applies gold variant classes', () => {
    render(<Badge variant="gold">Gold</Badge>)
    expect(screen.getByText('Gold').className).toContain('text-gold')
  })

  it('applies success variant classes', () => {
    render(<Badge variant="success">Active</Badge>)
    expect(screen.getByText('Active').className).toContain('text-emerald-300')
  })

  it('applies danger variant classes', () => {
    render(<Badge variant="danger">Error</Badge>)
    expect(screen.getByText('Error').className).toContain('text-rose-300')
  })

  it('applies warning variant classes', () => {
    render(<Badge variant="warning">Warn</Badge>)
    expect(screen.getByText('Warn').className).toContain('text-amber-300')
  })

  it('applies info variant classes', () => {
    render(<Badge variant="info">Info</Badge>)
    expect(screen.getByText('Info').className).toContain('text-blue-300')
  })

  it('applies platinum variant classes', () => {
    render(<Badge variant="platinum">Plat</Badge>)
    expect(screen.getByText('Plat').className).toContain('text-platinum')
  })

  it('merges custom className', () => {
    render(<Badge className="ml-2">Tag</Badge>)
    expect(screen.getByText('Tag').className).toContain('ml-2')
  })
})
