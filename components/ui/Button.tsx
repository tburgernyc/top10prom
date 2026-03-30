'use client'

import { forwardRef } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'children' | 'style'> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
  children: React.ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gold text-onyx font-semibold hover:brightness-110 active:brightness-95',
  secondary:
    'glass-light text-ivory hover:bg-white/10 active:bg-white/5',
  ghost:
    'text-platinum hover:text-ivory hover:bg-white/5',
  danger: 'bg-rose-600 text-white hover:bg-rose-500 active:bg-rose-700',
}

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm rounded-lg gap-1.5',
  md: 'px-5 py-2.5 text-sm rounded-xl gap-2',
  lg: 'px-7 py-3.5 text-base rounded-xl gap-2.5',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled,
      children,
      className = '',
      ...props
    },
    ref
  ) => {
    const shouldReduce = useReducedMotion()
    const isInert = disabled === true || loading

    return (
      <motion.button
        ref={ref}
        whileTap={shouldReduce || isInert ? {} : { scale: 0.97 }}
        whileHover={shouldReduce || isInert ? {} : { scale: 1.02 }}
        transition={SPRING_STANDARD}
        disabled={isInert}
        className={[
          'inline-flex items-center justify-center',
          'transition-colors duration-150',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
          variantClasses[variant],
          sizeClasses[size],
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        // Explicitly forward only the props that are safe for motion.button.
        // 'style' is omitted from ButtonProps (callers use className instead)
        // so this spread never carries a CSSProperties|undefined conflict.
        id={props.id}
        name={props.name}
        type={props.type}
        form={props.form}
        value={props.value}
        aria-label={props['aria-label']}
        aria-describedby={props['aria-describedby']}
        aria-controls={props['aria-controls']}
        aria-expanded={props['aria-expanded']}
        aria-pressed={props['aria-pressed']}
        aria-haspopup={props['aria-haspopup']}
        onClick={props.onClick}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        tabIndex={props.tabIndex}
        data-testid={props['data-testid' as keyof typeof props] as string | undefined}
      >
        {loading && (
          <Loader2
            className="animate-spin shrink-0"
            size={size === 'sm' ? 14 : 16}
          />
        )}
        {children}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
