'use client'
import { useState, useRef, useEffect } from 'react'
import type { Applicant, Teammate } from './OverviewTab'

// ── Types ──────────────────────────────────────────────────────────────────

export type Interview = {
  id: string
  team_id: string
  author_id: string
  interviewee_name: string
  interviewee_role: string | null
  key_insight: string | null
  notes: string | null
  created_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true,
  })
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Mic button ─────────────────────────────────────────────────────────────

function MicButton({ onAppend }: { onAppend: (text: string) => void }) {
  const [listening, setListening] = useState(false)
  const [supported, setSupported] = useState(true) // optimistic — hide only if confirmed unsupported
  const recRef = useRef<any>(null)

  useEffect(() => {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    setSupported(!!SR)
  }, [])

  function toggle() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setSupported(false); return }

    if (listening) {
      recRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SR()
    rec.lang = 'en-IN'
    rec.interimResults = false
    rec.continuous = true
    rec.onresult = (e: any) => {
      const transcript = Array.from(e.results as SpeechRecognitionResultList)
        .filter((r: any) => r.isFinal)
        .map((r: any) => r[0].transcript as string)
        .join(' ')
        .trim()
      if (transcript) onAppend(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recRef.current = rec
    rec.start()
    setListening(true)
  }

  if (!supported) return null

  return (
    <button
      type="button"
      onClick={toggle}
      title={listening ? 'Stop recording' : 'Speak to fill this field'}
      className="flex items-center gap-1.5 rounded-lg px-2 transition-all shrink-0"
      style={{
        height: 28,
        background: listening ? 'rgba(220,38,38,0.12)' : 'var(--dc-note)',
        border: `1.5px solid ${listening ? '#dc2626' : 'var(--dc-border)'}`,
        color: listening ? '#dc2626' : 'var(--dc-text-3)',
      }}
    >
      {listening ? (
        <>
          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#dc2626', display: 'inline-block', animation: 'pulse 1s ease-in-out infinite' }} />
          <span style={{ fontSize: 11 }}>Recording…</span>
        </>
      ) : (
        <>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
            <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
          <span style={{ fontSize: 11 }}>Voice</span>
        </>
      )}
    </button>
  )
}

// ── Interview Card ─────────────────────────────────────────────────────────

function InterviewCard({
  interview,
  conductorName,
  isMe,
  onDelete,
}: {
  interview: Interview
  conductorName: string
  isMe: boolean
  onDelete: (id: string) => void
}) {
  return (
    <div
      className="rounded-3xl p-5 transition-all duration-200"
      style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-border-hover)'; (e.currentTarget as HTMLElement).style.background = 'var(--dc-note-hover)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-note-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--dc-note)' }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: 'var(--dc-avatar)', color: '#fff' }}
          >
            {interview.interviewee_name.slice(0, 1).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>
              {interview.interviewee_name}
            </p>
            {interview.interviewee_role && (
              <p className="text-xs" style={{ color: 'var(--dc-text-2)' }}>{interview.interviewee_role}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs tabular-nums" style={{ color: 'var(--dc-text-3)' }}>
            {formatDate(interview.created_at)}
          </span>
          {isMe && (
            <button
              onClick={() => onDelete(interview.id)}
              className="text-xs transition-colors"
              style={{ color: 'var(--dc-text-3)' }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dc-high-color)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dc-text-3)')}
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Key insight */}
      {interview.key_insight && (
        <div className="rounded-2xl px-4 py-3 mb-3" style={{ background: 'var(--dc-accent-bg)', border: '1px solid var(--dc-note-border)' }}>
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--dc-insight-color)' }}>💡 Key Insight</p>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--dc-text-1)' }}>{interview.key_insight}</p>
        </div>
      )}

      {/* Notes */}
      {interview.notes && (
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--dc-text-2)' }}>
          {interview.notes}
        </p>
      )}

      {/* Conducted by */}
      <div className="flex items-center gap-2 mt-4 pt-3 border-t" style={{ borderColor: 'var(--dc-border)' }}>
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold"
          style={isMe
            ? { background: 'var(--dc-avatar)', color: '#fff' }
            : { background: 'var(--dc-avatar-other)', color: 'var(--dc-avatar-other-txt)' }
          }
        >
          {getInitials(conductorName)}
        </div>
        <span className="text-xs" style={{ color: 'var(--dc-text-3)' }}>
          Conducted by <span style={{ color: 'var(--dc-text-2)' }}>{conductorName}</span>
          {isMe && <span className="ml-1" style={{ color: 'var(--dc-accent)' }}>· You</span>}
        </span>
      </div>
    </div>
  )
}

// ── Add form ───────────────────────────────────────────────────────────────

