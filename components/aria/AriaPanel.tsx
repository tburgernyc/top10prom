'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { X, Send } from 'lucide-react'
import { useShopStore } from '@/lib/store/shopStore'
import { AriaBubble } from './AriaBubble'
import { SPRING_STANDARD } from '@/lib/motion'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface AriaPanelProps {
  isOpen: boolean
  onClose: () => void
}

const WELCOME_MESSAGE: ChatMessage = {
  role: 'assistant',
  content: "Hi! I'm Aria, your personal style concierge. How can I help you find your perfect dress today?",
}

export function AriaPanel({ isOpen, onClose }: AriaPanelProps) {
  const shouldReduce = useReducedMotion()
  const eventType = useShopStore((s) => s.eventType)

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME_MESSAGE])
  const [input, setInput]       = useState('')
  const [isPending, setIsPending] = useState(false)
  const [error, setError]       = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef       = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (!isOpen) return
    messagesEndRef.current?.scrollIntoView({ behavior: shouldReduce ? 'instant' : 'smooth' })
  }, [messages, isOpen, shouldReduce])

  // Focus input when panel opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const text = input.trim()
    if (!text || isPending) return

    const userMessage: ChatMessage = { role: 'user', content: text }
    const updatedMessages = [...messages, userMessage]

    setMessages(updatedMessages)
    setInput('')
    setIsPending(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          ...(eventType !== null && { eventType }),
        }),
      })

      const data = (await response.json()) as { reply?: string; error?: string }

      if (!response.ok || data.error) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'assistant', content: data.reply! }])
      }
    } catch {
      setError('Unable to reach Aria right now. Please try again.')
    } finally {
      setIsPending(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop (mobile) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Aria AI Style Concierge"
            initial={shouldReduce ? {} : { opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduce ? {} : { opacity: 0, y: 16, scale: 0.97 }}
            transition={SPRING_STANDARD}
            className={[
              'fixed z-50 flex flex-col',
              'bottom-20 right-4 md:bottom-6 md:right-6',
              'w-[min(calc(100vw-2rem),380px)]',
              'h-[min(520px,calc(100dvh-8rem))]',
              'glass-heavy rounded-2xl overflow-hidden',
              'shadow-2xl shadow-black/60',
            ].join(' ')}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/10 shrink-0">
              <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center">
                <span className="text-gold text-sm" aria-hidden="true">✦</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-ivory">Aria</p>
                <p className="text-xs text-platinum">Style Concierge</p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/10 transition-colors text-platinum hover:text-ivory"
                aria-label="Close Aria"
              >
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
              {messages.map((msg, i) => (
                <AriaBubble key={i} role={msg.role} content={msg.content} index={i} />
              ))}

              {isPending && (
                <div className="flex justify-start">
                  <div className="w-7 h-7 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center shrink-0 mr-2 mt-0.5" aria-hidden="true">
                    <span className="text-gold text-xs">✦</span>
                  </div>
                  <div className="glass-light rounded-2xl rounded-bl-sm px-3.5 py-2.5 flex items-center gap-1" aria-label="Aria is typing">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-platinum"
                        style={{ animation: `bounce 1s ease-in-out ${i * 0.15}s infinite` }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              )}

              {error && (
                <p className="text-xs text-rose-400 text-center px-2">{error}</p>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 border-t border-white/10 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                placeholder="Ask Aria anything…"
                disabled={isPending}
                className={[
                  'flex-1 min-w-0 px-3 py-2 text-sm rounded-xl',
                  'bg-white/5 border border-white/10 text-ivory',
                  'placeholder:text-white/30',
                  'focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent',
                  'disabled:opacity-50',
                ].join(' ')}
                maxLength={500}
              />
              <button
                type="submit"
                disabled={!input.trim() || isPending}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-gold text-onyx hover:brightness-110 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
