import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Tooltip from '@/components/ui/Tooltip'

describe('Tooltip', () => {
  it('does not show tooltip content initially', () => {
    render(
      <Tooltip content="Helpful tip">
        <button>Hover me</button>
      </Tooltip>
    )
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on mouse enter', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Helpful tip">
        <button>Hover me</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole('button'))
    expect(screen.getByRole('tooltip')).toHaveTextContent('Helpful tip')
  })

  it('hides tooltip on mouse leave', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Helpful tip">
        <button>Hover me</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole('button'))
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.unhover(screen.getByRole('button'))
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('shows tooltip on focus', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Keyboard tip">
        <button>Focus me</button>
      </Tooltip>
    )
    await user.tab()
    expect(screen.getByRole('tooltip')).toHaveTextContent('Keyboard tip')
  })

  it('hides tooltip on blur', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Keyboard tip">
        <button>Focus me</button>
      </Tooltip>
    )
    await user.tab()
    expect(screen.getByRole('tooltip')).toBeInTheDocument()
    await user.tab()
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument()
  })

  it('sets aria-describedby on trigger when visible', async () => {
    const user = userEvent.setup()
    render(
      <Tooltip content="Description">
        <button>Trigger</button>
      </Tooltip>
    )
    await user.hover(screen.getByRole('button'))
    const btn = screen.getByRole('button')
    const tooltipId = btn.getAttribute('aria-describedby')
    expect(tooltipId).toBeTruthy()
    expect(document.getElementById(tooltipId!)).toHaveTextContent('Description')
  })
})
