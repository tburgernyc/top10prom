'use client'

import { useState } from 'react'
import { ThumbsUp, ThumbsDown } from 'lucide-react'

interface VoteOnDressProps {
  dressId: string
  shareToken: string
}

type VoteValue = 'up' | 'down' | null

export default function VoteOnDress({ dressId, shareToken }: VoteOnDressProps) {
  const [vote, setVote] = useState<VoteValue>(null)
  const [upCount, setUpCount] = useState(0)
  const [downCount, setDownCount] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  async function handleVote(value: 'up' | 'down') {
    if (submitting) return

    // Optimistic update
    const prev = vote
    const prevUp = upCount
    const prevDown = downCount

    if (prev === value) {
      // Toggle off — not supported by API, so just ignore
      return
    }

    setVote(value)
    if (value === 'up') {
      setUpCount((c) => c + 1)
      if (prev === 'down') setDownCount((c) => Math.max(0, c - 1))
    } else {
      setDownCount((c) => c + 1)
      if (prev === 'up') setUpCount((c) => Math.max(0, c - 1))
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/share/vote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dressId,
          shareToken,
          vote: value,
          voterName: 'Guest',
        }),
      })
      if (!res.ok) throw new Error('Vote failed')
    } catch {
      // Revert on error
      setVote(prev)
      setUpCount(prevUp)
      setDownCount(prevDown)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => handleVote('up')}
        disabled={submitting}
        aria-label="Vote up for this dress"
        aria-pressed={vote === 'up'}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          vote === 'up'
            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
            : 'glass-light text-platinum hover:text-ivory',
        ].join(' ')}
      >
        <ThumbsUp size={14} aria-hidden="true" />
        {upCount > 0 && <span>{upCount}</span>}
      </button>

      <button
        onClick={() => handleVote('down')}
        disabled={submitting}
        aria-label="Vote down for this dress"
        aria-pressed={vote === 'down'}
        className={[
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all',
          vote === 'down'
            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
            : 'glass-light text-platinum hover:text-ivory',
        ].join(' ')}
      >
        <ThumbsDown size={14} aria-hidden="true" />
        {downCount > 0 && <span>{downCount}</span>}
      </button>
    </div>
  )
}
