'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import { Share2, Copy, Check, Mail, QrCode, X } from 'lucide-react'
import Button from '@/components/ui/Button'
import ShareWithParent from '@/components/social/ShareWithParent'

interface ShareFittingRoomProps {
  dressIds: string[]
}

export default function ShareFittingRoom({ dressIds }: ShareFittingRoomProps) {
  const shouldReduce = useReducedMotion()
  const [open, setOpen] = useState(false)
  const [token, setToken] = useState<string | null>(null)
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showQR, setShowQR] = useState(false)
  const [showParentForm, setShowParentForm] = useState(false)

  const shareUrl =
    token && typeof window !== 'undefined'
      ? `${window.location.origin}/share/${token}`
      : null

  async function handleOpen() {
    setOpen(true)
    if (!token) {
      setGenerating(true)
      try {
        const newToken = crypto.randomUUID()
        const res = await fetch('/api/fitting-room', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            dress_ids: dressIds,
            share_token: newToken,
          }),
        })
        if (res.ok) {
          setToken(newToken)
        }
      } finally {
        setGenerating(false)
      }
    }
  }

  async function handleCopy() {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function shareVia(platform: 'twitter' | 'email') {
    if (!shareUrl) return
    const text = 'Check out my prom dress picks! 👗✨'
    const urls: Record<string, string> = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      email: `mailto:?subject=${encodeURIComponent('My prom dress picks!')}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    }
    window.open(urls[platform], '_blank', 'noopener,noreferrer')
  }

  return (
    <>
      <Button variant="secondary" size="sm" onClick={handleOpen}>
        <Share2 size={14} aria-hidden="true" />
        Share Session
      </Button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-50 bg-black/70"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />

            {/* Panel */}
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Share your fitting room"
              initial={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={shouldReduce ? { opacity: 0 } : { opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: 'spring', stiffness: 340, damping: 30 }}
              className="fixed z-50 inset-x-4 bottom-4 sm:inset-auto sm:bottom-auto sm:top-1/2 sm:left-1/2 sm:-translate-x-1/2 sm:-translate-y-1/2 sm:w-full sm:max-w-sm glass-heavy rounded-2xl p-6 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-ivory">Share Your Picks</h2>
                <button
                  onClick={() => setOpen(false)}
                  aria-label="Close share panel"
                  className="p-1 rounded-lg text-platinum hover:text-ivory hover:bg-white/10 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {generating || !shareUrl ? (
                <div className="flex items-center justify-center py-8">
                  <div
                    className="w-7 h-7 rounded-full border-2 border-gold border-t-transparent animate-spin"
                    role="status"
                    aria-label="Generating share link"
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Share URL row */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 min-w-0 rounded-xl bg-white/5 border border-white/10 px-3 py-2.5">
                      <p className="text-sm text-platinum truncate">{shareUrl}</p>
                    </div>
                    <button
                      onClick={handleCopy}
                      aria-label="Copy share link"
                      className="p-2.5 rounded-xl bg-gold text-onyx hover:brightness-110 transition-colors shrink-0"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>

                  {copied && (
                    <p className="text-xs text-gold text-center">Link copied!</p>
                  )}

                  {/* Social buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => shareVia('twitter')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-light hover:bg-white/10 transition-colors text-xs text-platinum"
                    >
                      <span className="text-sky-400 font-bold text-sm leading-none" aria-hidden="true">𝕏</span>
                      Post on X
                    </button>
                    <button
                      onClick={() => shareVia('email')}
                      className="flex items-center justify-center gap-2 py-2.5 rounded-xl glass-light hover:bg-white/10 transition-colors text-xs text-platinum"
                    >
                      <Mail size={16} className="text-gold" aria-hidden="true" />
                      Email
                    </button>
                  </div>

                  {/* QR toggle */}
                  <button
                    onClick={() => setShowQR((v) => !v)}
                    className="flex items-center gap-2 text-sm text-platinum hover:text-ivory transition-colors mx-auto"
                    aria-expanded={showQR}
                  >
                    <QrCode size={16} aria-hidden="true" />
                    {showQR ? 'Hide QR code' : 'Show QR code'}
                  </button>

                  <AnimatePresence>
                    {showQR && (
                      <motion.div
                        initial={shouldReduce ? {} : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={shouldReduce ? {} : { opacity: 0, height: 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className="overflow-hidden"
                      >
                        <div className="flex justify-center pt-2">
                          <div className="p-3 bg-white rounded-xl">
                            <Image
                              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(shareUrl)}`}
                              alt="QR code for share link"
                              width={180}
                              height={180}
                              className="rounded"
                              unoptimized
                            />
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Share with parent */}
                  <div className="border-t border-white/10 pt-4">
                    <button
                      onClick={() => setShowParentForm((v) => !v)}
                      className="text-sm text-gold hover:text-gold/80 transition-colors"
                      aria-expanded={showParentForm}
                    >
                      {showParentForm ? '▴ Hide' : '▾ Share with a parent or guardian'}
                    </button>
                    <AnimatePresence>
                      {showParentForm && (
                        <motion.div
                          initial={shouldReduce ? {} : { opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={shouldReduce ? {} : { opacity: 0, height: 0 }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-4">
                            <ShareWithParent shareToken={token ?? ''} />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
