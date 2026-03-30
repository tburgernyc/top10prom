import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Drawer from '@/components/ui/Drawer'

describe('Drawer', () => {
  it('renders nothing when closed', () => {
    render(<Drawer open={false} onClose={() => {}}><p>Content</p></Drawer>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(<Drawer open onClose={() => {}}><p>Drawer body</p></Drawer>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Drawer body')).toBeInTheDocument()
  })

  it('renders title when provided', () => {
    render(<Drawer open onClose={() => {}} title="Filters"><p>Body</p></Drawer>)
    expect(screen.getByText('Filters')).toBeInTheDocument()
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose}><p>Body</p></Drawer>)
    await user.click(screen.getByRole('button', { name: 'Close drawer' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<Drawer open onClose={onClose}><p>Body</p></Drawer>)
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Drawer open onClose={onClose}><p>Body</p></Drawer>)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('has aria-modal="true"', () => {
    render(<Drawer open onClose={() => {}}><p>Body</p></Drawer>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })

  it('applies bottom panel classes by default', () => {
    render(<Drawer open onClose={() => {}}><p>Body</p></Drawer>)
    expect(screen.getByRole('dialog').className).toContain('bottom-0')
  })

  it('applies right panel classes when side="right"', () => {
    render(<Drawer open onClose={() => {}} side="right"><p>Body</p></Drawer>)
    expect(screen.getByRole('dialog').className).toContain('right-0')
  })
})
