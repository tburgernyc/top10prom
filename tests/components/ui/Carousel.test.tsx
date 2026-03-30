import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Carousel from '@/components/ui/Carousel'

const items = [
  <div key="a">Slide A</div>,
  <div key="b">Slide B</div>,
  <div key="c">Slide C</div>,
]

describe('Carousel', () => {
  it('renders nothing when items is empty', () => {
    const { container } = render(<Carousel items={[]} />)
    expect(container.firstChild).toBeNull()
  })

  it('renders single item without nav controls', () => {
    render(<Carousel items={[<div key="a">Only</div>]} />)
    expect(screen.getByText('Only')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Previous slide' })).not.toBeInTheDocument()
  })

  it('renders first item initially', () => {
    render(<Carousel items={items} />)
    expect(screen.getByText('Slide A')).toBeInTheDocument()
  })

  it('advances to next slide on next button click', async () => {
    const user = userEvent.setup()
    render(<Carousel items={items} />)
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText('Slide B')).toBeInTheDocument()
  })

  it('wraps from last to first on next', async () => {
    const user = userEvent.setup()
    render(<Carousel items={[<div key="a">A</div>, <div key="b">B</div>]} />)
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    expect(screen.getByText('A')).toBeInTheDocument()
  })

  it('goes to previous slide on prev button click', async () => {
    const user = userEvent.setup()
    render(<Carousel items={items} />)
    await user.click(screen.getByRole('button', { name: 'Next slide' }))
    await user.click(screen.getByRole('button', { name: 'Previous slide' }))
    expect(screen.getByText('Slide A')).toBeInTheDocument()
  })

  it('renders dot navigation buttons', () => {
    render(<Carousel items={items} />)
    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toBeInTheDocument()
  })

  it('navigates directly via dot click', async () => {
    const user = userEvent.setup()
    render(<Carousel items={items} />)
    await user.click(screen.getByRole('button', { name: 'Go to slide 3' }))
    expect(screen.getByText('Slide C')).toBeInTheDocument()
  })
})
