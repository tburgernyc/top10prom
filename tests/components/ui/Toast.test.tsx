import { describe, it, expect, vi } from 'vitest'
import { render, screen, act, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ToastProvider, useToast } from '@/components/ui/Toast'

function ToastTrigger({ type }: { type?: 'success' | 'error' | 'info' }) {
  const { toast } = useToast()
  return (
    <button onClick={() => toast('Test message', type)}>
      Show toast
    </button>
  )
}

function renderWithProvider(type?: 'success' | 'error' | 'info') {
  return render(
    <ToastProvider>
      <ToastTrigger {...(type !== undefined ? { type } : {})} />
    </ToastProvider>
  )
}

describe('Toast', () => {
  it('shows a toast on trigger', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await user.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByText('Test message')).toBeInTheDocument()
  })

  it('shows success toast with correct role', async () => {
    const user = userEvent.setup()
    renderWithProvider('success')
    await user.click(screen.getByRole('button'))
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('dismisses toast when dismiss button clicked', async () => {
    const user = userEvent.setup()
    renderWithProvider()
    await user.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByText('Test message')).toBeInTheDocument()
    await user.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
  })

  it('auto-dismisses after 4.5 seconds', async () => {
    vi.useFakeTimers()
    renderWithProvider()
    fireEvent.click(screen.getByRole('button', { name: 'Show toast' }))
    expect(screen.getByText('Test message')).toBeInTheDocument()
    await act(async () => { vi.advanceTimersByTime(4600) })
    expect(screen.queryByText('Test message')).not.toBeInTheDocument()
    vi.useRealTimers()
  })

  it('throws when useToast is used outside provider', () => {
    function Bad() {
      useToast()
      return null
    }
    expect(() => render(<Bad />)).toThrow('useToast must be used within ToastProvider')
  })
})
