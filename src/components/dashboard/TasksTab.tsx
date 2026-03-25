'use client'
import { useState } from 'react'
import type { Task, Applicant, Teammate } from './OverviewTab'

// ── Column config ──────────────────────────────────────────────────────────

type Status = Task['status']

const COLUMNS: {
  status: Status
  label: string
  dot: string
  bg: string
  border: string
  badge: string
}[] = [
  {
    status: 'todo',
    label: 'To Do',
    dot: '#94a3b8',
    bg: '#f8fafc',
    border: '#e2e8f0',
    badge: '#f1f5f9',
  },
  {
    status: 'in_progress',
    label: 'In Progress',
    dot: '#e8913a',
    bg: '#fffbf5',
    border: '#fed7aa',
    badge: '#fef3e2',
  },
  {
    status: 'review',
    label: 'Review',
    dot: '#3b82f6',
    bg: '#f0f7ff',
    border: '#bfdbfe',
    badge: '#eff6ff',
  },
  {
    status: 'done',
    label: 'Done',
    dot: '#16a34a',
    bg: '#f0fdf4',
    border: '#bbf7d0',
    badge: '#dcfce7',
  },
]

// ── Badge helpers ──────────────────────────────────────────────────────────

const TYPE_STYLE: Record<Task['type'], { bg: string; color: string; label: string }> = {
  individual:    { bg: '#eef2ff', color: '#4f46e5', label: 'Individual' },
  collaborative: { bg: '#f0fdfa', color: '#0d9488', label: 'Collaborative' },
}

const PRIORITY_STYLE: Record<Task['priority'], { bg: string; color: string; label: string }> = {
  high:   { bg: '#fef2f2', color: '#dc2626', label: 'High' },
  medium: { bg: '#fef3e2', color: '#e8913a', label: 'Medium' },
  low:    { bg: '#f0fdf4', color: '#16a34a', label: 'Low' },
}

function Badge({ style }: { style: { bg: string; color: string; label: string } }) {
  return (
    <span
      className="px-2 py-0.5 rounded text-xs font-medium"
      style={{ background: style.bg, color: style.color }}
    >
      {style.label}
    </span>
  )
}

// ── Assignee label ─────────────────────────────────────────────────────────

function AssigneeLabel({
  task,
  user,
  teammates,
  teamName,
}: {
  task: Task
  user: Applicant
  teammates: Teammate[]
  teamName: string
}) {
  if (!task.assignee_id) {
    return (
      <span className="text-xs" style={{ color: '#64748b' }}>
        👥 {teamName}
      </span>
    )
  }
  if (task.assignee_id === user.id) {
    return (
      <span className="text-xs font-medium" style={{ color: '#4f46e5' }}>
        👤 You
      </span>
    )
  }
  const mate = teammates.find((t) => t.id === task.assignee_id)
  return (
    <span className="text-xs" style={{ color: '#64748b' }}>
      👤 {mate?.name ?? 'Teammate'}
    </span>
  )
}

// ── Task card ──────────────────────────────────────────────────────────────

function TaskCard({
  task,
  user,
  teammates,
  teamName,
  onDragStart,
  updating,
}: {
  task: Task
  user: Applicant
  teammates: Teammate[]
  teamName: string
  onDragStart: (id: string) => void
  updating?: boolean
}) {
  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="rounded-xl p-4 cursor-grab active:cursor-grabbing select-none transition-all hover:shadow-md"
      style={{ background: '#fff', border: '1px solid #e8e5df', opacity: updating ? 0.6 : 1 }}
    >
      <p className="text-sm font-semibold mb-3 leading-snug" style={{ color: '#1a1a2e' }}>
        {task.title}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge style={TYPE_STYLE[task.type]} />
        <Badge style={PRIORITY_STYLE[task.priority]} />
      </div>

      <div className="flex items-center justify-between">
        <AssigneeLabel task={task} user={user} teammates={teammates} teamName={teamName} />
        {updating && (
            <span className="text-xs" style={{ color: '#94a3b8' }}>updating…</span>
          )}
          {!updating && task.due_label && (
            <span className="text-xs tabular-nums" style={{ color: '#94a3b8' }}>
              {task.due_label}
            </span>
          )}
      </div>
    </div>
  )
}

