import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Modal from '@/components/ui/Modal'

describe('Modal', () => {
  it('renders nothing when closed', () => {
    render(<Modal open={false} onClose={() => {}}><p>Content</p></Modal>)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders content when open', () => {
    render(<Modal open onClose={() => {}}><p>Hello modal</p></Modal>)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByText('Hello modal')).toBeInTheDocument()
  })

  it('renders title and associates it via aria-labelledby', () => {
    render(<Modal open onClose={() => {}} title="Confirm"><p>Body</p></Modal>)
    expect(screen.getByText('Confirm')).toBeInTheDocument()
    const dialog = screen.getByRole('dialog')
    expect(dialog).toHaveAttribute('aria-labelledby')
  })

  it('calls onClose when close button is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}><p>Body</p></Modal>)
    await user.click(screen.getByRole('button', { name: 'Close modal' }))
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when backdrop is clicked', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    const { container } = render(<Modal open onClose={onClose}><p>Body</p></Modal>)
    const backdrop = container.querySelector('[aria-hidden="true"]') as HTMLElement
    await user.click(backdrop)
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('calls onClose when Escape is pressed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal open onClose={onClose}><p>Body</p></Modal>)
    await user.keyboard('{Escape}')
    expect(onClose).toHaveBeenCalledOnce()
  })

  it('does not call onClose on Escape when closed', async () => {
    const user = userEvent.setup()
    const onClose = vi.fn()
    render(<Modal open={false} onClose={onClose}><p>Body</p></Modal>)
    await user.keyboard('{Escape}')
    expect(onClose).not.toHaveBeenCalled()
  })

  it('has aria-modal="true"', () => {
    render(<Modal open onClose={() => {}}><p>Body</p></Modal>)
    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true')
  })
})
