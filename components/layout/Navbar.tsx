'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion } from 'motion/react'
import { createClient } from '@/lib/supabase/browser'
import { useShopStore } from '@/lib/store/shopStore'
import UserMenu from '@/components/layout/UserMenu'
import { SPRING_STANDARD } from '@/lib/motion'
import type { User } from '@supabase/supabase-js'

// undefined = not yet checked, null = checked & unauthenticated
type AuthState = User | null | undefined

export default function Navbar() {
  const shouldReduceMotion = useReducedMotion()
  const [user, setUser] = useState<AuthState>(undefined)
  const activeBoutiqueSlug = useShopStore((s) => s.activeBoutiqueSlug)
  const _hasHydrated = useShopStore((s) => s._hasHydrated)

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return (
    <motion.header
      className="glass-heavy sticky top-0 z-40 h-16 w-full"
      initial={shouldReduceMotion ? false : { y: -4, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={shouldReduceMotion ? { duration: 0 } : SPRING_STANDARD}
    >
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4">
        {/* Left: wordmark + boutique pill */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-bold text-gold text-lg tracking-tight"
          >
            Top 10 Prom
          </Link>
          {/* Boutique pill — desktop only, after store hydration */}
          {_hasHydrated && activeBoutiqueSlug && (
            <span className="hidden md:inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs text-gold">
              {activeBoutiqueSlug}
            </span>
          )}
        </div>

        {/* Center: nav links — desktop only */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/catalog"
            className="text-sm text-platinum hover:text-ivory transition-colors"
          >
            Catalog
          </Link>
          <Link
            href="/fitting-room"
            className="text-sm text-platinum hover:text-ivory transition-colors"
          >
            Fitting Room
          </Link>
          <Link
            href="/book"
            className="text-sm text-platinum hover:text-ivory transition-colors"
          >
            Book
          </Link>
          <Link
            href="/wedding"
            className="text-sm text-platinum hover:text-ivory transition-colors"
          >
            Wedding
          </Link>
          <Link
            href="/boutiques"
            className="text-sm text-platinum hover:text-ivory transition-colors"
          >
            Boutiques
          </Link>
        </nav>

        {/* Right: auth — hidden until auth state is resolved */}
        <div className="flex items-center h-9 w-9 justify-center">
          {user === undefined ? null : user ? (
            <UserMenu
              userEmail={user.email ?? ''}
              userName={user.email ?? ''}
            />
          ) : (
            <Link
              href="/login"
              className="text-sm text-platinum hover:text-ivory transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </motion.header>
  )
}
