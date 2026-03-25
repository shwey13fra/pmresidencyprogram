'use client'
import { useState } from 'react'

const STATUS_OPTIONS = ['new', 'accepted', 'rejected', 'waitlisted'] as const
type Status = typeof STATUS_OPTIONS[number]

interface Team {
  id: string
  name: string
}

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  current_role: string
  linkedin_url: string | null
  why_pm: string
  product_answer: string
  status: Status
  team_id: string | null
  created_at: string
  teams?: { id: string; name: string } | null
}

const STATUS_COLORS: Record<Status, string> = {
  new: 'bg-blue-50 text-blue-700',
  accepted: 'bg-green-50 text-success',
  rejected: 'bg-red-50 text-error',
  waitlisted: 'bg-yellow-50 text-yellow-700',
}

export default function ApplicantRow({
  applicant,
  teams,
  adminKey,
  onRefresh,
}: {
  applicant: Applicant
  teams: Team[]
  adminKey: string
  onRefresh: () => void
}) {
  const [expanded, setExpanded] = useState(false)
  const [toast, setToast] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [updatingTeam, setUpdatingTeam] = useState(false)
  const [tasksSeeded, setTasksSeeded] = useState(false)
  const [checklistSeeded, setChecklistSeeded] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleStatusChange(newStatus: string) {
    setUpdatingStatus(true)
    const res = await fetch('/api/admin/update-status', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify({ id: applicant.id, status: newStatus }),
    })
    setUpdatingStatus(false)
    if (res.ok) {
      showToast(`Status updated to ${newStatus}. Email sent.`)
      onRefresh()
    } else {
      showToast('Failed to update status.')
    }
  }

  async function handleTeamChange(teamId: string) {
    setUpdatingTeam(true)
    const res = await fetch('/api/admin/assign-team', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
      body: JSON.stringify({ id: applicant.id, team_id: teamId || null }),
    })
    setUpdatingTeam(false)
    if (res.ok) {
      showToast('Team assigned.')
      onRefresh()
    } else {
      showToast('Failed to assign team.')
    }
  }

  const appliedDate = new Date(applicant.created_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  })

  return (
    <>
      {/* Summary row */}
      <tr
        className="border-b border-gray-50 hover:bg-gray-50/50 cursor-pointer transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <td className="px-4 py-3 text-sm font-medium text-primary">{applicant.name}</td>
        <td className="px-4 py-3 text-sm text-slate">{applicant.email}</td>
        <td className="px-4 py-3 text-sm text-slate">{applicant.current_role}</td>
        <td className="px-4 py-3 text-sm text-slate font-mono">{appliedDate}</td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-1 rounded-full font-medium ${STATUS_COLORS[applicant.status]}`}>
            {applicant.status}
          </span>
        </td>
        <td className="px-4 py-3 text-sm text-slate">
          {applicant.teams?.name ?? <span className="text-slate/40">—</span>}
        </td>
      </tr>

      {/* Expanded detail row */}
      {expanded && (
        <tr className="bg-gray-50/70">
          <td colSpan={6} className="px-6 py-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Left: contact + answers */}
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Phone</p>
                  <p className="text-sm text-primary">+91 {applicant.phone}</p>
                </div>
                {applicant.linkedin_url && (
                  <div>
                    <p className="text-xs text-slate uppercase tracking-widest mb-1">LinkedIn</p>
                    <a
                      href={applicant.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent hover:underline"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {applicant.linkedin_url}
                    </a>
                  </div>
                )}
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Why PM?</p>
                  <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">
                    {applicant.why_pm}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1">Product answer</p>
                  <p className="text-sm text-primary leading-relaxed whitespace-pre-wrap">
                    {applicant.product_answer}
                  </p>
                </div>
              </div>

              {/* Right: actions */}
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-2">Update status</p>
                  <select
                    defaultValue={applicant.status}
                    disabled={updatingStatus}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                  >
                    {STATUS_OPTIONS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-2">Assign team</p>
                  <select
                    defaultValue={applicant.team_id ?? ''}
                    disabled={updatingTeam}
                    onChange={(e) => handleTeamChange(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30 disabled:opacity-50"
                  >
                    <option value="">Unassigned</option>
                    {teams.map((t) => (
                      <option key={t.id} value={t.id}>{t.name}</option>
                    ))}
                  </select>
                </div>

                {/* Seed buttons — only for accepted applicants with a team */}
                {applicant.status === 'accepted' && applicant.team_id && (
                  <div>
                    <p className="text-xs text-slate uppercase tracking-widest mb-2">Dashboard Setup</p>
                    <div className="flex flex-wrap gap-2">
                      <button
                        disabled={tasksSeeded}
                        onClick={async (e) => {
                          e.stopPropagation()
                          const res = await fetch('/api/admin/seed-tasks', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                            body: JSON.stringify({ team_id: applicant.team_id }),
                          })
                          if (res.ok) {
                            setTasksSeeded(true)
                            showToast(`Default tasks created for ${applicant.teams?.name ?? 'team'}.`)
                          } else {
                            showToast('Failed to seed tasks.')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border disabled:opacity-60 disabled:cursor-not-allowed"
                        style={tasksSeeded
                          ? { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
                          : { background: '#fff', color: '#1a1a2e', borderColor: '#e5e7eb' }}
                      >
                        {tasksSeeded ? 'Tasks Seeded ✓' : 'Seed Tasks'}
                      </button>

                      <button
                        disabled={checklistSeeded}
                        onClick={async (e) => {
                          e.stopPropagation()
                          const res = await fetch('/api/admin/seed-checklist', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
                            body: JSON.stringify({ applicant_id: applicant.id }),
                          })
                          if (res.ok) {
                            setChecklistSeeded(true)
                            showToast(`Checklist created for ${applicant.name}.`)
                          } else {
                            showToast('Failed to seed checklist.')
                          }
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border disabled:opacity-60 disabled:cursor-not-allowed"
                        style={checklistSeeded
                          ? { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
                          : { background: '#fff', color: '#1a1a2e', borderColor: '#e5e7eb' }}
                      >
                        {checklistSeeded ? 'Checklist Seeded ✓' : 'Seed Checklist'}
                      </button>
                    </div>
                  </div>
                )}

                {toast && (
                  <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-3 text-sm text-primary">
                    {toast}
                  </div>
                )}
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  )
}
