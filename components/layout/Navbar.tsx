'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import {
  ShoppingBag,
  Sparkles,
  CalendarCheck,
  Menu,
  X,
  LayoutDashboard,
  ChevronRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/browser'
import { useShopStore } from '@/lib/store/shopStore'
import UserMenu from '@/components/layout/UserMenu'
import { SPRING_STANDARD, SPRING_SNAPPY } from '@/lib/motion'
import type { User } from '@supabase/supabase-js'

type AuthState = User | null | undefined

const NAV_LINKS = [
  { href: '/catalog',     label: 'Catalog' },
  { href: '/fitting-room', label: 'Fitting Room' },
  { href: '/book',        label: 'Book' },
  { href: '/wedding',     label: 'Wedding' },
  { href: '/boutiques',   label: 'Boutiques' },
] as const

// Drawer overlay variants
const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

// Drawer panel variants (slides in from right)
const drawerVariants = {
  hidden:  { x: '100%' },
  visible: { x: 0 },
  exit:    { x: '100%' },
}

export default function Navbar() {
  const shouldReduce = useReducedMotion()
  const [user, setUser]       = useState<AuthState>(undefined)
  const [scrolled, setScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerCloseRef = useRef<HTMLButtonElement>(null)
  const menuTriggerRef = useRef<HTMLButtonElement>(null)

  const activeBoutiqueSlug = useShopStore((s) => s.activeBoutiqueSlug)
  const _hasHydrated       = useShopStore((s) => s._hasHydrated)
  const fittingRoomCount   = useShopStore((s) => s.fittingRoomIds.length)

  // Auth subscription
  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  // Scroll-based glass effect
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll when drawer is open; restore focus on close
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden'
      drawerCloseRef.current?.focus()
    } else {
      document.body.style.overflow = ''
      menuTriggerRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [drawerOpen])

  // Close drawer on Escape
  useEffect(() => {
    if (!drawerOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setDrawerOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [drawerOpen])

  // Role-aware dashboard href (mirrors proxy.ts)
  const dashboardHref: string | undefined =
    user?.app_metadata?.system_role === 'SUPER_ADMIN'
      ? '/saas/admin'
      : user?.app_metadata?.store_role === 'OWNER'
        ? '/saas/owner'
        : (user?.app_metadata?.store_role === 'MANAGER' ||
           user?.app_metadata?.store_role === 'ASSOCIATE')
          ? '/saas/staff'
          : undefined

  return (
    <>
      {/* ── Sticky header ─────────────────────────────────────────────────── */}
      <header
        role="banner"
        className={[
          'sticky top-0 z-40 h-16 w-full transition-all duration-300',
          scrolled
            ? 'bg-onyx/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-black/20'
            : 'bg-transparent',
        ].join(' ')}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 md:px-6">

          {/* ── Left: wordmark + boutique pill ──────────────────────────── */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-bold text-gold text-lg tracking-tight hover:opacity-90 transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx rounded-sm"
            >
              Top 10 Prom
            </Link>
            {_hasHydrated && activeBoutiqueSlug && (
              <span className="hidden md:inline-flex items-center rounded-full border border-gold/30 bg-gold/10 px-2.5 py-0.5 text-xs text-gold">
                {activeBoutiqueSlug}
              </span>
            )}
          </div>

          {/* ── Center: desktop nav links ────────────────────────────────── */}
          <nav
            className="hidden md:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3 py-1.5 rounded-lg text-sm text-platinum hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx"
              >
                {link.label}
              </Link>
            ))}

            {/* Dashboard pill — SaaS roles only */}
            {dashboardHref && (
              <Link
                href={dashboardHref}
                className="ml-2 flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium text-gold hover:bg-gold/20 active:bg-gold/30 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <LayoutDashboard size={12} aria-hidden="true" />
                Dashboard
              </Link>
            )}
          </nav>

          {/* ── Right: CTAs + icons + auth ───────────────────────────────── */}
          <div className="flex items-center gap-2">

            {/* Try-On CTA — desktop */}
            <Link
              href="/fitting-room"
              aria-label="Virtual try-on"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium text-platinum border border-white/10 hover:border-white/25 hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Sparkles size={14} aria-hidden="true" />
              Try-On
            </Link>

            {/* Book Fitting CTA — desktop */}
            <Link
              href="/book"
              aria-label="Book a fitting appointment"
              className="hidden md:flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-sm font-semibold bg-gold text-onyx hover:brightness-110 active:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx"
            >
              <CalendarCheck size={14} aria-hidden="true" />
              Book Fitting
            </Link>

            {/* Shopping bag / fitting room — all screen sizes */}
            <Link
              href="/fitting-room"
              aria-label={`Fitting room${fittingRoomCount > 0 ? `, ${fittingRoomCount} items` : ''}`}
              className="relative flex h-9 w-9 items-center justify-center rounded-full text-platinum hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <ShoppingBag size={18} aria-hidden="true" />
              {fittingRoomCount > 0 && (
                <span
                  aria-hidden="true"
                  className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-gold text-[10px] font-bold text-onyx"
                >
                  {fittingRoomCount > 9 ? '9+' : fittingRoomCount}
                </span>
              )}
            </Link>

            {/* Auth — hidden until resolved */}
            <div className="flex items-center h-9 w-9 justify-center">
              {user === undefined ? null : user ? (
                <UserMenu
                  userEmail={user.email ?? ''}
                  userName={user.email ?? ''}
                  dashboardHref={dashboardHref}
                />
              ) : (
                <Link
                  href="/login"
                  className="text-sm text-platinum hover:text-ivory transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold rounded-sm"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              ref={menuTriggerRef}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-drawer"
              className="flex md:hidden h-9 w-9 items-center justify-center rounded-full text-platinum hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <Menu size={20} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ───────────────────────────────────────────────────── */}
      <AnimatePresence>
        {drawerOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              aria-hidden="true"
              variants={overlayVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden"
              onClick={() => setDrawerOpen(false)}
            />

            {/* Panel */}
            <motion.div
              key="panel"
              id="mobile-drawer"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
              variants={drawerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={shouldReduce ? { duration: 0 } : SPRING_SNAPPY}
              className="fixed right-0 top-0 z-50 h-full w-80 max-w-[85vw] bg-onyx border-l border-white/10 flex flex-col md:hidden overflow-y-auto"
            >
              {/* Drawer header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-white/10">
                <Link
                  href="/"
                  onClick={() => setDrawerOpen(false)}
                  className="font-bold text-gold text-lg tracking-tight"
                >
                  Top 10 Prom
                </Link>
                <button
                  ref={drawerCloseRef}
                  onClick={() => setDrawerOpen(false)}
                  aria-label="Close menu"
                  className="flex h-9 w-9 items-center justify-center rounded-full text-platinum hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Primary links */}
              <nav aria-label="Mobile navigation" className="flex-1 px-3 py-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-platinum hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    {link.label}
                    <ChevronRight size={14} className="text-white/30" aria-hidden="true" />
                  </Link>
                ))}
              </nav>

              {/* Divider */}
              <div className="mx-5 h-px bg-white/10" />

              {/* CTA buttons */}
              <div className="px-5 py-5 space-y-3">
                <Link
                  href="/fitting-room"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-platinum border border-white/10 hover:border-white/25 hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                >
                  <Sparkles size={16} aria-hidden="true" />
                  Virtual Try-On
                </Link>
                <Link
                  href="/book"
                  onClick={() => setDrawerOpen(false)}
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-semibold bg-gold text-onyx hover:brightness-110 active:brightness-95 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-onyx"
                >
                  <CalendarCheck size={16} aria-hidden="true" />
                  Book a Fitting
                </Link>

                {/* Dashboard shortcut */}
                {dashboardHref && (
                  <Link
                    href={dashboardHref}
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-gold border border-gold/30 bg-gold/10 hover:bg-gold/20 active:bg-gold/30 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    <LayoutDashboard size={16} aria-hidden="true" />
                    Go to Dashboard
                  </Link>
                )}
              </div>

              {/* Auth footer */}
              <div className="px-5 pb-8">
                {user === undefined ? null : user ? (
                  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold/20 text-gold text-sm font-bold uppercase">
                      {(user.email ?? '?')[0]}
                    </div>
                    <p className="flex-1 text-xs text-platinum truncate">{user.email}</p>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setDrawerOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl text-sm font-medium text-platinum border border-white/10 hover:border-white/25 hover:text-ivory hover:bg-white/5 active:bg-white/10 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
