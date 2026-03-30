import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Tabs, TabList, Tab, TabPanel } from '@/components/ui/Tabs'

function renderTabs() {
  return render(
    <Tabs defaultValue="a">
      <TabList aria-label="Test tabs">
        <Tab value="a">Tab A</Tab>
        <Tab value="b">Tab B</Tab>
        <Tab value="c">Tab C</Tab>
      </TabList>
      <TabPanel value="a">Panel A</TabPanel>
      <TabPanel value="b">Panel B</TabPanel>
      <TabPanel value="c">Panel C</TabPanel>
    </Tabs>
  )
}

describe('Tabs', () => {
  it('renders tablist and tabs', () => {
    renderTabs()
    expect(screen.getByRole('tablist')).toBeInTheDocument()
    expect(screen.getAllByRole('tab')).toHaveLength(3)
  })

  it('shows the default panel', () => {
    renderTabs()
    expect(screen.getByText('Panel A')).toBeInTheDocument()
    expect(screen.queryByText('Panel B')).not.toBeInTheDocument()
  })

  it('switches panel on tab click', async () => {
    const user = userEvent.setup()
    renderTabs()
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    expect(screen.getByText('Panel B')).toBeInTheDocument()
    expect(screen.queryByText('Panel A')).not.toBeInTheDocument()
  })

  it('marks active tab with aria-selected="true"', () => {
    renderTabs()
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('aria-selected', 'false')
  })

  it('updates aria-selected on click', async () => {
    const user = userEvent.setup()
    renderTabs()
    await user.click(screen.getByRole('tab', { name: 'Tab C' }))
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tab', { name: 'Tab A' })).toHaveAttribute('aria-selected', 'false')
  })

  it('navigates right with ArrowRight key', async () => {
    const user = userEvent.setup()
    renderTabs()
    screen.getByRole('tab', { name: 'Tab A' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab B' }))
  })

  it('navigates left with ArrowLeft key', async () => {
    const user = userEvent.setup()
    renderTabs()
    await user.click(screen.getByRole('tab', { name: 'Tab B' }))
    screen.getByRole('tab', { name: 'Tab B' }).focus()
    await user.keyboard('{ArrowLeft}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }))
  })

  it('wraps ArrowRight from last to first', async () => {
    const user = userEvent.setup()
    renderTabs()
    await user.click(screen.getByRole('tab', { name: 'Tab C' }))
    screen.getByRole('tab', { name: 'Tab C' }).focus()
    await user.keyboard('{ArrowRight}')
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: 'Tab A' }))
  })

  it('panel has correct aria-labelledby pointing to its tab', () => {
    renderTabs()
    const tabA = screen.getByRole('tab', { name: 'Tab A' })
    const panelA = screen.getByRole('tabpanel')
    expect(panelA.getAttribute('aria-labelledby')).toBe(tabA.id)
  })

  it('non-active tabs have tabIndex -1', () => {
    renderTabs()
    expect(screen.getByRole('tab', { name: 'Tab B' })).toHaveAttribute('tabindex', '-1')
    expect(screen.getByRole('tab', { name: 'Tab C' })).toHaveAttribute('tabindex', '-1')
  })
})
