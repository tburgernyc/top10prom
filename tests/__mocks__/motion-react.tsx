/**
 * Vitest mock for motion/react.
 *
 * Replaces Framer Motion with plain React elements so tests are not blocked by
 * JSDOM's inability to run Web Animations API.  AnimatePresence renders its
 * children immediately (no exit-animation delay), and motion.* components
 * render as the corresponding HTML elements without any animation props.
 */
import React from 'react'

type AnyProps = Record<string, unknown>

// Strip animation-only props so they don't end up on DOM nodes.
const ANIMATION_PROPS = new Set([
  'initial', 'animate', 'exit', 'transition', 'variants', 'custom',
  'whileHover', 'whileTap', 'whileFocus', 'whileDrag', 'whileInView',
  'viewport', 'layout', 'layoutId', 'layoutDependency', 'layoutScroll',
  'onAnimationStart', 'onAnimationComplete', 'onUpdate', 'onHoverStart',
  'onHoverEnd', 'onTapStart', 'onTap', 'onTapCancel', 'onDragStart',
  'onDrag', 'onDragEnd', 'drag', 'dragConstraints', 'dragElastic',
  'dragMomentum', 'dragSnapToOrigin', 'dragPropagation',
  'transformTemplate', 'style',
])

function createMotionComponent(tag: string) {
  const Component = React.forwardRef<unknown, AnyProps>(
    ({ style: _style, ...props }, ref) => {
      const filtered: AnyProps = {}
      for (const key of Object.keys(props)) {
        if (!ANIMATION_PROPS.has(key)) filtered[key] = props[key]
      }
      return React.createElement(tag, { ...filtered, ref })
    }
  )
  Component.displayName = `motion.${tag}`
  return Component
}

// Proxy that auto-creates a stub component for any motion.xxx tag accessed.
export const motion = new Proxy({} as Record<string, ReturnType<typeof createMotionComponent>>, {
  get(_target, prop: string) {
    return createMotionComponent(prop)
  },
})

/** Renders children immediately — no exit-animation delay. */
export function AnimatePresence({ children }: { children?: React.ReactNode }) {
  return <>{children}</>
}

export function useReducedMotion() {
  return true
}

export function useMotionValue(initial: number) {
  return { get: () => initial, set: () => {}, on: () => () => {} }
}

export function useTransform(_v: unknown, _from: unknown, _to?: unknown) {
  return { get: () => 0, set: () => {}, on: () => () => {} }
}

export function useSpring(value: number) {
  return { get: () => value, set: () => {}, on: () => () => {} }
}

export function useScroll() {
  return {
    scrollX: { get: () => 0, set: () => {}, on: () => () => {} },
    scrollY: { get: () => 0, set: () => {}, on: () => () => {} },
    scrollXProgress: { get: () => 0, set: () => {}, on: () => () => {} },
    scrollYProgress: { get: () => 0, set: () => {}, on: () => () => {} },
  }
}
