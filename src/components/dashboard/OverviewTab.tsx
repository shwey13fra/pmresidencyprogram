'use client'

// ── Types ──────────────────────────────────────────────────────────────────

export type Applicant = {
  id: string
  name: string
  email: string
  current_role: string
  team_id: string | null
  dashboard_token: string | null
}

export type Team = {
  id: string
  name: string
}

export type Teammate = {
  id: string
  name: string
  current_role: string
}

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

export type Task = {
  id: string
  team_id: string
  title: string
  type: 'individual' | 'collaborative'
  status: 'todo' | 'in_progress' | 'review' | 'done'
  priority: 'high' | 'medium' | 'low'
  due_label: string | null
  assignee_id: string | null
}

export type ChecklistItem = {
  id: string
  applicant_id: string
  text: string
  is_done: boolean
  sort_order: number
}

export type Resource = {
  id: string
  team_id: string | null
  title: string
  url: string
  description: string | null
  type: string
  created_at: string
}

export type ActivityEvent = {
  id: string
  type: 'note' | 'interview'
  actor_name: string
  summary: string
  created_at: string
}

// ── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

// ── Progress Ring ──────────────────────────────────────────────────────────

function ProgressRing({ pct }: { pct: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="var(--dc-ring-track)" strokeWidth="8" />
      <circle
        cx="50" cy="50" r={r} fill="none"
        stroke="url(#ring-gradient)"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <defs>
        <linearGradient id="ring-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--dc-accent)" />
          <stop offset="100%" stopColor="var(--dc-accent-2)" />
        </linearGradient>
      </defs>
      <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="var(--dc-text-1)">
        {pct}%
      </text>
    </svg>
  )
}

// ── Quick links config ─────────────────────────────────────────────────────

const LINK_DEFS = [
  { key: 'zoom_link',            emoji: '🎥', label: 'Zoom Call',        desc: 'Join the video call' },
  { key: 'miro_link',            emoji: '🗂️',  label: 'Miro Board',       desc: 'Collaborate visually' },
  { key: 'slack_link',           emoji: '💬', label: 'Slack Channel',    desc: 'Team communication' },
  { key: 'deck_template_link',   emoji: '📊', label: 'Deck Template',    desc: 'Presentation starter' },
  { key: 'problem_brief_link',   emoji: '📄', label: 'Problem Brief',    desc: 'Read the brief' },
  { key: 'interview_guide_link', emoji: '🎤', label: 'Interview Guide',  desc: 'User research guide' },
] as const

// ── Sub-components ─────────────────────────────────────────────────────────

function WelcomeCard({
  name,
  teamName,
  config,
}: {
  name: string
  teamName: string | null
  config: StartupProblem | null
}) {
  const quickLinks = [
    { label: 'Zoom',  href: config?.zoom_link },
    { label: 'Miro',  href: config?.miro_link },
    { label: 'Slack', href: config?.slack_link },
  ]

  return (
    <div
      className="rounded-3xl p-7 flex flex-col justify-between min-h-52"
      style={{
        background: 'var(--dc-welcome)',
        border: '1.5px solid var(--dc-welcome-border)',
        boxShadow: '0 4px 32px var(--dc-welcome-shadow)',
      }}
    >
      <div>
        <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--dc-accent)' }}>
          WELCOME BACK
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold mb-3 leading-snug"
          style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}
        >
          Hey {name.split(' ')[0]}, you&apos;re in{' '}
          <span style={{ color: 'var(--dc-welcome-link-txt)' }}>{teamName ?? 'your team'}</span>
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--dc-welcome-muted)' }}>
          {config?.startup_name
            ? `You're working on ${config.startup_name}'s problem this weekend.`
            : 'Get ready for the weekend.'}{' '}
          {config?.startup_pm_name && (
            <>Your PM mentor is <span className="font-medium" style={{ color: 'var(--dc-text-1)' }}>{config.startup_pm_name}</span>.</>
          )}
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mt-5">
        {quickLinks.map(({ label, href }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'var(--dc-welcome-link-bg)', color: 'var(--dc-welcome-link-txt)', border: '1px solid var(--dc-welcome-link-bd)' }}
            >
              {label} ↗
            </a>
          ) : (
            <span
              key={label}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(128,128,128,0.08)', color: 'var(--dc-text-4)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              {label}
            </span>
          )
        )}
      </div>
    </div>
  )
}

