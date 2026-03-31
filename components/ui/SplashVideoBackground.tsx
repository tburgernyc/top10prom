'use client'

import { useReducedMotion } from 'motion/react'

/**
 * Full-viewport fixed video background — renders on every page via root layout.
 * The video is slightly blurred and overlaid with a semi-transparent tint so it
 * adds atmosphere without competing with page content.
 *
 * Skipped entirely when the user prefers reduced motion.
 */
export default function SplashVideoBackground() {
  const shouldReduce = useReducedMotion()

  if (shouldReduce) return null

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
      role="presentation"
    >
      {/* scale-[1.04] prevents blurred edges from showing as white borders */}
      <video
        autoPlay
        muted
        loop
        playsInline
        disablePictureInPicture
        className="absolute inset-0 h-full w-full object-cover scale-[1.04] blur-[3px]"
      >
        <source src="/video/splash.mp4" type="video/mp4" />
      </video>

      {/* Dark tint overlay — keeps page content fully readable */}
      <div className="absolute inset-0 bg-onyx/70" />
    </div>
  )
}
