'use client'
import { useState, useEffect, useCallback } from 'react'
import DashboardLayout, { DashboardTab } from '@/components/dashboard/DashboardLayout'
import OverviewTab, {
  type Applicant,
  type Team,
  type Teammate,
  type Task,
  type ChecklistItem,
} from '@/components/dashboard/OverviewTab'
import TasksTab from '@/components/dashboard/TasksTab'
import ScheduleTab from '@/components/dashboard/ScheduleTab'
import DeliverablesTab from '@/components/dashboard/DeliverablesTab'
import NotesTab, { type Note } from '@/components/dashboard/NotesTab'

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
}

// ── Login screen ───────────────────────────────────────────────────────────

function LoginScreen({ onSuccess }: { onSuccess: (data: DashboardData, email: string) => void }) {
  const [email, setEmail] = useState('')
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
        body: JSON.stringify({ email: email.trim() }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(
          'No accepted application found for this email. Check your status page if you\'re unsure.'
        )
        return
      }

      onSuccess(data as DashboardData, email.trim())
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fafaf8' }}>
      {/* Header */}
      <header style={{ background: '#1a1a2e' }} className="h-14 flex items-center px-6">
        <span
          className="font-semibold text-white text-lg"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Micro-PM Residency
        </span>
      </header>

      {/* Centered card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div
          className="w-full max-w-md bg-white rounded-2xl p-8 sm:p-10"
          style={{ border: '1px solid #e8e5df', boxShadow: '0 4px 24px rgba(26,26,46,0.07)' }}
        >
          {/* Logo mark */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center mb-6"
            style={{ background: '#e8913a' }}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M10 2L13 8H17L14 12L15.5 18L10 15L4.5 18L6 12L3 8H7L10 2Z"
                fill="white"
              />
            </svg>
          </div>

          <h1
            className="text-2xl font-bold mb-2"
            style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
          >
            Participant Dashboard
          </h1>
          <p className="text-sm mb-8" style={{ color: '#64748b' }}>
            Enter the email you applied with to access your dashboard.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-sm font-medium"
                style={{ color: '#1a1a2e' }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg text-sm outline-none transition-all"
                style={{
                  border: '1.5px solid #e8e5df',
                  background: '#fafaf8',
                  color: '#1a1a2e',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#e8913a')}
                onBlur={(e) => (e.currentTarget.style.borderColor = '#e8e5df')}
              />
            </div>

            {error && (
              <p className="text-sm px-4 py-3 rounded-lg" style={{ background: '#fef2f2', color: '#dc2626' }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-lg text-sm font-semibold text-white transition-all"
              style={{
                background: loading || !email ? '#c5c5c5' : '#e8913a',
                cursor: loading || !email ? 'not-allowed' : 'pointer',
              }}
            >
              {loading ? 'Checking…' : 'Access Dashboard'}
            </button>
          </form>

          <p className="text-xs text-center mt-6" style={{ color: '#64748b' }}>
            Not sure about your status?{' '}
            <a href="/status" style={{ color: '#e8913a' }} className="underline underline-offset-2">
              Check here
            </a>
          </p>
        </div>
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
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-lg flex items-center gap-3"
      style={{ background: '#1a1a2e', color: '#fff', minWidth: '260px' }}
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
      fetch('/api/dashboard/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then((r) => r.ok ? r.json() : null)
        .then((fresh) => {
          if (fresh) {
            sessionStorage.setItem(SESSION_KEY, JSON.stringify(fresh))
            setDashboardData(fresh)
          }
        })
        .catch(() => {})
    }
  }, [])
  const [tasks, setTasks] = useState<Task[]>([])
  const [checklist, setChecklist] = useState<ChecklistItem[]>([])
  const [notes, setNotes] = useState<Note[]>([])
  const [loadingTasks, setLoadingTasks] = useState(false)
  const [loadingChecklist, setLoadingChecklist] = useState(false)
  const [loadingNotes, setLoadingNotes] = useState(false)
  const [updatingTaskId, setUpdatingTaskId] = useState<string | null>(null)
  const [toast, setToast] = useState<string | null>(null)

  function handleAuthSuccess(data: DashboardData, email: string) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data))
    sessionStorage.setItem(EMAIL_KEY, email)
    setDashboardData(data)
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

  const handleAddNote = useCallback(async (note: Omit<Note, 'id' | 'created_at'>) => {
    const res = await fetch('/api/dashboard/notes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(note),
    })
    if (res.ok) {
      const { note: created } = await res.json()
      setNotes((prev) => [created, ...prev])
    }
  }, [])

  if (!hydrated) return null

  if (!dashboardData) {
    return <LoginScreen onSuccess={handleAuthSuccess} />
  }

  const { applicant, team, teammates, problem, pmFeedback, cohortDate } = dashboardData

  return (
    <>
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
            onChecklistToggle={handleChecklistToggle}
            loadingTasks={loadingTasks}
            loadingChecklist={loadingChecklist}
          />
        )}
        {activeTab === 'tasks' && (
          <TasksTab
            tasks={tasks}
            user={applicant}
            teammates={teammates}
            teamName={team?.name ?? 'Your Team'}
            onTaskStatusChange={handleTaskStatusChange}
            loading={loadingTasks}
            updatingTaskId={updatingTaskId}
          />
        )}
        {activeTab === 'schedule' && (
          <ScheduleTab />
        )}
        {activeTab === 'deliverables' && (
          <DeliverablesTab problem={problem} pmFeedback={pmFeedback} />
        )}
        {activeTab === 'notes' && (
          <NotesTab
            notes={notes}
            user={applicant}
            teammates={teammates}
            onAddNote={handleAddNote}
            loading={loadingNotes}
          />
        )}
      </DashboardLayout>
    </>
  )
}
