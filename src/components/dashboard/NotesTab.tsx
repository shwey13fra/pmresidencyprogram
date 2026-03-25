'use client'
import { useState } from 'react'
import type { Applicant, Teammate } from './OverviewTab'

// ── Types ──────────────────────────────────────────────────────────────────

export type Note = {
  id: string
  team_id: string
  author_id: string
  content: string
  tag: 'insight' | 'decision' | 'risk' | null
  created_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', {
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const TAG_CONFIG = {
  insight:  { emoji: '💡', label: 'Insight',  bg: '#eef2ff', color: '#4f46e5' },
  decision: { emoji: '🎯', label: 'Decision', bg: '#fef3e2', color: '#e8913a' },
  risk:     { emoji: '⚠️', label: 'Risk',     bg: '#fef2f2', color: '#dc2626' },
} as const

type Tag = keyof typeof TAG_CONFIG

// ── Note card ──────────────────────────────────────────────────────────────

function NoteCard({
  note,
  authorName,
  isMe,
}: {
  note: Note
  authorName: string
  isMe: boolean
}) {
  const tag = note.tag ? TAG_CONFIG[note.tag] : null

  return (
    <div
      className="rounded-2xl p-5 bg-white flex gap-4"
      style={{ border: '1px solid #e8e5df' }}
    >
      {/* Avatar */}
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={{ background: isMe ? '#e8913a' : '#1a1a2e', color: '#fff' }}
      >
        {getInitials(authorName)}
      </div>

      <div className="flex-1 min-w-0">
        {/* Author + time */}
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
            {authorName}
            {isMe && (
              <span className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded"
                style={{ background: '#fef3e2', color: '#e8913a' }}>
                You
              </span>
            )}
          </span>
          {tag && (
            <span
              className="text-xs font-medium px-2 py-0.5 rounded-full"
              style={{ background: tag.bg, color: tag.color }}
            >
              {tag.emoji} {tag.label}
            </span>
          )}
          <span className="text-xs ml-auto tabular-nums" style={{ color: '#94a3b8' }}>
            {formatTime(note.created_at)}
          </span>
        </div>

        {/* Content */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1a1a2e' }}>
          {note.content}
        </p>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface NotesTabProps {
  notes: Note[]
  user: Applicant
  teammates: Teammate[]
  onAddNote: (note: Omit<Note, 'id' | 'created_at'>) => Promise<void>
  loading?: boolean
}

export default function NotesTab({ notes, user, teammates, onAddNote, loading }: NotesTabProps) {
  const [content, setContent] = useState('')
  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [posting, setPosting] = useState(false)

  function getAuthorName(authorId: string) {
    if (authorId === user.id) return user.name
    return teammates.find((t) => t.id === authorId)?.name ?? 'Teammate'
  }

  async function handlePost() {
    if (!content.trim()) return
    setPosting(true)
    await onAddNote({
      team_id: user.team_id!,
      author_id: user.id,
      content: content.trim(),
      tag: activeTag,
    })
    setContent('')
    setActiveTag(null)
    setPosting(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost()
  }

  return (
    <div className="flex flex-col gap-6">

      {/* Heading */}
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
        >
          Shared Notes &amp; Insights
        </h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          Capture user interview insights, team decisions, and key observations. Visible to your team.
        </p>
      </div>

      {/* Input card */}
      <div className="rounded-2xl bg-white p-5" style={{ border: '1px solid #e8e5df' }}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Capture an insight, decision, or observation..."
          rows={3}
          className="w-full text-sm resize-none outline-none"
          style={{ color: '#1a1a2e', background: 'transparent' }}
        />

        <div
          className="flex items-center justify-between flex-wrap gap-3 pt-3 mt-3 border-t"
          style={{ borderColor: '#e8e5df' }}
        >
          {/* Tag buttons */}
          <div className="flex items-center gap-2 flex-wrap">
            {(Object.entries(TAG_CONFIG) as [Tag, typeof TAG_CONFIG[Tag]][]).map(([key, cfg]) => {
              const isActive = activeTag === key
              return (
                <button
                  key={key}
                  onClick={() => setActiveTag(isActive ? null : key)}
                  className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: isActive ? cfg.bg : '#f8fafc',
                    color: isActive ? cfg.color : '#64748b',
                    border: `1.5px solid ${isActive ? cfg.color : '#e8e5df'}`,
                  }}
                >
                  {cfg.emoji} {cfg.label}
                </button>
              )
            })}
          </div>

          {/* Post button */}
          <button
            onClick={handlePost}
            disabled={posting || !content.trim()}
            className="px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all"
            style={{
              background: posting || !content.trim() ? '#c5c5c5' : '#e8913a',
              cursor: posting || !content.trim() ? 'not-allowed' : 'pointer',
            }}
          >
            {posting ? 'Posting…' : 'Post'}
          </button>
        </div>
      </div>

      {/* Notes feed */}
      <div className="flex flex-col gap-3">
        {loading && (
          <>
            {[1, 2, 3].map((n) => (
              <div key={n} className="rounded-2xl p-5 bg-white flex gap-4" style={{ border: '1px solid #e8e5df' }}>
                <div className="w-8 h-8 rounded-full animate-pulse bg-gray-200 shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-32 rounded animate-pulse bg-gray-200" />
                  <div className="h-3 w-full rounded animate-pulse bg-gray-100" />
                  <div className="h-3 w-4/5 rounded animate-pulse bg-gray-100" />
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && notes.length === 0 && (
          <div
            className="rounded-2xl p-10 flex items-center justify-center text-center"
            style={{ border: '1.5px dashed #e8e5df' }}
          >
            <p className="text-sm" style={{ color: '#94a3b8' }}>
              No notes yet. Be the first to capture something.
            </p>
          </div>
        )}
        {!loading && notes.map((note) => (
          <NoteCard
            key={note.id}
            note={note}
            authorName={getAuthorName(note.author_id)}
            isMe={note.author_id === user.id}
          />
        ))}
      </div>

    </div>
  )
}
