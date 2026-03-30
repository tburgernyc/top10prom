import { AlertCircle, CheckCircle, Info, AlertTriangle, X } from 'lucide-react'

export type AlertVariant = 'info' | 'success' | 'warning' | 'danger'

export interface AlertProps {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  onDismiss?: () => void
  className?: string
}

const variantConfig: Record<
  AlertVariant,
  { icon: React.ReactNode; classes: string }
> = {
  info: {
    icon: <Info size={16} className="shrink-0 text-blue-400" aria-hidden="true" />,
    classes: 'bg-blue-500/10 border-blue-500/25 text-blue-200',
  },
  success: {
    icon: <CheckCircle size={16} className="shrink-0 text-emerald-400" aria-hidden="true" />,
    classes: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-200',
  },
  warning: {
    icon: <AlertTriangle size={16} className="shrink-0 text-amber-400" aria-hidden="true" />,
    classes: 'bg-amber-500/10 border-amber-500/25 text-amber-200',
  },
  danger: {
    icon: <AlertCircle size={16} className="shrink-0 text-rose-400" aria-hidden="true" />,
    classes: 'bg-rose-500/10 border-rose-500/25 text-rose-200',
  },
}

export default function Alert({
  variant = 'info',
  title,
  children,
  onDismiss,
  className = '',
}: AlertProps) {
  const { icon, classes } = variantConfig[variant]

  return (
    <div
      role="alert"
      className={[
        'flex gap-3 rounded-xl border px-4 py-3 text-sm',
        classes,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {icon}
      <div className="flex-1 min-w-0">
        {title && <p className="font-semibold mb-0.5">{title}</p>}
        <div className="opacity-80">{children}</div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          aria-label="Dismiss alert"
          className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
        >
          <X size={14} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
