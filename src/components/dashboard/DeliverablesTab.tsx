'use client'
import { useState } from 'react'
import type { StartupProblem } from './OverviewTab'

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

const DELIVERABLES = [
  {
    icon: '◈', iconColor: '#a78bfa', iconBg: '#1e1b4b',
    title: 'Portfolio-Ready Recommendation Deck',
    desc: "Your team's deck, built on a real startup's problem with real user insights. Not a case study — real work.",
    badge: 'In Progress', badgeBg: '#2d1f5e', badgeColor: '#a78bfa',
  },
  {
    icon: '◎', iconColor: '#60a5fa', iconBg: '#172040',
    title: 'Written Feedback from a Practising PM',
    desc: "The startup's PM writes a specific feedback summary for your team. What you got right, what you missed, how a PM would think about it differently.",
    badge: 'After Sunday', badgeBg: 'var(--dc-note)', badgeColor: '#5b5a8a',
  },
  {
    icon: '◉', iconColor: '#34d399', iconBg: '#0d3028',
    title: 'Residency Summary for Your Resume',
    desc: 'A one-page document stating the startup you worked with, the problem you tackled, and what you recommended. Link it on LinkedIn.',
    badge: 'After Sunday', badgeBg: 'var(--dc-note)', badgeColor: '#5b5a8a',
  },
]

const FEEDBACK_PLACEHOLDERS = [
  'What you got right',
  'What you missed',
  "How I'd think about it differently",
  'Specific strengths I noticed',
]

interface DeliverablesTabProps {
  problem: StartupProblem | null
  pmFeedback: string | null
  deckUrl: string | null
  deckSubmittedAt: string | null
  onSubmitDeck: (url: string) => Promise<void>
}

export default function DeliverablesTab({ problem, pmFeedback, deckUrl, deckSubmittedAt, onSubmitDeck }: DeliverablesTabProps) {
  const pmName = problem?.startup_pm_name ?? 'Your PM Mentor'
  const hasFeedback = !!pmFeedback
  const [deckInput, setDeckInput] = useState(deckUrl ?? '')
  const [submittingDeck, setSubmittingDeck] = useState(false)
  const [deckEditing, setDeckEditing] = useState(false)

  async function handleDeckSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!deckInput.trim()) return
    setSubmittingDeck(true)
    await onSubmitDeck(deckInput.trim())
    setSubmittingDeck(false)
    setDeckEditing(false)
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
          What You Walk Away With
        </h2>
        <p className="text-sm" style={{ color: 'var(--dc-text-2)' }}>
          These are delivered within 48 hours after Sunday&apos;s presentations.
        </p>
      </div>

      {/* Deck submission */}
      <div className="dark-card rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>Submit Your Deck</p>
              <p className="text-xs" style={{ color: 'var(--dc-text-2)' }}>Share the Google Slides or Canva link with your PM mentor</p>
            </div>
          </div>
          {deckSubmittedAt && (
            <span
              className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
              style={{ background: '#0d3028', color: '#34d399' }}
            >
              ✓ Submitted
            </span>
          )}
        </div>
        <div className="px-6 py-5">
          {deckUrl && !deckEditing ? (
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href={deckUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 min-w-0 text-sm truncate underline underline-offset-2"
                style={{ color: 'var(--dc-insight-color)' }}
              >
                {deckUrl}
              </a>
              <button
                onClick={() => { setDeckInput(deckUrl); setDeckEditing(true) }}
                className="text-xs px-3 py-1.5 rounded-lg shrink-0"
                style={{ background: 'var(--dc-note)', color: 'var(--dc-text-2)', border: '1px solid var(--dc-border)' }}
              >
                Edit
              </button>
            </div>
          ) : (
            <form onSubmit={handleDeckSubmit} className="flex gap-3 flex-wrap">
              <input
                type="url"
                value={deckInput}
                onChange={(e) => setDeckInput(e.target.value)}
                placeholder="https://docs.google.com/presentation/..."
                className="flex-1 min-w-0 text-sm rounded-xl px-4 py-2.5 outline-none"
                style={{ background: 'var(--dc-card)', border: '1.5px solid var(--dc-border)', color: 'var(--dc-text-1)' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
                onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
              />
              <button
                type="submit"
                disabled={submittingDeck || !deckInput.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
                style={{
                  background: submittingDeck || !deckInput.trim() ? 'var(--dc-note)' : 'var(--dc-gradient)',
                  color: submittingDeck || !deckInput.trim() ? 'var(--dc-text-3)' : '#fff',
                  cursor: submittingDeck || !deckInput.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {submittingDeck ? 'Saving…' : 'Submit Deck'}
              </button>
              {deckEditing && (
                <button
                  type="button"
                  onClick={() => setDeckEditing(false)}
                  className="px-3 py-2.5 text-sm"
                  style={{ color: 'var(--dc-text-3)' }}
                >
                  Cancel
                </button>
              )}
            </form>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {DELIVERABLES.map((d) => (
          <div
            key={d.title}
            className="dark-card rounded-3xl p-6 flex items-start gap-5"
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: d.iconBg, color: d.iconColor }}
            >
              {d.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <h3 className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>{d.title}</h3>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: d.badgeBg, color: d.badgeColor }}
                >
                  {d.badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--dc-text-2)' }}>{d.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* PM Feedback */}
      <div className="dark-card rounded-3xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center gap-4" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: 'var(--dc-avatar)', color: '#fff' }}
          >
            {getInitials(pmName)}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>{pmName}</p>
            <p className="text-xs" style={{ color: 'var(--dc-text-2)' }}>PM Feedback Preview</p>
          </div>
        </div>

        <div className="px-6 py-5">
          {hasFeedback ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--dc-text-1)' }}>
              {pmFeedback}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {FEEDBACK_PLACEHOLDERS.map((item) => (
                <div key={item} className="rounded-2xl px-4 py-3 flex items-center gap-3" style={{ border: '1.5px dashed var(--dc-border)' }}>
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: 'var(--dc-text-4)' }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: 'var(--dc-text-3)' }}>{item}</p>
                    <p className="text-xs" style={{ color: 'var(--dc-text-4)' }}>Feedback will appear here after Sunday</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
