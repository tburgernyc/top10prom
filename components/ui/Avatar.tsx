import Image from 'next/image'

export type AvatarSize = 'sm' | 'md' | 'lg'

export interface AvatarProps {
  /** Image URL. Falls back to initials if omitted or fails to load. */
  src?: string | null
  /** Used to generate initials fallback and alt text */
  name: string
  size?: AvatarSize
  className?: string
}

const sizeClasses: Record<AvatarSize, { wrapper: string; text: string; px: number }> = {
  sm: { wrapper: 'h-7 w-7',  text: 'text-[10px]', px: 28 },
  md: { wrapper: 'h-9 w-9',  text: 'text-sm',     px: 36 },
  lg: { wrapper: 'h-12 w-12', text: 'text-base',   px: 48 },
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((part) => part[0] ?? '')
    .join('')
    .toUpperCase()
}

export default function Avatar({
  src,
  name,
  size = 'md',
  className = '',
}: AvatarProps) {
  const { wrapper, text, px } = sizeClasses[size]
  const initials = getInitials(name)

  return (
    <div
      aria-label={name}
      className={[
        'relative inline-flex items-center justify-center rounded-full',
        'bg-gold text-onyx font-semibold select-none overflow-hidden',
        wrapper,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {src ? (
        <Image
          src={src}
          alt={name}
          width={px}
          height={px}
          className="object-cover w-full h-full"
        />
      ) : (
        <span className={text} aria-hidden="true">
          {initials}
        </span>
      )}
    </div>
  )
}
