'use client'

import {
  createContext,
  useCallback,
  useContext,
  useId,
  useState,
} from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import { SPRING_STANDARD } from '@/lib/motion'

type ToastType = 'success' | 'error' | 'info'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

let _toastSeq = 0

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const shouldReduce = useReducedMotion()
  const uid = useId()

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${uid}-${++_toastSeq}`
      setToasts((prev) => [...prev.slice(-4), { id, type, message }])
      setTimeout(() => dismiss(id), 4500)
    },
    [uid, dismiss]
  )

  const icons: Record<ToastType, React.ReactNode> = {
    success: <CheckCircle size={16} className="text-emerald-400 shrink-0" />,
    error:   <AlertCircle size={16} className="text-rose-400 shrink-0" />,
    info:    <Info size={16} className="text-blue-400 shrink-0" />,
  }

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        aria-label="Notifications"
        className="fixed bottom-20 right-4 z-50 flex flex-col gap-2 md:bottom-6"
      >
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={shouldReduce ? {} : { opacity: 0, y: 20, scale: 0.95 }}
              animate={shouldReduce ? {} : { opacity: 1, y: 0, scale: 1 }}
              exit={shouldReduce ? {} : { opacity: 0, scale: 0.9 }}
              transition={SPRING_STANDARD}
              role="status"
              className="flex items-center gap-3 glass-heavy rounded-xl px-4 py-3 text-sm text-ivory shadow-xl max-w-sm"
            >
              {icons[t.type]}
              <span className="flex-1">{t.message}</span>
              <button
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss"
                className="text-white/40 hover:text-white/80 transition-colors"
              >
                <X size={14} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
