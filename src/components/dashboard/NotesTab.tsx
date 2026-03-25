'use client'
import { useState } from 'react'
import type { Applicant, Teammate } from './OverviewTab'

export type PrivateNote = {
  id: string
  applicant_id: string
  content: string
  created_at: string
}

export type Note = {
  id: string
  team_id: string
  author_id: string
  content: string
  tag: 'insight' | 'decision' | 'risk' | null
  created_at: string
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatTime(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-IN', { weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: true })
}

const TAG_CONFIG = {
  insight:  { emoji: '💡', label: 'Insight',  bg: 'var(--dc-insight-bg)', color: 'var(--dc-insight-color)' },
  decision: { emoji: '🎯', label: 'Decision', bg: 'var(--dc-decision-bg)', color: 'var(--dc-decision-color)' },
  risk:     { emoji: '⚠️', label: 'Risk',     bg: 'var(--dc-risk-bg)', color: 'var(--dc-risk-color)' },
} as const

type Tag = keyof typeof TAG_CONFIG

function NoteCard({ note, authorName, isMe }: { note: Note; authorName: string; isMe: boolean }) {
  const tag = note.tag ? TAG_CONFIG[note.tag] : null

  return (
    <div
      className="rounded-3xl p-5 flex gap-4 transition-all duration-200"
      style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-border-hover)'; (e.currentTarget as HTMLElement).style.background = 'var(--dc-note-hover)' }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-note-border)'; (e.currentTarget as HTMLElement).style.background = 'var(--dc-note)' }}
    >
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5"
        style={isMe
          ? { background: 'var(--dc-avatar)', color: '#fff' }
          : { background: 'var(--dc-avatar-other)', color: 'var(--dc-avatar-other-txt)' }
        }
      >
        {getInitials(authorName)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <span className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>
            {authorName}
            {isMe && (
              <span className="ml-1.5 text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: 'var(--dc-you-bg)', color: 'var(--dc-you-color)' }}>
                You
              </span>
            )}
          </span>
          {tag && (
            <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: tag.bg, color: tag.color }}>
              {tag.emoji} {tag.label}
            </span>
          )}
          <span className="text-xs ml-auto tabular-nums" style={{ color: 'var(--dc-text-3)' }}>
            {formatTime(note.created_at)}
          </span>
        </div>
        <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--dc-text-1)' }}>
          {note.content}
        </p>
      </div>
    </div>
  )
}

interface NotesTabProps {
  notes: Note[]
  user: Applicant
  teammates: Teammate[]
  privateNotes: PrivateNote[]
  onAddNote: (note: Omit<Note, 'id' | 'created_at'>) => Promise<void>
  onAddPrivateNote: (content: string) => Promise<void>
  onDeletePrivateNote: (id: string) => Promise<void>
  loading?: boolean
  loadingPrivate?: boolean
}

