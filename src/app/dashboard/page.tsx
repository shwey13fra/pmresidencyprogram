'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardLayout, { DashboardTab } from '@/components/dashboard/DashboardLayout'
import OverviewTab, {
  type Applicant,
  type Team,
  type Teammate,
  type Task,
  type ChecklistItem,
  type Resource,
  type ActivityEvent,
} from '@/components/dashboard/OverviewTab'
import TasksTab from '@/components/dashboard/TasksTab'
import ScheduleTab from '@/components/dashboard/ScheduleTab'
import DeliverablesTab from '@/components/dashboard/DeliverablesTab'
import NotesTab, { type Note, type PrivateNote } from '@/components/dashboard/NotesTab'
import InterviewsTab, { type Interview } from '@/components/dashboard/InterviewsTab'

export type StartupProblem = {
  id: string
  startup_name: string
  startup_problem: string | null
  startup_pm_name: string | null
  startup_data_description: string | null
  zoom_link: string | null
  miro_link: string | null
  slack_link: string | null
  deck_template_link: string | null
  problem_brief_link: string | null
  interview_guide_link: string | null
}

type DashboardData = {
  applicant: Applicant
  team: Team | null
  teammates: Teammate[]
  problem: StartupProblem | null
  pmFeedback: string | null
  cohortDate: string | null
  mustSetPassword?: boolean
}

