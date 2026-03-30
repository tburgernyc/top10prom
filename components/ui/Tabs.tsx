'use client'

import { createContext, useContext, useId, useRef, useState } from 'react'

// ── Context ───────────────────────────────────────────────────────────────────

interface TabsContextValue {
  activeId: string
  setActiveId: (id: string) => void
  baseId: string
}

const TabsContext = createContext<TabsContextValue | null>(null)

function useTabsContext() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs subcomponents must be used inside <Tabs>')
  return ctx
}

// ── Root ──────────────────────────────────────────────────────────────────────

interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

export function Tabs({ defaultValue, children, className = '' }: TabsProps) {
  const baseId = useId()
  const [activeId, setActiveId] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeId, setActiveId, baseId }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  )
}

// ── Tab List ──────────────────────────────────────────────────────────────────

interface TabListProps {
  children: React.ReactNode
  className?: string
  'aria-label'?: string
}

export function TabList({ children, className = '', 'aria-label': ariaLabel }: TabListProps) {
  const listRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const tabs = listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]') ?? []
    const arr = Array.from(tabs)
    const focused = document.activeElement
    const idx = arr.indexOf(focused as HTMLButtonElement)
    if (idx === -1) return

    if (e.key === 'ArrowRight') {
      e.preventDefault()
      arr[(idx + 1) % arr.length]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      arr[(idx - 1 + arr.length) % arr.length]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      arr[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      arr[arr.length - 1]?.focus()
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label={ariaLabel}
      onKeyDown={handleKeyDown}
      className={[
        'flex gap-1 border-b border-white/10',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  )
}

// ── Tab Trigger ───────────────────────────────────────────────────────────────

interface TabProps {
  value: string
  children: React.ReactNode
  disabled?: boolean
}

export function Tab({ value, children, disabled = false }: TabProps) {
  const { activeId, setActiveId, baseId } = useTabsContext()
  const isActive = activeId === value

  return (
    <button
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-controls={`${baseId}-panel-${value}`}
      aria-selected={isActive}
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      onClick={() => setActiveId(value)}
      className={[
        'px-4 py-2.5 text-sm font-medium transition-colors duration-150',
        'border-b-2 -mb-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx rounded-t-sm',
        isActive
          ? 'border-gold text-ivory'
          : 'border-transparent text-platinum hover:text-ivory hover:border-white/20',
        'disabled:opacity-40 disabled:cursor-not-allowed',
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </button>
  )
}

// ── Tab Panel ─────────────────────────────────────────────────────────────────

interface TabPanelProps {
  value: string
  children: React.ReactNode
  className?: string
}

export function TabPanel({ value, children, className = '' }: TabPanelProps) {
  const { activeId, baseId } = useTabsContext()
  const isActive = activeId === value

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      hidden={!isActive}
      tabIndex={0}
      className={['focus-visible:outline-none', className].filter(Boolean).join(' ')}
    >
      {isActive ? children : null}
    </div>
  )
}
