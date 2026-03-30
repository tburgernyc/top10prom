import { forwardRef } from 'react'

export interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label?: string
  error?: string | undefined
  hint?: string | undefined
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-platinum"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={[
            'w-full px-4 py-2.5 rounded-xl',
            'bg-white/5 border text-ivory',
            'placeholder:text-white/30',
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
            error ? `${inputId}-error` : hint ? `${inputId}-hint` : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${inputId}-hint`} className="text-xs text-white/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
