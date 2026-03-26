'use client'
import { useState } from 'react'
import type { Task, Applicant, Teammate } from './OverviewTab'

type Status = Task['status']

const COLUMNS: {
  status: Status
  label: string
  dot: string
  bg: string
  border: string
  badge: string
  badgeText: string
}[] = [
  { status: 'todo',        label: 'To Do',       dot: '#5b5a8a', bg: 'var(--dc-col-todo)', border: 'var(--dc-border)', badge: 'var(--dc-note)', badgeText: '#5b5a8a' },
  { status: 'in_progress', label: 'In Progress',  dot: '#a78bfa', bg: 'var(--dc-col-prog)', border: 'var(--dc-border)', badge: 'var(--dc-note)', badgeText: '#a78bfa' },
  { status: 'review',      label: 'Review',       dot: '#60a5fa', bg: 'var(--dc-col-rev)',  border: 'var(--dc-border)', badge: 'var(--dc-note)', badgeText: '#60a5fa' },
  { status: 'done',        label: 'Done',         dot: '#34d399', bg: 'var(--dc-col-done)', border: 'var(--dc-border)', badge: 'var(--dc-note)', badgeText: '#34d399' },
]

const TYPE_STYLE: Record<Task['type'], { bg: string; color: string; label: string }> = {
  individual:    { bg: 'var(--dc-indiv-bg)',  color: 'var(--dc-indiv-color)',  label: 'Individual' },
  collaborative: { bg: 'var(--dc-collab-bg)', color: 'var(--dc-collab-color)', label: 'Collaborative' },
}

const PRIORITY_STYLE: Record<Task['priority'], { bg: string; color: string; label: string }> = {
  high:   { bg: 'var(--dc-high-bg)',  color: 'var(--dc-high-color)',  label: 'High' },
  medium: { bg: 'var(--dc-med-bg)',   color: 'var(--dc-med-color)',   label: 'Medium' },
  low:    { bg: 'var(--dc-low-bg)',   color: 'var(--dc-low-color)',   label: 'Low' },
}

function Badge({ style }: { style: { bg: string; color: string; label: string } }) {
  return (
    <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: style.bg, color: style.color }}>
      {style.label}
    </span>
  )
}

function AssigneeLabel({ task, user, teammates, teamName }: { task: Task; user: Applicant; teammates: Teammate[]; teamName: string }) {
  if (!task.assignee_id) return <span className="text-xs" style={{ color: 'var(--dc-text-2)' }}>👥 {teamName}</span>
  if (task.assignee_id === user.id) return <span className="text-xs font-medium" style={{ color: 'var(--dc-indiv-color)' }}>👤 You</span>
  const mate = teammates.find((t) => t.id === task.assignee_id)
  return <span className="text-xs" style={{ color: 'var(--dc-text-2)' }}>👤 {mate?.name ?? 'Teammate'}</span>
}

