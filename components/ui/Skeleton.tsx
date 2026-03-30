import { type HTMLAttributes } from 'react'

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  /** Use min-h values (e.g. "min-h-[120px]") — never fixed h- values.
   *  This prevents layout shift when real content loads. */
  minHeight?: string
}

export default function Skeleton({
  minHeight,
  className = '',
  style,
  ...props
}: SkeletonProps) {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading..."
      className={[
        'rounded-xl skeleton-shimmer',
        minHeight ?? 'min-h-[1em]',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
      {...props}
    />
  )
}

/** Pre-built skeleton layouts for common patterns */
export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 p-4 glass-light rounded-2xl">
      <Skeleton minHeight="min-h-[200px]" className="w-full rounded-xl" />
      <Skeleton minHeight="min-h-[24px]" className="w-3/4" />
      <Skeleton minHeight="min-h-[20px]" className="w-1/2" />
    </div>
  )
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          minHeight="min-h-[18px]"
          className={i === lines - 1 ? 'w-2/3' : 'w-full'}
        />
      ))}
    </div>
  )
}