// ── Login screen ───────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: (data: DashboardData, email: string) => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [step, setStep] = useState<'email' | 'password'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password: step === 'password' ? password : undefined }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Something went wrong. Please try again.')
        return
      }

      // Server says this account has a password — show password field
      if (data.requiresPassword) {
        setStep('password')
        return
      }

      onSuccess(data as DashboardData, email.trim())
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    border: '1.5px solid #252347',
    background: '#1f1e3d',
    color: '#e8e5ff',
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#09091f' }}>
      <header className="h-14 flex items-center px-6" style={{ background: '#060614', borderBottom: '1px solid #1a1836' }}>
        <span className="font-semibold text-lg" style={{ fontFamily: 'var(--font-display)', color: '#e8e5ff' }}>
          Micro-PM Residency
        </span>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md rounded-3xl p-8 sm:p-10"
          style={{ background: '#131228', border: '1.5px solid #252347', boxShadow: '0 4px 32px rgba(0,0,0,0.4)' }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
            style={{ background: 'linear-gradient(135deg, #6d6af5, #4a7cf5)' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M10 2L13 8H17L14 12L15.5 18L10 15L4.5 18L6 12L3 8H7L10 2Z" fill="white" />
            </svg>
          </div>

          <h1 className="text-2xl font-bold mb-2" style={{ fontFamily: 'var(--font-display)', color: '#e8e5ff' }}>
            Participant Dashboard
          </h1>
          <p className="text-sm mb-8" style={{ color: '#7b789e' }}>
            {step === 'email'
              ? 'Enter the email you applied with to access your dashboard.'
              : `Enter your password for ${email}`}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {step === 'email' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: '#e8e5ff' }}>Email address</label>
                <input
                  type="email"
                  required
                  autoFocus
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6d6af5')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#252347')}
                />
              </div>
            )}

            {step === 'password' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium" style={{ color: '#e8e5ff' }}>Password</label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Your password"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#6d6af5')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#252347')}
                />
                <button
                  type="button"
                  onClick={() => { setStep('email'); setPassword(''); setError('') }}
                  className="text-xs text-left mt-1"
                  style={{ color: '#4d4b6b' }}
                >
                  ← Use a different email
                </button>
              </div>
            )}

            {error && (
              <p className="text-sm px-4 py-3 rounded-xl" style={{ background: '#3b0a0a', color: '#fca5a5', border: '1px solid #7f1d1d' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email || (step === 'password' && !password)}
              className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: loading ? '#1f1e3d' : 'linear-gradient(135deg, #6d6af5, #4a7cf5)',
                color: loading ? '#4d4b6b' : '#fff',
                cursor: loading ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Checking…' : step === 'email' ? 'Continue' : 'Sign In'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#4d4b6b' }}>
            Not sure about your status?{' '}
            <a href="/status" style={{ color: '#6d6af5' }} className="underline underline-offset-2">
              Check here
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

// ── Set password banner ────────────────────────────────────────────────────

function SetPasswordBanner({ email, onDone }: { email: string; onDone: () => void }) {
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setSaving(true)
    const res = await fetch('/api/dashboard/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    setSaving(false)
    if (res.ok) { onDone() } else { setError('Failed to set password. Try again.') }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
    >
      <div
        className="w-full max-w-md rounded-3xl p-8"
        style={{ background: '#131228', border: '1.5px solid #252347', boxShadow: '0 8px 48px rgba(0,0,0,0.6)' }}
      >
        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#1e1b4b' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#818cf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        </div>

        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: '#e8e5ff' }}>
          Set your password
        </h2>
        <p className="text-sm mb-6" style={{ color: '#7b789e' }}>
          Secure your account so only you can access this dashboard. You&apos;ll use this password from next login.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a password (min 8 characters)"
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: '#1f1e3d', border: '1.5px solid #252347', color: '#e8e5ff' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#6d6af5')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#252347')}
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Confirm password"
            className="w-full px-4 py-3 rounded-xl text-sm outline-none"
            style={{ background: '#1f1e3d', border: '1.5px solid #252347', color: '#e8e5ff' }}
            onFocus={(e) => (e.currentTarget.style.borderColor = '#6d6af5')}
            onBlur={(e) => (e.currentTarget.style.borderColor = '#252347')}
          />

          {error && (
            <p className="text-sm px-4 py-3 rounded-xl" style={{ background: '#3b0a0a', color: '#fca5a5', border: '1px solid #7f1d1d' }}>
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={saving || !password || !confirm}
            className="w-full py-3 rounded-xl text-sm font-semibold mt-1"
            style={{
              background: saving || !password || !confirm ? '#1f1e3d' : 'linear-gradient(135deg, #6d6af5, #4a7cf5)',
              color: saving || !password || !confirm ? '#4d4b6b' : '#fff',
              cursor: saving || !password || !confirm ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? 'Saving…' : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Placeholder tab content ────────────────────────────────────────────────

function TabPlaceholder({ label }: { label: string }) {
  return (
    <div
      className="rounded-xl p-10 flex flex-col items-center justify-center text-center min-h-48"
      style={{ background: '#fff', border: '1px solid #e8e5df' }}
    >
      <p className="text-sm font-medium" style={{ color: '#64748b' }}>
        {label} — tab content coming next
      </p>
    </div>
  )
}

// ── Toast ──────────────────────────────────────────────────────────────────

function ErrorToast({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl text-sm font-medium flex items-center gap-3"
      style={{ background: '#1f1e3d', color: '#e8e5ff', border: '1.5px solid #2d2b55', boxShadow: '0 4px 24px rgba(0,0,0,0.5)', minWidth: '260px' }}
    >
      <span style={{ color: '#dc2626' }}>✕</span>
      {message}
      <button onClick={onDismiss} className="ml-auto text-xs opacity-60 hover:opacity-100">
        Dismiss
      </button>
    </div>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────

const SESSION_KEY = 'dashboard_auth'
const EMAIL_KEY = 'dashboard_email'

export default function DashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview')
  const [hydrated, setHydrated] = useState(false)
  const [mustSetPassword, setMustSetPassword] = useState(false)
  const [authEmail, setAuthEmail] = useState('')

  useEffect(() => {
    let cached: DashboardData | null = null
    try {
      const saved = sessionStorage.getItem(SESSION_KEY)
      if (saved) cached = JSON.parse(saved)
      if (cached) setDashboardData(cached)
      const tab = sessionStorage.getItem('dashboard_tab') as DashboardTab | null
      if (tab) setActiveTab(tab)
    } catch {}
    setHydrated(true)

    // Always re-fetch fresh data on load to pick up any admin changes
    const email = sessionStorage.getItem(EMAIL_KEY)
    if (email) {
      setAuthEmail(email)
      fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((fresh) => {
          // Only update if we got real dashboard data (not a requiresPassword stub)
          if (fresh?.applicant) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh))
            setDashboardData(fresh)
            if (fresh.mustSetPassword) setMustSetPassword(true)
          }
        })
        .catch(() => {})
    }
  }, [])
  const [tasks, setTasks] = useState<Task[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [privateNotes, setPrivateNotes] = useState<PrivateNote[]>([])
  const [resources, setResources] = useState<Resource[]>([])
  const [activity, setActivity] = useState<ActivityEvent[]>([])
  const [deckUrl, setDeckUrl] = useState<string | null>(null)
  const [deckSubmittedAt, setDeckSubmittedAt] = useState<string | null>(null)
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [loadingChecklist, setLoadingChecklist] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [loadingInterviews, setLoadingInterviews] = useState(false)
  const [loadingPrivateNotes, setLoadingPrivateNotes] = useState(false)
  const [loadingResources, setLoadingResources] = useState(false)
  const [loadingActivity, setLoadingActivity] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function handleAuthSuccess(data: DashboardData, email: string) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
    sessionStorage.setItem(EMAIL_KEY, email)
    setAuthEmail(email)
    setDashboardData(data)
    if (data.mustSetPassword) setMustSetPassword(true)
  }

  // Fetch tasks + checklist once authenticated
  useEffect(() => {
    if (!dashboardData) return
    const { applicant, team } = dashboardData

    if (team?.id) {
      setLoadingTasks(true)
      fetch(`/api/dashboard/tasks?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => setTasks(d.tasks ?? []))
        .catch(() => {})
        .finally(() => setLoadingTasks(false))
    }

    if (applicant?.id) {
      setLoadingChecklist(true)
      fetch(`/api/dashboard/checklist?applicant_id=${applicant.id}`)
        .then((r) => r.json())
        .then((d) => setChecklist(d.items ?? []))
        .catch(() => {})
        .finally(() => setLoadingChecklist(false))
    }

    if (team?.id) {
      setLoadingNotes(true)
      fetch(`/api/dashboard/notes?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => setNotes(d.notes ?? []))
        .catch(() => {})
        .finally(() => setLoadingNotes(false))

      setLoadingInterviews(true)
      fetch(`/api/dashboard/interviews?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => setInterviews(d.interviews ?? []))
        .catch(() => {})
        .finally(() => setLoadingInterviews(false))

      setLoadingResources(true)
      fetch(`/api/dashboard/resources?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => setResources(d.resources ?? []))
        .catch(() => {})
        .finally(() => setLoadingResources(false))

      setLoadingActivity(true)
      fetch(`/api/dashboard/activity?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => setActivity(d.activity ?? []))
        .catch(() => {})
        .finally(() => setLoadingActivity(false))

      fetch(`/api/dashboard/deliverables/deck?team_id=${team.id}`)
        .then((r) => r.json())
        .then((d) => { setDeckUrl(d.deck_url ?? null); setDeckSubmittedAt(d.deck_submitted_at ?? null) })
        .catch(() => {})
    }

    if (applicant?.id) {
      setLoadingPrivateNotes(true)
      fetch(`/api/dashboard/private-notes?applicant_id=${applicant.id}`)
        .then((r) => r.json())
        .then((d) => setPrivateNotes(d.notes ?? []))
        .catch(() => {})
        .finally(() => setLoadingPrivateNotes(false))
    }
  }, [dashboardData])

  const handleChecklistToggle = useCallback(async (id: string, current: boolean) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_done: !current } : item))
    )
    const res = await fetch('/api/dashboard/checklist', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId: id, is_done: !current }),
    })
    if (!res.ok) {
      setChecklist((prev) =>
        prev.map((item) => (item.id === id ? { ...item, is_done: current } : item))
      )
    }
  }, [])

  const handleTaskStatusChange = useCallback(async (taskId: string, newStatus: Task['status']) => {
    const prev = tasks.find((t) => t.id === taskId)
    if (!prev) return
    // Optimistic update
    setTasks((all) =>
      all.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    )
    setUpdatingTaskId(taskId)
    const res = await fetch('/api/dashboard/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, status: newStatus }),
    })
    setUpdatingTaskId(null)
    if (!res.ok) {
      // Revert
      setTasks((all) =>
        all.map((t) => (t.id === taskId ? { ...t, status: prev.status } : t))
      )
      setToast('Failed to update task. Please try again.')
      setTimeout(() => setToast(null), 4000)
    }
  }, [tasks])

  const handleTaskAssign = useCallback(async (taskId: string) => {
    if (!dashboardData) return
    setTasks((all) => all.map((t) => t.id === taskId ? { ...t, assignee_id: dashboardData.applicant.id } : t))
    const res = await fetch('/api/dashboard/tasks', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId, assignee_id: dashboardData.applicant.id }),
    })
    if (!res.ok) {
      setTasks((all) => all.map((t) => t.id === taskId ? { ...t, assignee_id: null } : t))
      setToast('Failed to assign task. Please try again.')
      setTimeout(() => setToast(null), 4000)
    }
  }, [dashboardData])

  const handleTaskAdd = useCallback(async (data: { title: string; type: Task['type']; priority: Task['priority'] }) => {
    if (!dashboardData) return
    const res = await fetch('/api/dashboard/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: dashboardData.team?.id, author_id: dashboardData.applicant.id, ...data }),
    })
    if (res.ok) {
      const { task } = await res.json()
      setTasks((prev) => [...prev, task])
    } else {
      setToast('Failed to add task. Please try again.')
      setTimeout(() => setToast(null), 4000)
    }
  }, [dashboardData])

  const handleAddNote = useCallback(async (note: Omit<Note, 'id' | 'created_at'>) => {
    const res = await fetch('/api/dashboard/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
    if (res.ok) {
      const { note: created } = await res.json()
      setNotes((prev) => [created, ...prev])
      // Refresh activity feed
      if (dashboardData?.team?.id) {
        fetch(`/api/dashboard/activity?team_id=${dashboardData.team.id}`)
          .then((r) => r.json()).then((d) => setActivity(d.activity ?? [])).catch(() => {})
      }
    }
  }, [dashboardData])

  const handleAddInterview = useCallback(async (data: { interviewee_name: string; interviewee_role: string; key_insight: string; notes: string }) => {
    if (!dashboardData) return
    const res = await fetch('/api/dashboard/interviews', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: dashboardData.team?.id, author_id: dashboardData.applicant.id, ...data }),
    })
    if (res.ok) {
      const { interview } = await res.json()
      setInterviews((prev) => [interview, ...prev])
      if (dashboardData?.team?.id) {
        fetch(`/api/dashboard/activity?team_id=${dashboardData.team.id}`)
          .then((r) => r.json()).then((d) => setActivity(d.activity ?? [])).catch(() => {})
      }
    }
  }, [dashboardData])

  const handleDeleteInterview = useCallback(async (id: string) => {
    if (!dashboardData) return
    const res = await fetch(`/api/dashboard/interviews?id=${id}&requestor_id=${dashboardData.applicant.id}`, { method: 'DELETE' })
    if (res.ok) setInterviews((prev) => prev.filter((i) => i.id !== id))
  }, [dashboardData])

  const handleAddPrivateNote = useCallback(async (content: string) => {
    if (!dashboardData) return
    const res = await fetch('/api/dashboard/private-notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ applicant_id: dashboardData.applicant.id, content }),
    })
    if (res.ok) {
      const { note } = await res.json()
      setPrivateNotes((prev) => [note, ...prev])
    }
  }, [dashboardData])

  const handleDeletePrivateNote = useCallback(async (id: string) => {
    const res = await fetch(`/api/dashboard/private-notes?id=${id}`, { method: 'DELETE' })
    if (res.ok) setPrivateNotes((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const handleSubmitDeck = useCallback(async (url: string) => {
    if (!dashboardData?.team?.id) return
    const res = await fetch('/api/dashboard/deliverables/deck', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ team_id: dashboardData.team.id, deck_url: url }),
    })
    if (res.ok) {
      const { deck_url, deck_submitted_at } = await res.json()
      setDeckUrl(deck_url)
      setDeckSubmittedAt(deck_submitted_at)
    }
  }, [dashboardData])

  if (!hydrated) return null

  if (!dashboardData) {
    return <LoginScreen onSuccess={handleAuthSuccess} />
  }

  const { applicant, team, teammates, problem, pmFeedback, cohortDate } = dashboardData

  return (
    <>
      {mustSetPassword && (
        <SetPasswordBanner
          email={authEmail}
          onDone={() => setMustSetPassword(false)}
        />
      )}
      {toast && <ErrorToast message={toast} onDismiss={() => setToast(null)} />}
      <DashboardLayout
        name={applicant.name}
        cohortDate={cohortDate}
        activeTab={activeTab}
        onTabChange={(tab) => { sessionStorage.setItem('dashboard_tab', tab); setActiveTab(tab) }}
      >
        {activeTab === 'overview' && (
          <OverviewTab
            user={applicant}
            team={team}
            teammates={teammates}
            problem={problem}
            tasks={tasks}
            checklist={checklist}
            resources={resources}
            activity={activity}
            onChecklistToggle={handleChecklistToggle}
            loadingTasks={loadingTasks}
            loadingChecklist={loadingChecklist}
            loadingResources={loadingResources}
            loadingActivity={loadingActivity}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksTab
            tasks={tasks}
            user={applicant}
            teammates={teammates}
            teamName={team?.name ?? 'Your Team'}
            onTaskStatusChange={handleTaskStatusChange}
            onTaskAssign={handleTaskAssign}
            onTaskAdd={handleTaskAdd}
            loading={loadingTasks}
            updatingTaskId={updatingTaskId}
          />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab />
        )}
        {activeTab === 'deliverables' && (
          <DeliverablesTab
            problem={problem}
            pmFeedback={pmFeedback}
            deckUrl={deckUrl}
            deckSubmittedAt={deckSubmittedAt}
            onSubmitDeck={handleSubmitDeck}
          />
        )}
        {activeTab === 'notes' && (
          <NotesTab
            notes={notes}
            user={applicant}
            teammates={teammates}
            privateNotes={privateNotes}
            onAddNote={handleAddNote}
            onAddPrivateNote={handleAddPrivateNote}
            onDeletePrivateNote={handleDeletePrivateNote}
            loading={loadingNotes}
            loadingPrivate={loadingPrivateNotes}
          />
        )}
        {activeTab === 'interviews' && (
          <InterviewsTab
            interviews={interviews}
            user={applicant}
            teammates={teammates}
            teamName={team?.name ?? 'Your Team'}
            onAddInterview={handleAddInterview}
            onDeleteInterview={handleDeleteInterview}
            loading={loadingInterviews}
          />
        )}
      </DashboardLayout>
    </>
  )
}