function TaskCard({
  task, user, teammates, teamName, onDragStart, updating, onAssign,
}: {
  task: Task; user: Applicant; teammates: Teammate[]; teamName: string
  onDragStart: (id: string) => void; updating?: boolean
  onAssign: (taskId: string) => void
}) {
  const canTakeIt = task.type === 'individual' && !task.assignee_id

  return (
    <div
      draggable
      onDragStart={() => onDragStart(task.id)}
      className="rounded-2xl p-4 cursor-grab active:cursor-grabbing select-none transition-all duration-200 hover:-translate-y-0.5"
      style={{
        background: updating ? 'var(--dc-elevated)' : 'var(--dc-note)',
        border: '1.5px solid var(--dc-note-border)',
        boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        opacity: updating ? 0.6 : 1,
      }}
      onMouseEnter={(e) => { if (!updating) { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-border-hover)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(109,106,245,0.2)' } }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-note-border)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)' }}
    >
      <p className="text-sm font-semibold mb-3 leading-snug" style={{ color: 'var(--dc-text-1)' }}>{task.title}</p>
      <div className="flex flex-wrap gap-1.5 mb-3">
        <Badge style={TYPE_STYLE[task.type]} />
        <Badge style={PRIORITY_STYLE[task.priority]} />
      </div>
      <div className="flex items-center justify-between gap-2">
        <AssigneeLabel task={task} user={user} teammates={teammates} teamName={teamName} />
        <div className="flex items-center gap-2 shrink-0">
          {updating && <span className="text-xs" style={{ color: 'var(--dc-text-2)' }}>updating…</span>}
          {!updating && task.due_label && (
            <span className="text-xs tabular-nums" style={{ color: 'var(--dc-text-3)' }}>{task.due_label}</span>
          )}
          {!updating && canTakeIt && (
            <button
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => { e.stopPropagation(); onAssign(task.id) }}
              className="text-xs px-2 py-0.5 rounded-lg font-medium transition-all"
              style={{ background: 'var(--dc-accent-bg)', color: 'var(--dc-accent)', border: '1px solid var(--dc-border)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--dc-accent)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--dc-accent-bg)'; (e.currentTarget as HTMLElement).style.color = 'var(--dc-accent)' }}
            >
              Take it
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Inline add task form ────────────────────────────────────────────────────

function AddTaskForm({
  onAdd, onCancel,
}: {
  onAdd: (data: { title: string; type: Task['type']; priority: Task['priority'] }) => Promise<void>
  onCancel: () => void
}) {
  const [title, setTitle] = useState('')
  const [type, setType] = useState<Task['type']>('individual')
  const [priority, setPriority] = useState<Task['priority']>('medium')
  const [saving, setSaving] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    await onAdd({ title, type, priority })
    setSaving(false)
  }

  const inputStyle = {
    background: 'var(--dc-card)',
    border: '1.5px solid var(--dc-border)',
    color: 'var(--dc-text-1)',
    borderRadius: '10px',
    padding: '8px 12px',
    fontSize: '13px',
    outline: 'none',
    width: '100%',
  }

  const selectStyle = {
    ...inputStyle,
    cursor: 'pointer',
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-3 flex flex-col gap-2.5"
      style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-accent)', boxShadow: '0 0 0 3px var(--dc-accent-bg)' }}
    >
      <input
        autoFocus
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title…"
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = 'var(--dc-accent)')}
        onBlur={(e) => (e.currentTarget.style.borderColor = 'var(--dc-border)')}
      />
      <div className="flex gap-2">
        <select value={type} onChange={(e) => setType(e.target.value as Task['type'])} style={selectStyle}>
          <option value="individual">Individual</option>
          <option value="collaborative">Collaborative</option>
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value as Task['priority'])} style={selectStyle}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>
      <div className="flex gap-2">
        <button
          type="submit"
          disabled={saving || !title.trim()}
          className="flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all"
          style={{
            background: saving || !title.trim() ? 'var(--dc-border)' : 'var(--dc-gradient)',
            color: saving || !title.trim() ? 'var(--dc-text-3)' : '#fff',
            cursor: saving || !title.trim() ? 'not-allowed' : 'pointer',
          }}
        >
          {saving ? 'Adding…' : 'Add Task'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-3 py-1.5 rounded-lg text-xs transition-all"
          style={{ color: 'var(--dc-text-3)', background: 'var(--dc-card)' }}
        >
          Cancel
        </button>
      </div>
    </form>
  )
}

// ── Kanban column ───────────────────────────────────────────────────────────