// ── Desktop column ─────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  tasks,
  user,
  teammates,
  teamName,
  draggingId,
  updatingTaskId,
  onDragStart,
  onDrop,
}: {
  col: typeof COLUMNS[number]
  tasks: Task[]
  user: Applicant
  teammates: Teammate[]
  teamName: string
  draggingId: string | null
  updatingTaskId?: string | null
  onDragStart: (id: string) => void
  onDrop: (status: Status) => void
}) {
  const [isOver, setIsOver] = useState(false)

  return (
    <div
      className="flex flex-col gap-3 min-h-32 rounded-2xl p-3 transition-colors"
      style={{
        background: isOver ? col.bg : '#fafaf8',
        border: `2px solid ${isOver ? col.dot : '#e8e5df'}`,
        minHeight: '480px',
      }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { setIsOver(false); onDrop(col.status) }}
    >
      {/* Column header */}
      <div className="flex items-center justify-between px-1 mb-1">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.dot }} />
          <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
            {col.label}
          </span>
        </div>
        <span
          className="text-xs font-medium px-2 py-0.5 rounded-full"
          style={{ background: col.badge, color: col.dot }}
        >
          {tasks.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-2">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            user={user}
            teammates={teammates}
            teamName={teamName}
            onDragStart={onDragStart}
            updating={updatingTaskId === task.id}
          />
        ))}
        {tasks.length === 0 && (
          <div
            className="rounded-xl border-2 border-dashed flex items-center justify-center h-20"
            style={{ borderColor: col.border }}
          >
            <span className="text-xs" style={{ color: '#94a3b8' }}>Drop here</span>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Mobile accordion column ────────────────────────────────────────────────

function MobileColumn({
  col,
  tasks,
  user,
  teammates,
  teamName,
  onDrop,
}: {
  col: typeof COLUMNS[number]
  tasks: Task[]
  user: Applicant
  teammates: Teammate[]
  teamName: string
  onDrop: (status: Status) => void
}) {
  const [open, setOpen] = useState(col.status === 'todo' || col.status === 'in_progress')
  const [isOver, setIsOver] = useState(false)

  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors"
      style={{ border: `2px solid ${isOver ? col.dot : '#e8e5df'}` }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { setIsOver(false); onDrop(col.status) }}
    >
      {/* Accordion header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: col.bg }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.dot }} />
          <span className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>{col.label}</span>
          <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={{ background: col.badge, color: col.dot }}
          >
            {tasks.length}
          </span>
        </div>
        <span className="text-xs" style={{ color: '#64748b' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2 p-3" style={{ background: '#fafaf8' }}>
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              user={user}
              teammates={teammates}
              teamName={teamName}
              onDragStart={() => {}}
            />
          ))}
          {tasks.length === 0 && (
            <p className="text-xs text-center py-3" style={{ color: '#94a3b8' }}>No tasks here</p>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface TasksTabProps {
  tasks: Task[]
  user: Applicant
  teammates: Teammate[]
  teamName: string
  onTaskStatusChange: (taskId: string, newStatus: Status) => void
  loading?: boolean
  updatingTaskId?: string | null
}

export default function TasksTab({
  tasks,
  user,
  teammates,
  teamName,
  onTaskStatusChange,
  loading,
  updatingTaskId,
}: TasksTabProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function handleDrop(newStatus: Status) {
    if (!draggingId) return
    const task = tasks.find((t) => t.id === draggingId)
    if (task && task.status !== newStatus) {
      onTaskStatusChange(draggingId, newStatus)
    }
    setDraggingId(null)
  }

  const byStatus = (status: Status) => tasks.filter((t) => t.status === status)

  return (
    <div className="flex flex-col gap-5">

      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2
          className="text-xl font-bold"
          style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
        >
          Task Board
        </h2>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: TYPE_STYLE.individual.bg, color: TYPE_STYLE.individual.color }}
            >
              Individual
            </span>
            <span
              className="px-2 py-0.5 rounded text-xs font-medium"
              style={{ background: TYPE_STYLE.collaborative.bg, color: TYPE_STYLE.collaborative.color }}
            >
              Collaborative
            </span>
          </div>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="hidden md:grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div
              key={col.status}
              className="rounded-2xl p-3"
              style={{ background: '#fafaf8', border: '2px solid #e8e5df', minHeight: '480px' }}
            >
              <div className="flex items-center gap-2 px-1 mb-3">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-gray-300" />
                <div className="h-3 w-16 rounded animate-pulse bg-gray-200" />
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-xl p-4 bg-white" style={{ border: '1px solid #e8e5df' }}>
                    <div className="h-3 w-full rounded animate-pulse bg-gray-200 mb-3" />
                    <div className="h-3 w-3/4 rounded animate-pulse bg-gray-200 mb-3" />
                    <div className="flex gap-1.5">
                      <div className="h-4 w-16 rounded animate-pulse bg-gray-100" />
                      <div className="h-4 w-12 rounded animate-pulse bg-gray-100" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Desktop board */}
      {!loading && (
        <div className="hidden md:grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <KanbanColumn
              key={col.status}
              col={col}
              tasks={byStatus(col.status)}
              user={user}
              teammates={teammates}
              teamName={teamName}
              draggingId={draggingId}
              updatingTaskId={updatingTaskId}
              onDragStart={setDraggingId}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* Mobile accordion */}
      {!loading && (
        <div className="flex flex-col gap-3 md:hidden">
          {COLUMNS.map((col) => (
            <MobileColumn
              key={col.status}
              col={col}
              tasks={byStatus(col.status)}
              user={user}
              teammates={teammates}
              teamName={teamName}
              onDrop={handleDrop}
            />
          ))}
        </div>
      )}

      {/* Mobile loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3 md:hidden">
          {COLUMNS.map((col) => (
            <div key={col.status} className="rounded-2xl overflow-hidden" style={{ border: '2px solid #e8e5df' }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: col.bg }}>
                <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-gray-300" />
                <div className="h-3 w-16 rounded animate-pulse bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  )
}