function ProgressCard({
  tasks,
  checklist,
  loadingTasks,
  loadingChecklist,
}: {
  tasks: Task[]
  checklist: ChecklistItem[]
  loadingTasks?: boolean
  loadingChecklist?: boolean
}) {
  const doneTasks = tasks.filter((t) => t.status === 'done').length
  const totalTasks = tasks.length
  const taskPct = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0

  const doneChecks = checklist.filter((c) => c.is_done).length
  const totalChecks = checklist.length
  const checkPct = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0

  return (
    <div className="dark-card rounded-3xl p-6 flex flex-col gap-5 h-full">
      <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>
        YOUR PROGRESS
      </p>

      <div className="flex flex-col items-center gap-1">
        {loadingTasks ? (
          <div className="w-[100px] h-[100px] rounded-full animate-pulse bg-[var(--dc-note)] flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--dc-border)]" />
          </div>
        ) : (
          <ProgressRing pct={taskPct} />
        )}
        {loadingTasks ? (
          <div className="h-3 w-28 rounded animate-pulse bg-[var(--dc-border)] mt-1" />
        ) : (
          <p className="text-xs text-center" style={{ color: 'var(--dc-text-2)' }}>
            {doneTasks} of {totalTasks} tasks done
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium" style={{ color: 'var(--dc-text-1)' }}>Pre-weekend checklist</p>
          {!loadingChecklist && (
            <p className="text-xs tabular-nums" style={{ color: 'var(--dc-text-2)' }}>
              {doneChecks}/{totalChecks}
            </p>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--dc-border)' }}>
          {loadingChecklist ? (
            <div className="h-full w-1/3 rounded-full animate-pulse bg-[#3a3870]" />
          ) : (
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${checkPct}%`, background: 'var(--dc-gradient)' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ProblemBriefCard({ config }: { config: StartupProblem | null }) {
  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-6 py-4 flex items-center gap-2 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <span className="text-lg">📋</span>
        <h3 className="text-sm font-semibold truncate" style={{ color: 'var(--dc-text-1)' }}>
          The Problem Brief
          {config?.startup_name && (
            <span style={{ color: 'var(--dc-accent)' }}> — {config.startup_name}</span>
          )}
        </h3>
      </div>
      <div className="px-6 py-5">
        {config?.startup_problem ? (
          <p className="text-sm leading-relaxed" style={{ color: 'var(--dc-text-1)' }}>
            {config.startup_problem}
          </p>
        ) : (
          <p className="text-sm italic" style={{ color: 'var(--dc-text-3)' }}>
            Problem brief not yet published. Check back soon.
          </p>
        )}
        {config?.startup_data_description && (
          <p className="text-xs mt-4 pt-4 border-t" style={{ color: 'var(--dc-text-2)', borderColor: 'var(--dc-border)' }}>
            <span className="font-medium" style={{ color: 'var(--dc-text-1)' }}>Data provided:</span>{' '}
            {config.startup_data_description}
          </p>
        )}
      </div>
    </div>
  )
}

function QuickLinksCard({ config }: { config: StartupProblem | null }) {
  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>
          QUICK LINKS
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--dc-note)' }}>
        {LINK_DEFS.map(({ key, emoji, label, desc }) => {
          const href = config?.[key] ?? null
          return (
            <div key={key} className="group">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 transition-colors"
                  style={{ borderColor: 'var(--dc-note)' }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--dc-link-hover)')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                >
                  <span className="text-lg w-7 shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--dc-text-1)' }}>{label}</p>
                    <p className="text-xs truncate" style={{ color: 'var(--dc-text-2)' }}>{desc}</p>
                  </div>
                  <span className="text-xs opacity-0 group-hover:opacity-100 transition-opacity shrink-0" style={{ color: 'var(--dc-accent)' }}>
                    →
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-lg w-7 shrink-0 opacity-30">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--dc-text-3)' }}>{label}</p>
                    <p className="text-xs" style={{ color: 'var(--dc-text-4)' }}>Coming soon</p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function TeamCard({ user, teammates }: { user: Applicant; teammates: Teammate[] }) {
  const all = [
    { id: user.id, name: user.name, current_role: user.current_role, isMe: true },
    ...teammates.map((t) => ({ ...t, isMe: false })),
  ]

  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>YOUR TEAM</p>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--dc-note)' }}>
        {all.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 px-5 py-3.5 transition-colors"
            style={member.isMe ? { background: 'var(--dc-active-row)' } : {}}
            onMouseEnter={(e) => { if (!member.isMe) e.currentTarget.style.background = 'var(--dc-card-hover)' }}
            onMouseLeave={(e) => { if (!member.isMe) e.currentTarget.style.background = 'transparent' }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={member.isMe
                ? { background: 'var(--dc-avatar)', color: '#fff' }
                : { background: 'var(--dc-avatar-other)', color: 'var(--dc-avatar-other-txt)' }
              }
            >
              {getInitials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate" style={{ color: 'var(--dc-text-1)' }}>{member.name}</p>
                {member.isMe && (
                  <span className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0" style={{ background: 'var(--dc-you-bg)', color: 'var(--dc-you-color)' }}>
                    You
                  </span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: 'var(--dc-text-2)' }}>{member.current_role}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChecklistCard({
  items,
  onToggle,
  loading,
}: {
  items: ChecklistItem[]
  onToggle: (id: string, current: boolean) => void
  loading?: boolean
}) {
  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>
          PRE-WEEKEND CHECKLIST
        </p>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--dc-note)' }}>
        {loading && [1, 2, 3, 4].map((n) => (
          <div key={n} className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-5 h-5 rounded animate-pulse bg-[var(--dc-border)] shrink-0" />
            <div className="h-3 rounded animate-pulse bg-[var(--dc-note)] flex-1" />
          </div>
        ))}
        {!loading && items.length === 0 && (
          <p className="text-sm px-5 py-4 italic" style={{ color: 'var(--dc-text-3)' }}>No checklist items yet.</p>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id, item.is_done)}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--dc-link-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <div
              className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                border: item.is_done ? 'none' : '2px solid var(--dc-border)',
                background: item.is_done ? 'var(--dc-check-done)' : 'transparent',
              }}
            >
              {item.is_done && (
                <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                  <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </div>
            <span
              className="text-sm transition-all"
              style={{
                color: item.is_done ? 'var(--dc-text-3)' : 'var(--dc-text-1)',
                textDecoration: item.is_done ? 'line-through' : 'none',
              }}
            >
              {item.text}
            </span>
          </button>
        ))}
      </div>
    </div>
  )
}

// ── Resources Card ─────────────────────────────────────────────────────────

function ResourcesCard({ resources, loading }: { resources: Resource[]; loading?: boolean }) {
  const TYPE_ICON: Record<string, string> = {
    link: '🔗', video: '🎥', doc: '📄', template: '📊', guide: '📚',
  }

  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>RESOURCES</p>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--dc-note)' }}>
        {loading && [1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-7 h-7 rounded-lg animate-pulse bg-[var(--dc-border)] shrink-0" />
            <div className="flex flex-col gap-1.5 flex-1">
              <div className="h-3 w-40 rounded animate-pulse bg-[var(--dc-border)]" />
              <div className="h-3 w-28 rounded animate-pulse bg-[var(--dc-note)]" />
            </div>
          </div>
        ))}
        {!loading && resources.length === 0 && (
          <p className="text-sm px-5 py-4 italic" style={{ color: 'var(--dc-text-3)' }}>No resources added yet.</p>
        )}
        {!loading && resources.map((r) => (
          <a
            key={r.id}
            href={r.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-5 py-3.5 transition-colors"
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--dc-link-hover)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <span className="text-lg w-7 shrink-0">{TYPE_ICON[r.type] ?? '🔗'}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: 'var(--dc-text-1)' }}>{r.title}</p>
              {r.description && (
                <p className="text-xs truncate" style={{ color: 'var(--dc-text-2)' }}>{r.description}</p>
              )}
            </div>
            <span className="text-xs shrink-0" style={{ color: 'var(--dc-accent)' }}>→</span>
          </a>
        ))}
      </div>
    </div>
  )
}

// ── Activity Feed ───────────────────────────────────────────────────────────

function ActivityFeed({ events, loading }: { events: ActivityEvent[]; loading?: boolean }) {
  function formatRelative(iso: string) {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 1) return 'just now'
    if (mins < 60) return `${mins}m ago`
    const hours = Math.floor(mins / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const TYPE_ICON: Record<string, string> = { note: '📝', interview: '🎤' }

  return (
    <div className="dark-card rounded-3xl overflow-hidden">
      <div className="px-5 py-4 border-b" style={{ background: 'var(--dc-elevated)', borderColor: 'var(--dc-border)' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: 'var(--dc-text-3)' }}>TEAM ACTIVITY</p>
      </div>
      <div className="divide-y" style={{ borderColor: 'var(--dc-note)' }}>
        {loading && [1, 2, 3].map((n) => (
          <div key={n} className="flex items-center gap-3 px-5 py-3.5">
            <div className="w-6 h-6 rounded-full animate-pulse bg-[var(--dc-border)] shrink-0" />
            <div className="h-3 rounded animate-pulse bg-[var(--dc-note)] flex-1" />
            <div className="h-3 w-10 rounded animate-pulse bg-[var(--dc-border)]" />
          </div>
        ))}
        {!loading && events.length === 0 && (
          <p className="text-sm px-5 py-4 italic" style={{ color: 'var(--dc-text-3)' }}>No activity yet. Start posting notes or interviews.</p>
        )}
        {!loading && events.map((e) => (
          <div
            key={e.id}
            className="flex items-center gap-3 px-5 py-3.5"
            onMouseEnter={(evt) => (evt.currentTarget.style.background = 'var(--dc-link-hover)')}
            onMouseLeave={(evt) => (evt.currentTarget.style.background = 'transparent')}
          >
            <span className="text-base w-6 shrink-0">{TYPE_ICON[e.type]}</span>
            <p className="text-sm flex-1 min-w-0 truncate" style={{ color: 'var(--dc-text-1)' }}>
              <span className="font-medium" style={{ color: 'var(--dc-text-1)' }}>{e.actor_name}</span>
              {' '}{e.summary}
            </p>
            <span className="text-xs shrink-0 tabular-nums" style={{ color: 'var(--dc-text-3)' }}>
              {formatRelative(e.created_at)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────────────────

interface OverviewTabProps {
  user: Applicant
  team: Team | null
  teammates: Teammate[]
  problem: StartupProblem | null
  tasks: Task[]
  checklist: ChecklistItem[]
  resources: Resource[]
  activity: ActivityEvent[]
  onChecklistToggle: (id: string, currentValue: boolean) => void
  loadingTasks?: boolean
  loadingChecklist?: boolean
  loadingResources?: boolean
  loadingActivity?: boolean
}

export default function OverviewTab({
  user, team, teammates, problem, tasks, checklist, resources, activity,
  onChecklistToggle, loadingTasks, loadingChecklist, loadingResources, loadingActivity,
}: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WelcomeCard name={user.name} teamName={team?.name ?? null} config={problem} />
        </div>
        <div className="md:col-span-1">
          <ProgressCard tasks={tasks} checklist={checklist} loadingTasks={loadingTasks} loadingChecklist={loadingChecklist} />
        </div>
      </div>

      <ProblemBriefCard config={problem} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLinksCard config={problem} />
        <TeamCard user={user} teammates={teammates} />
        <ChecklistCard items={checklist} onToggle={onChecklistToggle} loading={loadingChecklist} />
      </div>

      <div className="grid grid-cols-1 gap-6">
        <ActivityFeed events={activity} loading={loadingActivity} />
        {/* ResourcesCard hidden for MVP — backend ready, re-enable when content is added */}
      </div>
    </div>
  )
}