function KanbanColumn({
  col, tasks, user, teammates, teamName, draggingId, updatingTaskId,
  onDragStart, onDrop, onAssign, onAddTask,
}: {
  col: typeof COLUMNS[number]; tasks: Task[]; user: Applicant; teammates: Teammate[]; teamName: string
  draggingId: string | null; updatingTaskId?: string | null
  onDragStart: (id: string) => void; onDrop: (status: Status) => void
  onAssign: (taskId: string) => void
  onAddTask: (data: { title: string; type: Task['type']; priority: Task['priority'] }) => Promise<void>
}) {
  const [isOver, setIsOver] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  async function handleAdd(data: { title: string; type: Task['type']; priority: Task['priority'] }) {
    await onAddTask(data)
    setShowAddForm(false)
  }

  return (
    <div
      className="flex flex-col gap-3 rounded-3xl p-3 transition-all duration-200"
      style={{
        background: isOver ? col.bg : 'var(--dc-card)',
        border: `2px solid ${isOver ? col.dot : col.border}`,
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
          <span className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>{col.label}</span>
        </div>
        <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: col.badge, color: col.badgeText }}>
          {tasks.length}
        </span>
      </div>

      {/* Task cards */}
      <div className="flex flex-col gap-2 flex-1">
        {tasks.map((task) => (
          <TaskCard
            key={task.id} task={task} user={user} teammates={teammates}
            teamName={teamName} onDragStart={onDragStart}
            updating={updatingTaskId === task.id}
            onAssign={onAssign}
          />
        ))}
        {tasks.length === 0 && !showAddForm && (
          <div
            className="rounded-xl border-2 border-dashed flex items-center justify-center h-20"
            style={{ borderColor: col.border }}
          >
            <span className="text-xs" style={{ color: 'var(--dc-text-4)' }}>Drop here</span>
          </div>
        )}
      </div>

      {/* Add task — only on To Do column */}
      {col.status === 'todo' && (
        <div className="mt-auto pt-2">
          {showAddForm ? (
            <AddTaskForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
          ) : (
            <button
              onClick={() => setShowAddForm(true)}
              className="w-full py-2 rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5"
              style={{ color: 'var(--dc-text-3)', background: 'transparent', border: '1.5px dashed var(--dc-border)' }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--dc-accent)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-accent)' }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = 'var(--dc-text-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--dc-border)' }}
            >
              + Add task
            </button>
          )}
        </div>
      )}
    </div>
  )
}

// ── Mobile column ───────────────────────────────────────────────────────────

