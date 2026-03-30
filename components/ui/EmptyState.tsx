import type { LucideIcon } from 'lucide-react'

export interface EmptyStateProps {
  icon?: LucideIcon
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = '',
}: EmptyStateProps) {
  return (
    <div
      className={[
        'flex flex-col items-center justify-center text-center py-16 px-6',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {Icon && (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 border border-white/10">
          <Icon size={24} className="text-platinum/50" aria-hidden="true" />
        </div>
      )}
      <p className="text-base font-semibold text-ivory mb-1">{title}</p>
      {description && (
        <p className="text-sm text-platinum/60 max-w-xs">{description}</p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
