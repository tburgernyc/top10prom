'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'
import { useShopStore } from '@/lib/store/shopStore'
import { SPRING_STANDARD } from '@/lib/motion'

interface Tab {
  label: string
  href: string
  icon: string
  exact?: boolean
}

const TABS: Tab[] = [
  { label: 'Home', href: '/', icon: '🏠', exact: true },
  { label: 'Catalog', href: '/catalog', icon: '👗' },
  { label: 'Fitting Room', href: '/fitting-room', icon: '✨' },
  { label: 'Book', href: '/book', icon: '📅' },
  { label: 'Profile', href: '/profile', icon: '👤' },
]

function isActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
  return pathname === href || pathname.startsWith(href + '/')
}

export default function BottomNav() {
  const shouldReduceMotion = useReducedMotion()
  const pathname = usePathname()
  const fittingRoomCount = useShopStore((s) => s.fittingRoomIds.length)

  return (
    <motion.nav
      className="glass-heavy fixed bottom-0 left-0 right-0 z-30 h-16 flex items-center justify-around md:hidden"
      initial={shouldReduceMotion ? false : { y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : SPRING_STANDARD}
      aria-label="Mobile navigation"
    >
      {TABS.map((tab) => {
        const active = isActive(pathname, tab.href, tab.exact)
        const isFittingRoom = tab.href === '/fitting-room'

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`relative flex flex-col items-center gap-0.5 p-2 transition-colors ${
              active
                ? 'text-gold'
                : 'text-platinum'
            }`}
            aria-current={active ? 'page' : undefined}
          >
            <span className="relative text-xl leading-none">
              {tab.icon}
              {isFittingRoom && fittingRoomCount > 0 && (
                <span
                  className="absolute -top-1 -right-2 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-onyx"
                  aria-label={`${fittingRoomCount} items in fitting room`}
                >
                  {fittingRoomCount > 9 ? '9+' : fittingRoomCount}
                </span>
              )}
            </span>
            <span className="text-[10px] leading-none">{tab.label}</span>
          </Link>
        )
      })}
    </motion.nav>
  )
}
