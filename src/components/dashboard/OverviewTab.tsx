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

// ── Helpers ────────────────────────────────────────────────────────────────

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// ── Progress Ring ──────────────────────────────────────────────────────────

function ProgressRing({ pct }: { pct: number }) {
  const r = 40
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ

  return (
    <svg width="100" height="100" viewBox="0 0 100 100">
      {/* track */}
      <circle cx="50" cy="50" r={r} fill="none" stroke="#e8e5df" strokeWidth="8" />
      {/* progress */}
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke="#e8913a"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeDashoffset={circ / 4}
        style={{ transition: 'stroke-dasharray 0.6s ease' }}
      />
      <text x="50" y="54" textAnchor="middle" fontSize="18" fontWeight="700" fill="#1a1a2e">
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
      className="rounded-2xl p-7 flex flex-col justify-between min-h-52"
      style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #2d2b55 100%)',
      }}
    >
      <div>
        <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: '#e8913a' }}>
          WELCOME BACK
        </p>
        <h2
          className="text-2xl sm:text-3xl font-bold text-white mb-3 leading-snug"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Hey {name.split(' ')[0]}, you&apos;re in{' '}
          <span style={{ color: '#e8913a' }}>{teamName ?? 'your team'}</span>
        </h2>
        <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
          {config?.startup_name
            ? `You're working on ${config.startup_name}'s problem this weekend.`
            : 'Get ready for the weekend.'}{' '}
          {config?.startup_pm_name && (
            <>Your PM mentor is <span className="text-white font-medium">{config.startup_pm_name}</span>.</>
          )}
        </p>
      </div>

      {/* Quick-link pills */}
      <div className="flex flex-wrap gap-2 mt-5">
        {quickLinks.map(({ label, href }) =>
          href ? (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105"
              style={{ background: 'rgba(255,255,255,0.12)', color: '#fff', border: '1px solid rgba(255,255,255,0.2)' }}
            >
              {label} ↗
            </a>
          ) : (
            <span
              key={label}
              className="px-3 py-1.5 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)', border: '1px solid rgba(255,255,255,0.1)' }}
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
    <div
      className="rounded-2xl p-6 flex flex-col gap-5 h-full"
      style={{ background: '#fff', border: '1px solid #e8e5df' }}
    >
      <p className="text-xs font-semibold tracking-widest" style={{ color: '#64748b' }}>
        YOUR PROGRESS
      </p>

      {/* Ring */}
      <div className="flex flex-col items-center gap-1">
        {loadingTasks ? (
          <div className="w-[100px] h-[100px] rounded-full animate-pulse bg-gray-100 flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gray-200" />
          </div>
        ) : (
          <ProgressRing pct={taskPct} />
        )}
        {loadingTasks ? (
          <div className="h-3 w-28 rounded animate-pulse bg-gray-200 mt-1" />
        ) : (
          <p className="text-xs text-center" style={{ color: '#64748b' }}>
            {doneTasks} of {totalTasks} tasks done
          </p>
        )}
      </div>

      {/* Pre-weekend checklist bar */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <p className="text-xs font-medium" style={{ color: '#1a1a2e' }}>Pre-weekend checklist</p>
          {!loadingChecklist && (
            <p className="text-xs tabular-nums" style={{ color: '#64748b' }}>
              {doneChecks}/{totalChecks}
            </p>
          )}
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#e8e5df' }}>
          {loadingChecklist ? (
            <div className="h-full w-1/3 rounded-full animate-pulse bg-gray-300" />
          ) : (
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${checkPct}%`, background: '#e8913a' }}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function ProblemBriefCard({ config }: { config: StartupProblem | null }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #e8e5df' }}
    >
      {/* Header */}
      <div
        className="px-6 py-4 flex items-center gap-2 border-b"
        style={{ background: '#fffbf5', borderColor: '#e8e5df' }}
      >
        <span className="text-lg">📋</span>
        <h3 className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
          The Problem Brief
          {config?.startup_name && (
            <span style={{ color: '#e8913a' }}> — {config.startup_name}</span>
          )}
        </h3>
      </div>

      {/* Body */}
      <div className="px-6 py-5 bg-white">
        {config?.startup_problem ? (
          <p className="text-sm leading-relaxed" style={{ color: '#1a1a2e' }}>
            {config.startup_problem}
          </p>
        ) : (
          <p className="text-sm italic" style={{ color: '#64748b' }}>
            Problem brief not yet published. Check back soon.
          </p>
        )}

        {config?.startup_data_description && (
          <p
            className="text-xs mt-4 pt-4 border-t"
            style={{ color: '#64748b', borderColor: '#e8e5df' }}
          >
            <span className="font-medium">Data provided:</span>{' '}
            {config.startup_data_description}
          </p>
        )}
      </div>
    </div>
  )
}

function QuickLinksCard({ config }: { config: StartupProblem | null }) {
  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #e8e5df' }}
    >
      <div className="px-5 py-4 border-b" style={{ background: '#fafaf8', borderColor: '#e8e5df' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: '#64748b' }}>
          QUICK LINKS
        </p>
      </div>
      <div className="bg-white divide-y" style={{ borderColor: '#e8e5df' }}>
        {LINK_DEFS.map(({ key, emoji, label, desc }) => {
          const href = config?.[key] ?? null
          return (
            <div key={key} className="group">
              {href ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-5 py-3.5 hover:bg-orange-50 transition-colors"
                >
                  <span className="text-lg w-7 shrink-0">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#1a1a2e' }}>{label}</p>
                    <p className="text-xs" style={{ color: '#64748b' }}>{desc}</p>
                  </div>
                  <span
                    className="text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: '#e8913a' }}
                  >
                    →
                  </span>
                </a>
              ) : (
                <div className="flex items-center gap-3 px-5 py-3.5">
                  <span className="text-lg w-7 shrink-0 opacity-40">{emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium" style={{ color: '#94a3b8' }}>{label}</p>
                    <p className="text-xs" style={{ color: '#94a3b8' }}>Coming soon</p>
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

function TeamCard({
  user,
  teammates,
}: {
  user: Applicant
  teammates: Teammate[]
}) {
  const all = [
    { id: user.id, name: user.name, current_role: user.current_role, isMe: true },
    ...teammates.map((t) => ({ ...t, isMe: false })),
  ]

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #e8e5df' }}
    >
      <div className="px-5 py-4 border-b" style={{ background: '#fafaf8', borderColor: '#e8e5df' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: '#64748b' }}>
          YOUR TEAM
        </p>
      </div>
      <div className="bg-white divide-y" style={{ borderColor: '#e8e5df' }}>
        {all.map((member) => (
          <div
            key={member.id}
            className="flex items-center gap-3 px-5 py-3.5"
            style={member.isMe ? { background: '#fffbf5' } : {}}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{
                background: member.isMe ? '#e8913a' : '#1a1a2e',
                color: '#fff',
              }}
            >
              {getInitials(member.name)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium truncate" style={{ color: '#1a1a2e' }}>
                  {member.name}
                </p>
                {member.isMe && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded font-medium shrink-0"
                    style={{ background: '#fef3e2', color: '#e8913a' }}
                  >
                    You
                  </span>
                )}
              </div>
              <p className="text-xs truncate" style={{ color: '#64748b' }}>
                {member.current_role}
              </p>
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
    <div
      className="rounded-2xl overflow-hidden"
      style={{ border: '1px solid #e8e5df' }}
    >
      <div className="px-5 py-4 border-b" style={{ background: '#fafaf8', borderColor: '#e8e5df' }}>
        <p className="text-xs font-semibold tracking-widest" style={{ color: '#64748b' }}>
          PRE-WEEKEND CHECKLIST
        </p>
      </div>
      <div className="bg-white divide-y" style={{ borderColor: '#e8e5df' }}>
        {loading && (
          <>
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="flex items-center gap-3 px-5 py-3.5">
                <div className="w-5 h-5 rounded animate-pulse bg-gray-200 shrink-0" />
                <div className="h-3 rounded animate-pulse bg-gray-200 flex-1" />
              </div>
            ))}
          </>
        )}
        {!loading && items.length === 0 && (
          <p className="text-sm px-5 py-4 italic" style={{ color: '#64748b' }}>
            No checklist items yet.
          </p>
        )}
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onToggle(item.id, item.is_done)}
            className="w-full flex items-center gap-3 px-5 py-3.5 text-left transition-colors hover:bg-gray-50"
          >
            {/* Checkbox */}
            <div
              className="w-5 h-5 rounded flex items-center justify-center shrink-0 transition-all"
              style={{
                border: item.is_done ? 'none' : '2px solid #e8e5df',
                background: item.is_done ? '#16a34a' : 'transparent',
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
                color: item.is_done ? '#94a3b8' : '#1a1a2e',
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

// ── Main component ─────────────────────────────────────────────────────────

interface OverviewTabProps {
  user: Applicant
  team: Team | null
  teammates: Teammate[]
  problem: StartupProblem | null
  tasks: Task[]
  checklist: ChecklistItem[]
  onChecklistToggle: (id: string, currentValue: boolean) => void
  loadingTasks?: boolean
  loadingChecklist?: boolean
}

export default function OverviewTab({
  user,
  team,
  teammates,
  problem,
  tasks,
  checklist,
  onChecklistToggle,
  loadingTasks,
  loadingChecklist,
}: OverviewTabProps) {
  return (
    <div className="flex flex-col gap-6">

      {/* Row 1 — Welcome (2/3) + Progress (1/3) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <WelcomeCard name={user.name} teamName={team?.name ?? null} config={problem} />
        </div>
        <div className="md:col-span-1">
          <ProgressCard tasks={tasks} checklist={checklist} loadingTasks={loadingTasks} loadingChecklist={loadingChecklist} />
        </div>
      </div>

      {/* Row 2 — Problem brief (full width) */}
      <ProblemBriefCard config={problem} />

      {/* Row 3 — 3-column grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <QuickLinksCard config={problem} />
        <TeamCard user={user} teammates={teammates} />
        <ChecklistCard items={checklist} onToggle={onChecklistToggle} loading={loadingChecklist} />
      </div>

    </div>
  )
}