function MobileColumn({
  col, tasks, user, teammates, teamName, onDrop, onAssign, onAddTask,
}: {
  col: typeof COLUMNS[number]; tasks: Task[]; user: Applicant; teammates: Teammate[]; teamName: string
  onDrop: (status: Status) => void
  onAssign: (taskId: string) => void
  onAddTask: (data: { title: string; type: Task['type']; priority: Task['priority'] }) => Promise<void>
}) {
  const [open, setOpen] = useState(col.status === 'todo' || col.status === 'in_progress')
  const [isOver, setIsOver] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)

  async function handleAdd(data: { title: string; type: Task['type']; priority: Task['priority'] }) {
    await onAddTask(data)
    setShowAddForm(false)
  }

  return (
    <div
      className="rounded-3xl overflow-hidden transition-all duration-200"
      style={{ border: `2px solid ${isOver ? col.dot : col.border}` }}
      onDragOver={(e) => { e.preventDefault(); setIsOver(true) }}
      onDragLeave={() => setIsOver(false)}
      onDrop={() => { setIsOver(false); onDrop(col.status) }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3"
        style={{ background: col.bg }}
      >
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: col.dot }} />
          <span className="text-sm font-semibold" style={{ color: 'var(--dc-text-1)' }}>{col.label}</span>
          <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ background: col.badge, color: col.badgeText }}>
            {tasks.length}
          </span>
        </div>
        <span className="text-xs" style={{ color: 'var(--dc-text-3)' }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2 p-3" style={{ background: 'var(--dc-card)' }}>
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} user={user} teammates={teammates}
              teamName={teamName} onDragStart={() => {}} onAssign={onAssign} />
          ))}
          {tasks.length === 0 && !showAddForm && (
            <p className="text-xs text-center py-3" style={{ color: 'var(--dc-text-4)' }}>No tasks here</p>
          )}
          {col.status === 'todo' && (
            <div className="mt-1">
              {showAddForm ? (
                <AddTaskForm onAdd={handleAdd} onCancel={() => setShowAddForm(false)} />
              ) : (
                <button
                  onClick={() => setShowAddForm(true)}
                  className="w-full py-2 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5"
                  style={{ color: 'var(--dc-text-3)', background: 'transparent', border: '1.5px dashed var(--dc-border)' }}
                >
                  + Add task
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Main component ──────────────────────────────────────────────────────────

interface TasksTabProps {
  tasks: Task[]
  user: Applicant
  teammates: Teammate[]
  teamName: string
  onTaskStatusChange: (taskId: string, newStatus: Status) => void
  onTaskAssign: (taskId: string) => void
  onTaskAdd: (data: { title: string; type: Task['type']; priority: Task['priority'] }) => Promise<void>
  loading?: boolean
  updatingTaskId?: string | null
}

export default function TasksTab({
  tasks, user, teammates, teamName,
  onTaskStatusChange, onTaskAssign, onTaskAdd,
  loading, updatingTaskId,
}: TasksTabProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)

  function handleDrop(newStatus: Status) {
    if (!draggingId) return
    const task = tasks.find((t) => t.id === draggingId)
    if (task && task.status !== newStatus) onTaskStatusChange(draggingId, newStatus)
    setDraggingId(null)
  }

  const byStatus = (status: Status) => tasks.filter((t) => t.status === status)

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
          Task Board
        </h2>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: TYPE_STYLE.individual.bg, color: TYPE_STYLE.individual.color }}>
            Individual — assigned to you
          </span>
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: TYPE_STYLE.collaborative.bg, color: TYPE_STYLE.collaborative.color }}>
            Collaborative — whole team
          </span>
        </div>
      </div>

      {/* Loading skeleton desktop */}
      {loading && (
        <div className="hidden md:grid grid-cols-4 gap-4">
          {COLUMNS.map((col) => (
            <div key={col.status} className="rounded-3xl p-3" style={{ background: 'var(--dc-card)', border: `2px solid ${col.border}`, minHeight: '480px' }}>
              <div className="flex items-center gap-2 px-1 mb-3">
                <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[var(--dc-border)]" />
                <div className="h-3 w-16 rounded animate-pulse bg-[var(--dc-note)]" />
              </div>
              <div className="flex flex-col gap-2">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="rounded-2xl p-4" style={{ background: 'var(--dc-note)', border: '1.5px solid var(--dc-note-border)' }}>
                    <div className="h-3 w-full rounded animate-pulse bg-[var(--dc-border)] mb-3" />
                    <div className="h-3 w-3/4 rounded animate-pulse bg-[var(--dc-border)] mb-3" />
                    <div className="flex gap-1.5">
                      <div className="h-4 w-16 rounded animate-pulse bg-[var(--dc-note-border)]" />
                      <div className="h-4 w-12 rounded animate-pulse bg-[var(--dc-note-border)]" />
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
              key={col.status} col={col} tasks={byStatus(col.status)}
              user={user} teammates={teammates} teamName={teamName}
              draggingId={draggingId} updatingTaskId={updatingTaskId}
              onDragStart={setDraggingId} onDrop={handleDrop}
              onAssign={onTaskAssign} onAddTask={onTaskAdd}
            />
          ))}
        </div>
      )}

      {/* Mobile accordion */}
      {!loading && (
        <div className="flex flex-col gap-3 md:hidden">
          {COLUMNS.map((col) => (
            <MobileColumn key={col.status} col={col} tasks={byStatus(col.status)}
              user={user} teammates={teammates} teamName={teamName}
              onDrop={handleDrop} onAssign={onTaskAssign} onAddTask={onTaskAdd}
            />
          ))}
        </div>
      )}

      {/* Mobile loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3 md:hidden">
          {COLUMNS.map((col) => (
            <div key={col.status} className="rounded-3xl overflow-hidden" style={{ border: `2px solid ${col.border}` }}>
              <div className="flex items-center gap-2 px-4 py-3" style={{ background: col.bg }}>
                <div className="w-2.5 h-2.5 rounded-full animate-pulse bg-[var(--dc-border)]" />
                <div className="h-3 w-16 rounded animate-pulse bg-[var(--dc-note)]" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
