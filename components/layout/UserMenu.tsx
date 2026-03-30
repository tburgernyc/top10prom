'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { logoutAction } from '@/lib/actions/auth'
import { SPRING_SNAPPY } from '@/lib/motion'
import Avatar from '@/components/ui/Avatar'

interface UserMenuProps {
  userEmail: string
  /** Full display name — used to derive avatar initials */
  userName: string
}

export default function UserMenu({ userEmail, userName }: UserMenuProps) {
  const shouldReduce = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [isOpen])

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen])

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setIsOpen((o) => !o)}
        aria-label="Open account menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="cursor-pointer select-none hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx rounded-full"
      >
        <Avatar name={userName} size="md" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            role="menu"
            initial={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: -4 }}
            animate={shouldReduce ? {} : { opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduce ? {} : { opacity: 0, scale: 0.95, y: -4 }}
            transition={SPRING_SNAPPY}
            className="absolute right-0 top-11 z-50 w-52 glass-heavy rounded-xl shadow-2xl overflow-hidden border border-white/10"
          >
            {/* Email */}
            <div className="px-4 py-3 border-b border-white/10">
              <p className="text-xs text-platinum truncate">{userEmail}</p>
            </div>

            {/* Links */}
            <nav className="py-1">
              <Link
                href="/profile"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ivory hover:bg-white/5 transition-colors"
              >
                My Profile
              </Link>
              <Link
                href="/fitting-room"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ivory hover:bg-white/5 transition-colors"
              >
                Fitting Room
              </Link>
              <Link
                href="/wishlist"
                role="menuitem"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 px-4 py-2.5 text-sm text-ivory hover:bg-white/5 transition-colors"
              >
                Wishlist
              </Link>
            </nav>

            {/* Sign out */}
            <div className="border-t border-white/10 py-1">
              <form action={logoutAction}>
                <button
                  type="submit"
                  role="menuitem"
                  className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:bg-white/5 transition-colors"
                >
                  Sign out
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