function AddInterviewForm({
  onSubmit,
  onCancel,
}: {
  onSubmit: (data: { interviewee_name: string; interviewee_role: string; key_insight: string; notes: string }) => Promise<void>
  onCancel: () => void
}) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('')
  const [insight, setInsight] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    await onSubmit({ interviewee_name: name, interviewee_role: role, key_insight: insight, notes })
    setSaving(false)
  }

  const inputStyle = {
    background: 'var(--dc-card)',
    border: '1.5px solid var(--dc-border)',
    color: 'var(--dc-text-1)',
    borderRadius: '12px',
    padding: '10px 14px',
    fontSize: '14px',
    width: '100%',
    outline: 'none',
  }

  function appendToInsight(text: string) {
    setInsight((prev) => prev ? `${prev} ${text}` : text)
  }

  function appendToNotes(text: string) {
    setNotes((prev) => prev ? `${prev} ${text}` : text)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="dark-card rounded-3xl p-6 flex flex-col gap-4"
    >
      <p className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>Log a User Interview</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--dc-text-2)' }}>Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Priya Sharma"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
            autoFocus
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-medium" style={{ color: 'var(--dc-text-2)' }}>Role / Context</label>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="e.g. Mid-level PM, 3 yrs exp"
            style={inputStyle}
            onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
            onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium" style={{ color: 'var(--dc-text-2)' }}>Key Insight</label>
          <MicButton onAppend={appendToInsight} />
        </div>
        <input
          type="text"
          value={insight}
          onChange={(e) => setInsight(e.target.value)}
          placeholder="The one thing that surprised you most"
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium" style={{ color: 'var(--dc-text-2)' }}>Notes</label>
          <MicButton onAppend={appendToNotes} />
        </div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Pain points, quotes, observations..."
          rows={3}
          style={{ ...inputStyle, resize: 'none' }}
          onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
          onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={saving || !name.trim()}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: saving || !name.trim() ? 'var(--dc-note)' : 'var(--dc-gradient)',
            color: saving || !name.trim() ? 'var(--dc-text-3)' : '#fff',
            cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Saving…' : 'Save Interview'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 text-sm transition-colors"
          style={{ color: 'var(--dc-text-3)' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dc-text-2)')}
          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dc-text-3)')}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface InterviewsTabProps {
  interviews: Interview[]
  user: Applicant
  teammates: Teammate[]
  teamName: string
  onAddInterview: (data: { interviewee_name: string; interviewee_role: string; key_insight: string; notes: string }) => Promise<void>
  onDeleteInterview: (id: string) => Promise<void>
  loading?: boolean
}

export default function InterviewsTab({
  interviews, user, teammates, teamName,
  onAddInterview, onDeleteInterview, loading,
}: InterviewsTabProps) {
  const [showForm, setShowForm] = useState(false)
  // Auto-open form when there are no interviews
  const autoOpened = useRef(false)
  useEffect(() => {
    if (!loading && interviews.length === 0 && !autoOpened.current) {
      autoOpened.current = true
      setShowForm(true)
    }
  }, [loading, interviews.length])

  function getName(authorId: string) {
    if (authorId === user.id) return user.name
    return teammates.find((t) => t.id === authorId)?.name ?? 'Teammate'
  }

  async function handleAdd(data: { interviewee_name: string; interviewee_role: string; key_insight: string; notes: string }) {
    await onAddInterview(data)
    setShowForm(false)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
            User Interviews
          </h2>
          <p className="text-sm" style={{ color: 'var(--dc-text-2)' }}>
            Log every user interview. Capture name, role, key insight, and raw notes.
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0"
            style={{ background: 'var(--dc-gradient)', color: '#fff' }}
          >
            + Log Interview
          </button>
        )}
      </div>

      {/* Stats bar */}
      {!loading && (
        <div className="flex items-center gap-6">
          <div className="dark-card rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color: 'var(--dc-accent)' }}>{interviews.length}</span>
            <span className="text-sm" style={{ color: 'var(--dc-text-2)' }}>interviews logged</span>
          </div>
          <div className="dark-card rounded-2xl px-5 py-3 flex items-center gap-3">
            <span className="text-2xl font-bold" style={{ color: 'var(--dc-accent-2)' }}>
              {interviews.filter(i => i.key_insight).length}
            </span>
            <span className="text-sm" style={{ color: 'var(--dc-text-2)' }}>with key insights</span>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && <AddInterviewForm onSubmit={handleAdd} onCancel={() => setShowForm(false)} />}

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2].map((n) => (
            <div key={n} className="rounded-3xl p-5" style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-2xl animate-pulse bg-[var(--dc-border)]" />
                <div className="flex flex-col gap-1.5">
                  <div className="h-3 w-32 rounded animate-pulse bg-[var(--dc-border)]" />
                  <div className="h-3 w-20 rounded animate-pulse bg-[var(--dc-note)]" />
                </div>
              </div>
              <div className="h-3 w-full rounded animate-pulse bg-[var(--dc-border)] mb-2" />
              <div className="h-3 w-4/5 rounded animate-pulse bg-[var(--dc-note)]" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && interviews.length === 0 && !showForm && (
        <div
          className="rounded-3xl p-12 flex flex-col items-center justify-center text-center"
          style={{ border: '1.5px dashed var(--dc-border)' }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
            style={{ background: 'var(--dc-accent-bg)' }}
          >
            🎤
          </div>
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--dc-text-1)' }}>No interviews logged yet</p>
          <p className="text-xs mb-5" style={{ color: 'var(--dc-text-3)' }}>
            Each team conducts 2 user interviews on Saturday. Log them here as you go.
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold"
            style={{ background: 'var(--dc-gradient)', color: '#fff' }}
          >
            + Log First Interview
          </button>
        </div>
      )}

      {/* Interview cards */}
      {!loading && interviews.length > 0 && (
        <div className="flex flex-col gap-3">
          {interviews.map((interview) => (
            <InterviewCard
              key={interview.id}
              interview={interview}
              conductorName={getName(interview.author_id)}
              isMe={interview.author_id === user.id}
              onDelete={onDeleteInterview}
            />
          ))}
        </div>
      )}
    </div>
  )
}
