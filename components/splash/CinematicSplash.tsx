'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from 'motion/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { SplashFallback } from './SplashFallback'

// Static sparkle positions — decorative mid-back layer
const SPARKLES: ReadonlyArray<{
  id: number
  x: number
  y: number
  size: string
  opacity: number
}> = [
  { id: 1,  x: 8,  y: 15, size: '2px',  opacity: 0.6  },
  { id: 2,  x: 18, y: 42, size: '1px',  opacity: 0.4  },
  { id: 3,  x: 30, y: 8,  size: '3px',  opacity: 0.5  },
  { id: 4,  x: 45, y: 22, size: '1px',  opacity: 0.7  },
  { id: 5,  x: 60, y: 12, size: '2px',  opacity: 0.45 },
  { id: 6,  x: 72, y: 35, size: '1px',  opacity: 0.55 },
  { id: 7,  x: 85, y: 18, size: '3px',  opacity: 0.4  },
  { id: 8,  x: 92, y: 60, size: '1px',  opacity: 0.6  },
  { id: 9,  x: 15, y: 68, size: '2px',  opacity: 0.35 },
  { id: 10, x: 35, y: 75, size: '1px',  opacity: 0.5  },
  { id: 11, x: 55, y: 80, size: '2px',  opacity: 0.4  },
  { id: 12, x: 78, y: 72, size: '1px',  opacity: 0.55 },
  { id: 13, x: 22, y: 88, size: '2px',  opacity: 0.35 },
  { id: 14, x: 65, y: 55, size: '1px',  opacity: 0.5  },
  { id: 15, x: 90, y: 45, size: '2px',  opacity: 0.4  },
  { id: 16, x: 5,  y: 50, size: '1px',  opacity: 0.45 },
  { id: 17, x: 50, y: 5,  size: '2px',  opacity: 0.6  },
  { id: 18, x: 40, y: 92, size: '1px',  opacity: 0.4  },
  { id: 19, x: 82, y: 88, size: '2px',  opacity: 0.35 },
  { id: 20, x: 12, y: 30, size: '1px',  opacity: 0.5  },
]

// Foreground orb positions — fast parallax layer
const ORB_POSITIONS: ReadonlyArray<{
  id: number
  x: number
  y: number
  size: string
  opacity: number
}> = [
  { id: 1, x: 10, y: 20,  size: '80px',  opacity: 0.06 },
  { id: 2, x: 82, y: 15,  size: '120px', opacity: 0.05 },
  { id: 3, x: 5,  y: 70,  size: '60px',  opacity: 0.07 },
  { id: 4, x: 88, y: 65,  size: '90px',  opacity: 0.05 },
  { id: 5, x: 50, y: 88,  size: '70px',  opacity: 0.06 },
  { id: 6, x: 25, y: 45,  size: '50px',  opacity: 0.04 },
]

const STATS = [
  { value: '500+', label: 'Exclusive Designs' },
  { value: '50+',  label: 'Boutique Locations' },
  { value: '10K+', label: 'Happy Customers' },
  { value: '100%', label: 'No Duplicate Guarantee' },
] as const

