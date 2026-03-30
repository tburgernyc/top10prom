import { forwardRef } from 'react'

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string
  error?: string | undefined
  hint?: string | undefined
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const checkId = id ?? label.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={checkId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <input
            ref={ref}
            type="checkbox"
            id={checkId}
            className={[
              'mt-0.5 h-4 w-4 shrink-0 rounded',
              'border border-white/20 bg-white/5',
              'appearance-none cursor-pointer',
              'checked:bg-gold checked:border-gold',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-onyx',
              'transition-colors duration-150',
              error ? 'border-rose-500' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-invalid={!!error}
            aria-describedby={
              error
                ? `${checkId}-error`
                : hint
                  ? `${checkId}-hint`
                  : undefined
            }
            {...props}
          />
          <span className="text-sm text-ivory leading-snug group-has-[:disabled]:opacity-50">
            {label}
          </span>
        </label>
        {error && (
          <p id={`${checkId}-error`} role="alert" className="text-xs text-rose-400 ml-7">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${checkId}-hint`} className="text-xs text-white/40 ml-7">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Checkbox.displayName = 'Checkbox'

export default Checkbox
