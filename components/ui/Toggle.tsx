'use client'

import { useReducedMotion } from 'motion/react'

export interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label: string
  /** Shown beneath the label */
  description?: string
  disabled?: boolean
  id?: string
}

export default function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  id,
}: ToggleProps) {
  const shouldReduce = useReducedMotion()
  const toggleId = id ?? label.toLowerCase().replace(/\s+/g, '-')
  const descId = description ? `${toggleId}-desc` : undefined

  return (
    <div className="flex items-start justify-between gap-4">
      <div className="flex flex-col gap-0.5">
        <label
          htmlFor={toggleId}
          className={[
            'text-sm font-medium text-ivory cursor-pointer',
            disabled ? 'opacity-50 cursor-not-allowed' : '',
          ].join(' ')}
        >
          {label}
        </label>
        {description && (
          <p id={descId} className="text-xs text-platinum/60">
            {description}
          </p>
        )}
      </div>

      <button
        role="switch"
        id={toggleId}
        type="button"
        aria-checked={checked}
        aria-label={label}
        aria-describedby={descId}
        disabled={disabled}
        onClick={() => onChange(!checked)}
        className={[
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full border-2 border-transparent',
          shouldReduce ? '' : 'transition-colors duration-200',
          checked ? 'bg-gold' : 'bg-white/15',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx',
          'disabled:opacity-50 disabled:cursor-not-allowed',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        <span
          aria-hidden="true"
          className={[
            'pointer-events-none inline-block h-4 w-4 rounded-full bg-ivory shadow',
            shouldReduce ? '' : 'transition-transform duration-200',
            checked ? 'translate-x-5' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  )
}