export function CinematicSplash() {
  const shouldReduce = useReducedMotion()
  const router = useRouter()

  const wrapperRef  = useRef<HTMLDivElement>(null)
  const contentRef  = useRef<HTMLDivElement>(null)
  const flashRef    = useRef<HTMLDivElement>(null)
  const layer1Ref   = useRef<HTMLDivElement>(null)
  const layer2Ref   = useRef<HTMLDivElement>(null)
  const layer4Ref   = useRef<HTMLDivElement>(null)

  const isScrollingRef  = useRef(false)
  const scrollTimerRef  = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (shouldReduce) return
    if (!wrapperRef.current || !contentRef.current) return

    let smoother: { kill: () => void } | null = null
    let scrollTriggers: Array<{ kill: () => void }> = []

    async function init() {
      const { gsap }          = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      const { ScrollSmoother } = await import('gsap/ScrollSmoother')

      gsap.registerPlugin(ScrollTrigger, ScrollSmoother)

      if (!wrapperRef.current || !contentRef.current) return

      smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current,
        content: contentRef.current,
        smooth: 1.5,
        effects: true,
      })

      // Auto-navigate to /home when user reaches end of scroll experience
      if (contentRef.current) {
        const endTrigger = ScrollTrigger.create({
          trigger: contentRef.current,
          start: '95% top',
          onEnter: () => { router.push('/home') },
        })
        scrollTriggers = [...scrollTriggers, endTrigger]
      }

      // Gold flash at 62% of scroll timeline
      if (flashRef.current && contentRef.current) {
        const flashEl = flashRef.current
        const trigger = ScrollTrigger.create({
          trigger: contentRef.current,
          start: '62% top',
          end: '+=2px',
          onEnter: () => {
            gsap.fromTo(
              flashEl,
              { opacity: 0 },
              { opacity: 0.85, duration: 0.06, ease: 'power1.out',
                onComplete: () => {
                  gsap.to(flashEl, { opacity: 0, duration: 0.17, ease: 'power1.in' })
                },
              }
            )
          },
        })
        scrollTriggers = [...scrollTriggers, trigger]
      }

      // Mouse parallax (desktop / pointer: fine only)
      const mql = window.matchMedia('(hover: hover) and (pointer: fine)')
      if (!mql.matches) return

      function onScroll() {
        isScrollingRef.current = true
        if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
        scrollTimerRef.current = setTimeout(() => {
          isScrollingRef.current = false
        }, 150)
      }

      function onMouseMove(e: MouseEvent) {
        if (isScrollingRef.current) return
        const cx = window.innerWidth  / 2
        const cy = window.innerHeight / 2
        const nx = (e.clientX - cx) / cx
        const ny = (e.clientY - cy) / cy

        if (layer1Ref.current) {
          gsap.to(layer1Ref.current, {
            x: nx * -14, y: ny * -10,
            duration: 1.4, ease: 'power1.out', overwrite: 'auto',
          })
        }
        if (layer2Ref.current) {
          gsap.to(layer2Ref.current, {
            x: nx * -7, y: ny * -5,
            duration: 1.1, ease: 'power1.out', overwrite: 'auto',
          })
        }
        if (layer4Ref.current) {
          gsap.to(layer4Ref.current, {
            x: nx * 11, y: ny * 8,
            duration: 0.9, ease: 'power1.out', overwrite: 'auto',
          })
        }
      }

      window.addEventListener('mousemove', onMouseMove)
      window.addEventListener('scroll', onScroll, { passive: true })

      // Store cleanup fns on the smoother ref for cleanup
      const origKill = smoother?.kill.bind(smoother)
      if (smoother) {
        smoother.kill = () => {
          origKill?.()
          window.removeEventListener('mousemove', onMouseMove)
          window.removeEventListener('scroll', onScroll)
          if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
        }
      }
    }

    void init()

    return () => {
      smoother?.kill()
      scrollTriggers.forEach((t) => t.kill())
    }
  }, [shouldReduce])

  if (shouldReduce) return <SplashFallback />

  return (
    <>
      {/* Gold flash overlay — sits above everything, outside smooth wrapper */}
      <div
        ref={flashRef}
        className="fixed inset-0 z-50 pointer-events-none"
        style={{ background: 'var(--color-gold)', opacity: 0 }}
        aria-hidden="true"
      />

      {/* ScrollSmoother wrapper */}
      <div
        ref={wrapperRef}
        style={{ overflow: 'hidden', position: 'fixed', inset: 0, width: '100%', height: '100vh' }}
      >
        <div ref={contentRef}>

          {/* ── 4-Layer parallax zone (250vh tall) ───────────────────── */}
          <div className="relative" style={{ height: '250vh' }}>

            {/* Layer 1 — Deep background (slowest, data-speed 0.3) */}
            <div
              ref={layer1Ref}
              data-speed="0.3"
              className="absolute inset-0 h-screen"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-b from-onyx-warm via-onyx to-onyx" />
              <div
                className="absolute inset-0"
                style={{
                  background: 'radial-gradient(ellipse 80% 50% at 50% 40%, rgba(212,175,55,0.06) 0%, transparent 70%)',
                }}
              />
            </div>

            {/* Layer 2 — Mid-back sparkles (data-speed 0.65) */}
            <div
              ref={layer2Ref}
              data-speed="0.65"
              className="absolute inset-0 h-screen pointer-events-none"
              aria-hidden="true"
            >
              {SPARKLES.map((s) => (
                <div
                  key={s.id}
                  className="absolute rounded-full bg-gold"
                  style={{
                    left:    `${s.x}%`,
                    top:     `${s.y}%`,
                    width:   s.size,
                    height:  s.size,
                    opacity: s.opacity,
                  }}
                />
              ))}
            </div>

            {/* Layer 3 — Hero content (data-speed 1, normal) */}
            <div
              data-speed="1"
              className="absolute inset-0 h-screen flex flex-col items-center justify-center text-center px-4"
            >
              <div className="max-w-3xl mx-auto space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 glass-light rounded-full text-xs text-gold font-medium">
                  <span aria-hidden="true">✦</span>
                  <span>No-Duplicate Dress Guarantee</span>
                  <span aria-hidden="true">✦</span>
                </div>
                <h1 className="text-5xl md:text-7xl font-bold text-ivory leading-tight tracking-tight">
                  Your Perfect Dress.{' '}
                  <span className="text-gold">Only Yours.</span>
                </h1>
                <p className="text-lg md:text-xl text-platinum max-w-xl mx-auto">
                  Discover luxury prom and bridal gowns at Top 10 Prom boutiques.
                  We guarantee no one else at your event will wear the same dress.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <Link
                    href="/catalog"
                    className="px-8 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 transition-all"
                  >
                    Browse Dresses
                  </Link>
                  <Link
                    href="/home"
                    className="px-8 py-4 glass-light text-ivory font-semibold rounded-xl hover:bg-white/10 transition-all"
                  >
                    Explore
                  </Link>
                </div>
              </div>
            </div>

            {/* Layer 4 — Foreground gold orbs (data-speed 1.4, fastest) */}
            <div
              ref={layer4Ref}
              data-speed="1.4"
              className="absolute inset-0 h-screen pointer-events-none"
              aria-hidden="true"
            >
              {ORB_POSITIONS.map((orb) => (
                <div
                  key={orb.id}
                  className="absolute rounded-full"
                  style={{
                    left:       `${orb.x}%`,
                    top:        `${orb.y}%`,
                    width:      orb.size,
                    height:     orb.size,
                    background: 'radial-gradient(circle, var(--color-gold) 0%, transparent 70%)',
                    opacity:    orb.opacity,
                    filter:     'blur(2px)',
                  }}
                />
              ))}
            </div>

          </div>
          {/* ── End parallax zone ─────────────────────────────────────── */}

          {/* Stats + CTA section (below fold) */}
          <section className="relative py-24 px-4 bg-onyx">
            <div className="max-w-4xl mx-auto text-center space-y-12">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {STATS.map((stat) => (
                  <div key={stat.label} className="space-y-1">
                    <div className="text-3xl font-bold text-gold">{stat.value}</div>
                    <div className="text-sm text-platinum">{stat.label}</div>
                  </div>
                ))}
              </div>
              <Link
                href="/home"
                className="inline-block px-10 py-4 bg-gold text-onyx font-bold rounded-xl hover:brightness-110 transition-all"
              >
                Enter Experience
              </Link>
            </div>
          </section>

        </div>
      </div>
    </>
  )
}
