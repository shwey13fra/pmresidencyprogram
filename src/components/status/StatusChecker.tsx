'use client'
import { useState } from 'react'
import Link from 'next/link'
import Button from '@/components/shared/Button'

type Status = 'new' | 'accepted' | 'rejected' | 'waitlisted'

interface StatusResult {
  status: Status
  name: string
  applied_at: string
  team: { id: string; name: string } | null
  teammates: string[]
  links: {
    zoom: string
    slack: string
    deck_template: string
    problem_brief: string
  }
}

function ReviewingState({ result }: { result: StatusResult }) {
  const appliedDate = new Date(result.applied_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric',
  })
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-primary mb-3">Your application is under review</h2>
      <p className="text-slate text-sm mb-2">
        We review every application personally. You'll hear from us within 48 hours of applying.
      </p>
      <p className="text-xs text-slate/60 font-mono mt-4">Applied on {appliedDate}</p>
    </div>
  )
}

function AcceptedState({ result }: { result: StatusResult }) {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-primary mb-2">You're in!</h2>
      <p className="text-slate mb-6">Welcome to the Micro-PM Residency, {result.name.split(' ')[0]}.</p>

      {result.team && (
        <div className="bg-card border border-gray-100 rounded-xl p-5 text-left mb-6">
          <p className="text-xs text-slate uppercase tracking-widest mb-2">Your team</p>
          <p className="font-semibold text-primary mb-1">{result.team.name}</p>
          {result.teammates.length > 0 && (
            <p className="text-sm text-slate">With: {result.teammates.join(', ')}</p>
          )}
        </div>
      )}

      <div className="bg-card border border-gray-100 rounded-xl p-5 text-left mb-6">
        <p className="text-xs text-slate uppercase tracking-widest mb-3">Weekend schedule (IST)</p>
        <div className="space-y-2 text-sm">
          <div className="flex gap-3"><span className="font-medium text-primary w-20">Friday</span><span className="text-slate">6:00 PM – 8:00 PM</span></div>
          <div className="flex gap-3"><span className="font-medium text-primary w-20">Saturday</span><span className="text-slate">10:00 AM – 6:00 PM</span></div>
          <div className="flex gap-3"><span className="font-medium text-primary w-20">Sunday</span><span className="text-slate">10:00 AM – 1:00 PM</span></div>
        </div>
      </div>

      <div className="bg-card border border-gray-100 rounded-xl p-5 text-left">
        <p className="text-xs text-slate uppercase tracking-widest mb-3">Links</p>
        <div className="space-y-2">
          {[
            'Zoom meeting link',
            'Slack workspace',
            'Deck template',
            'Problem brief',
          ].map((label) => (
            <div
              key={label}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-slate/50">{label}</span>
              <span className="text-xs text-slate/40 bg-gray-100 px-2 py-0.5 rounded font-mono">
                Coming soon
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function WaitlistedState() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-primary mb-3">You're on the waitlist</h2>
      <p className="text-slate text-sm">
        If a spot opens up, you'll be the first to know. We'll email you.
      </p>
    </div>
  )
}

function RejectedState() {
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-slate" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
        </svg>
      </div>
      <h2 className="font-display text-2xl text-primary mb-3">This cohort is full</h2>
      <p className="text-slate text-sm">
        You're on the priority list for the next cohort. We'll reach out when applications open.
      </p>
    </div>
  )
}

export default function StatusChecker() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<StatusResult | null>(null)
  const [notFound, setNotFound] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setNotFound(false)
    setResult(null)

    const res = await fetch('/api/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })

    if (res.status === 404) {
      setNotFound(true)
    } else if (res.ok) {
      const data = await res.json()
      setResult(data)
    }

    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      {/* Search form */}
      {!result && (
        <form onSubmit={handleSubmit} className="space-y-4 mb-8">
          <input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              setNotFound(false)
            }}
            placeholder="Enter the email you applied with"
            required
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors"
          />
          {notFound && (
            <div className="text-sm text-slate bg-gray-50 border border-gray-100 rounded-lg px-4 py-3">
              We couldn&apos;t find an application with this email.{' '}
              <Link href="/apply" className="text-accent hover:underline">
                Apply here →
              </Link>
            </div>
          )}
          <Button type="submit" disabled={!email || loading} className="w-full py-3">
            {loading ? 'Checking...' : 'Check status →'}
          </Button>
        </form>
      )}

      {/* Result */}
      {result && (
        <div>
          {result.status === 'new' && <ReviewingState result={result} />}
          {result.status === 'accepted' && <AcceptedState result={result} />}
          {result.status === 'waitlisted' && <WaitlistedState />}
          {result.status === 'rejected' && <RejectedState />}

          <button
            onClick={() => { setResult(null); setEmail('') }}
            className="mt-8 text-sm text-slate hover:text-primary transition-colors cursor-pointer block mx-auto"
          >
            ← Check a different email
          </button>
        </div>
      )}
    </div>
  )
}
