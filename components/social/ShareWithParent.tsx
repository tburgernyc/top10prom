'use client'

import { useState } from 'react'
import { Mail, CheckCircle } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface ShareWithParentProps {
  shareToken: string
  customerName?: string | undefined
}

type FormState = 'idle' | 'submitting' | 'success' | 'error'

export default function ShareWithParent({
  shareToken,
  customerName,
}: ShareWithParentProps) {
  const [parentEmail, setParentEmail] = useState('')
  const [parentName, setParentName] = useState('')
  const [formState, setFormState] = useState<FormState>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  const shareUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}/share/${shareToken}`
      : `/share/${shareToken}`

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!parentEmail.trim()) return

    setFormState('submitting')
    setErrorMsg('')

    try {
      const res = await fetch('/api/share/parent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parentEmail: parentEmail.trim(),
          parentName: parentName.trim() || 'Parent/Guardian',
          dressName: customerName ? `${customerName}'s picks` : 'dress picks',
          shareUrl,
        }),
      })

      if (!res.ok) {
        const data = (await res.json()) as { error?: string }
        setErrorMsg(data.error ?? 'Failed to send. Please try again.')
        setFormState('error')
        return
      }

      setFormState('success')
    } catch {
      setErrorMsg('Network error. Please try again.')
      setFormState('error')
    }
  }

  if (formState === 'success') {
    return (
      <div className="flex items-center gap-2 text-emerald-400 text-sm py-2">
        <CheckCircle size={16} aria-hidden="true" />
        <span>Email sent! Your parent/guardian will receive a link to view your picks.</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="flex items-center gap-2 text-xs text-platinum/60 mb-1">
        <Mail size={12} aria-hidden="true" />
        <span>Share with a parent or guardian</span>
      </div>

      <Input
        label="Their name (optional)"
        name="parent_name"
        type="text"
        value={parentName}
        onChange={(e) => setParentName(e.target.value)}
        placeholder="e.g. Mom"
      />
      <Input
        label="Their email"
        name="parent_email"
        type="email"
        required
        value={parentEmail}
        onChange={(e) => setParentEmail(e.target.value)}
        placeholder="parent@email.com"
      />

      {formState === 'error' && (
        <p className="text-xs text-rose-400">{errorMsg}</p>
      )}

      <Button
        type="submit"
        variant="secondary"
        size="sm"
        loading={formState === 'submitting'}
        disabled={!parentEmail.trim() || formState === 'submitting'}
      >
        <Mail size={14} aria-hidden="true" />
        Send Link
      </Button>
    </form>
  )
}