export default function NotesTab({
  notes, user, teammates, privateNotes,
  onAddNote, onAddPrivateNote, onDeletePrivateNote,
  loading, loadingPrivate,
}: NotesTabProps) {
  const [view, setView] = useState<'team' | 'private'>('team')
  const [content, setContent] = useState('')
  const [activeTag, setActiveTag] = useState<Tag | null>(null)
  const [posting, setPosting] = useState(false)
  const [privateContent, setPrivateContent] = useState('')
  const [postingPrivate, setPostingPrivate] = useState(false)

  function getAuthorName(authorId: string) {
    if (authorId === user.id) return user.name
    return teammates.find((t) => t.id === authorId)?.name ?? 'Teammate'
  }

  async function handlePost() {
    if (!content.trim()) return
    setPosting(true)
    await onAddNote({ team_id: user.team_id!, author_id: user.id, content: content.trim(), tag: activeTag })
    setContent('')
    setActiveTag(null)
    setPosting(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePost()
  }

  async function handlePrivatePost() {
    if (!privateContent.trim()) return
    setPostingPrivate(true)
    await onAddPrivateNote(privateContent.trim())
    setPrivateContent('')
    setPostingPrivate(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
            Notes &amp; Insights
          </h2>
          <p className="text-sm" style={{ color: 'var(--dc-text-2)' }}>
            {view === 'team' ? 'Visible to your team.' : 'Only visible to you — your private scratchpad.'}
          </p>
        </div>
        {/* Toggle */}
        <div
          className="flex rounded-xl overflow-hidden shrink-0"
          style={{ border: '1.5px solid var(--dc-border)', background: 'var(--dc-card)' }}
        >
          {(['team', 'private'] as const).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className="px-4 py-2 text-sm font-medium transition-all"
              style={{
                background: view === v ? 'var(--dc-insight-bg)' : 'transparent',
                color: view === v ? 'var(--dc-insight-color)' : 'var(--dc-text-3)',
              }}
            >
              {v === 'team' ? '👥 Team' : '🔒 Private'}
            </button>
          ))}
        </div>
      </div>

      {view === 'team' ? (
        <>
          {/* Team input card */}
          <div className="dark-card rounded-3xl p-5">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Capture an insight, decision, or observation..."
              rows={3}
              className="w-full text-sm resize-none outline-none"
              style={{ color: 'var(--dc-text-1)', background: 'transparent' }}
            />
            <div className="flex items-center justify-between flex-wrap gap-3 pt-3 mt-3 border-t" style={{ borderColor: 'var(--dc-border)' }}>
              <div className="flex items-center gap-2 flex-wrap">
                {(Object.entries(TAG_CONFIG) as [Tag, typeof TAG_CONFIG[Tag]][]).map(([key, cfg]) => {
                  const isActive = activeTag === key
                  return (
                    <button
                      key={key}
                      onClick={() => setActiveTag(isActive ? null : key)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition-all"
                      style={{
                        background: isActive ? cfg.bg : 'var(--dc-note)',
                        color: isActive ? cfg.color : 'var(--dc-text-2)',
                        border: `1.5px solid ${isActive ? cfg.color : 'var(--dc-border)'}`,
                      }}
                    >
                      {cfg.emoji} {cfg.label}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={handlePost}
                disabled={posting || !content.trim()}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: posting || !content.trim() ? 'var(--dc-border)' : 'var(--dc-gradient)',
                  color: posting || !content.trim() ? 'var(--dc-text-3)' : '#fff',
                  cursor: posting || !content.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {posting ? 'Posting…' : 'Post'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loading && [1, 2, 3].map((n) => (
              <div key={n} className="rounded-3xl p-5 flex gap-4" style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)' }}>
                <div className="w-8 h-8 rounded-full animate-pulse bg-[var(--dc-border)] shrink-0 mt-0.5" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-32 rounded animate-pulse bg-[var(--dc-border)]" />
                  <div className="h-3 w-full rounded animate-pulse bg-[var(--dc-note)]" />
                  <div className="h-3 w-4/5 rounded animate-pulse bg-[var(--dc-note)]" />
                </div>
              </div>
            ))}
            {!loading && notes.length === 0 && (
              <div className="rounded-3xl p-10 flex items-center justify-center text-center" style={{ border: '1.5px dashed var(--dc-border)' }}>
                <p className="text-sm" style={{ color: 'var(--dc-text-4)' }}>No notes yet. Be the first to capture something.</p>
              </div>
            )}
            {!loading && notes.map((note) => (
              <NoteCard
                key={note.id} note={note}
                authorName={getAuthorName(note.author_id)}
                isMe={note.author_id === user.id}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Private input */}
          <div className="dark-card rounded-3xl p-5">
            <textarea
              value={privateContent}
              onChange={(e) => setPrivateContent(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePrivatePost() }}
              placeholder="Your private thoughts, hypotheses, or things you don't want to share yet..."
              rows={3}
              className="w-full text-sm resize-none outline-none"
              style={{ color: 'var(--dc-text-1)', background: 'transparent' }}
            />
            <div className="flex justify-end pt-3 mt-3 border-t" style={{ borderColor: 'var(--dc-border)' }}>
              <button
                onClick={handlePrivatePost}
                disabled={postingPrivate || !privateContent.trim()}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: postingPrivate || !privateContent.trim() ? 'var(--dc-border)' : 'var(--dc-gradient)',
                  color: postingPrivate || !privateContent.trim() ? 'var(--dc-text-3)' : '#fff',
                  cursor: postingPrivate || !privateContent.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {postingPrivate ? 'Saving…' : 'Save Note'}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {loadingPrivate && [1, 2].map((n) => (
              <div key={n} className="rounded-3xl p-5" style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)' }}>
                <div className="h-3 w-full rounded animate-pulse bg-[var(--dc-border)] mb-2" />
                <div className="h-3 w-3/4 rounded animate-pulse bg-[var(--dc-note)]" />
              </div>
            ))}
            {!loadingPrivate && privateNotes.length === 0 && (
              <div className="rounded-3xl p-10 flex items-center justify-center text-center" style={{ border: '1.5px dashed var(--dc-border)' }}>
                <p className="text-sm" style={{ color: 'var(--dc-text-4)' }}>No private notes yet. This is your scratchpad.</p>
              </div>
            )}
            {!loadingPrivate && privateNotes.map((pn) => (
              <div
                key={pn.id}
                className="rounded-3xl p-5 transition-all duration-200"
                style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-border-hover)' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-note-border)' }}
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs tabular-nums" style={{ color: 'var(--dc-text-3)' }}>{formatTime(pn.created_at)}</span>
                  <button
                    onClick={() => onDeletePrivateNote(pn.id)}
                    className="text-xs transition-colors"
                    style={{ color: 'var(--dc-text-3)' }}
                    onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--dc-risk-color)')}
                    onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--dc-text-3)')}
                  >
                    ✕
                  </button>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: 'var(--dc-text-1)' }}>{pn.content}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
