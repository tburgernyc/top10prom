export type BadgeVariant =
  | 'gold'
  | 'platinum'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  gold:     'bg-gold/15 text-gold border-gold/30',
  platinum: 'bg-white/10 text-platinum border-white/15',
  success:  'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  warning:  'bg-amber-500/15 text-amber-300 border-amber-500/30',
  danger:   'bg-rose-500/15 text-rose-300 border-rose-500/30',
  info:     'bg-blue-500/15 text-blue-300 border-blue-500/30',
  neutral:  'bg-slate-500/15 text-slate-300 border-slate-500/30',
}

export default function Badge({
  children,
  variant = 'neutral',
  className = '',
}: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center px-2.5 py-0.5',
        'text-xs font-medium rounded-full border',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}
