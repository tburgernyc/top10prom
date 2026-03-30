import { forwardRef } from 'react'

export interface RadioProps
  extends Omit<React.ComponentPropsWithoutRef<'input'>, 'type'> {
  label: string
  hint?: string | undefined
}

/** Single radio button. Group multiple Radios with the same `name` prop. */
const Radio = forwardRef<HTMLInputElement, RadioProps>(
  ({ label, hint, id, className = '', ...props }, ref) => {
    const radioId = id ?? `${props.name ?? 'radio'}-${label.toLowerCase().replace(/\s+/g, '-')}`

    return (
      <div className="flex flex-col gap-1">
        <label
          htmlFor={radioId}
          className="flex items-start gap-3 cursor-pointer group"
        >
          <input
            ref={ref}
            type="radio"
            id={radioId}
            className={[
              'mt-0.5 h-4 w-4 shrink-0 rounded-full',
              'border border-white/20 bg-white/5',
              'appearance-none cursor-pointer',
              'checked:bg-gold checked:border-gold checked:ring-2 checked:ring-offset-1 checked:ring-offset-onyx checked:ring-gold',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-1 focus-visible:ring-offset-onyx',
              'transition-all duration-150',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            aria-describedby={hint ? `${radioId}-hint` : undefined}
            {...props}
          />
          <span className="text-sm text-ivory leading-snug group-has-[:disabled]:opacity-50">
            {label}
          </span>
        </label>
        {hint && (
          <p id={`${radioId}-hint`} className="text-xs text-white/40 ml-7">
            {hint}
          </p>
        )}
      </div>
    )
  }
)

Radio.displayName = 'Radio'

export default Radio
