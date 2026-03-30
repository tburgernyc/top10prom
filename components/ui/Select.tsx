import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

export interface SelectProps
  extends React.ComponentPropsWithoutRef<'select'> {
  label?: string
  error?: string | undefined
  hint?: string | undefined
  placeholder?: string
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  (
    { label, error, hint, id, placeholder, className = '', children, ...props },
    ref
  ) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-platinum"
          >
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full px-4 py-2.5 pr-10 rounded-xl appearance-none',
              'bg-white/5 border text-ivory',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
              error
                ? 'border-rose-500 focus:ring-rose-500'
                : 'border-white/10 hover:border-white/20',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${selectId}-error`
                : hint
                  ? `${selectId}-hint`
                  : undefined
            }
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {children}
          </select>
          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-platinum/60"
            aria-hidden="true"
          />
        </div>
        {error && (
          <p id={`${selectId}-error`} role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${selectId}-hint`} className="text-xs text-white/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
