import { forwardRef } from 'react'

export interface TextareaProps
  extends React.ComponentPropsWithoutRef<'textarea'> {
  label?: string
  error?: string | undefined
  hint?: string | undefined
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, id, className = '', ...props }, ref) => {
    const textareaId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={textareaId}
            className="text-sm font-medium text-platinum"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          rows={4}
          className={[
            'w-full px-4 py-2.5 rounded-xl resize-y',
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
            error
              ? `${textareaId}-error`
              : hint
                ? `${textareaId}-hint`
                : undefined
          }
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} role="alert" className="text-xs text-rose-400">
            {error}
          </p>
        )}
        {hint && !error && (
          <p id={`${textareaId}-hint`} className="text-xs text-white/40">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Textarea.displayName = 'Textarea'

export default Textarea
