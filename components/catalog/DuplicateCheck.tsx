'use client'

import { useState } from 'react'
import { CheckCircle, AlertTriangle, Search } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

interface DuplicateCheckProps {
  dressId: string
}

type CheckResult = 'safe' | 'conflict' | null

export default function DuplicateCheck({ dressId }: DuplicateCheckProps) {
  const [schoolName, setSchoolName] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [result, setResult] = useState<CheckResult>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleCheck() {
    if (!schoolName.trim() || !eventDate) return
    setLoading(true)
    setResult(null)
    setError(null)

    try {
      const params = new URLSearchParams({
        dress_id: dressId,
        school_name: schoolName.trim(),
        event_date: eventDate,
      })
      const res = await fetch(`/api/duplicate-check?${params.toString()}`)
      if (!res.ok) {
        setError('Check failed. Please try again.')
        return
      }
      const json = (await res.json()) as { isDuplicate: boolean }
      setResult(json.isDuplicate ? 'conflict' : 'safe')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold text-ivory">No-Duplicate Check</h3>
      <p className="text-xs text-platinum/60 leading-relaxed">
        Verify that no one from your school has already reserved this dress for
        your prom date.
      </p>

      <div className="space-y-3">
        <Input
          label="School name"
          name="school_name"
          type="text"
          value={schoolName}
          onChange={(e) => setSchoolName(e.target.value)}
          placeholder="e.g. Marietta High School"
        />
        <Input
          label="Prom date"
          name="event_date"
          type="date"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
      </div>

      <Button
        variant="secondary"
        size="sm"
        onClick={handleCheck}
        loading={loading}
        disabled={!schoolName.trim() || !eventDate || loading}
        aria-label="Check for duplicates at your school"
      >
        <Search size={14} aria-hidden="true" />
        Check Availability
      </Button>

      {error && (
        <p className="text-xs text-rose-400">{error}</p>
      )}

      {result === 'safe' && (
        <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
          <CheckCircle size={16} aria-hidden="true" />
          <span>You&apos;re safe! No duplicates at your school.</span>
        </div>
      )}

      {result === 'conflict' && (
        <div className="flex items-start gap-2 text-amber-400 text-sm">
          <AlertTriangle size={16} className="shrink-0 mt-0.5" aria-hidden="true" />
          <span>
            This dress has been reserved at your school. Browse similar styles or
            speak with a stylist for alternatives.
          </span>
        </div>
      )}
    </div>
  )
}
