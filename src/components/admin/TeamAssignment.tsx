'use client'
import { useState } from 'react'
import type { Problem } from './StartupProblems'

interface Team {
  id: string
  name: string
  problem_id?: string | null
  pm_feedback?: string | null
}

const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30'

export default function TeamAssignment({
  adminKey,
  teams,
  problems,
}: {
  adminKey: string
  teams: Team[]
  problems: Problem[]
}) {
  const [open, setOpen] = useState(false)
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const t of teams) init[t.id] = t.pm_feedback ?? ''
    return init
  })
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleAssignProblem(teamId: string, problemId: string) {
    const res = await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: teamId, problem_id: problemId || null }),
    })
    showToast(res.ok ? 'Problem assigned.' : 'Failed to assign.')
  }

  async function handleSaveFeedback(teamId: string) {
    setSaving(teamId)
    const res = await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: teamId, pm_feedback: feedbacks[teamId] ?? '' }),
    })
    setSaving(null)
    showToast(res.ok ? 'Feedback saved.' : 'Failed to save feedback.')
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <p className="text-xs text-accent font-mono uppercase tracking-widest mb-0.5">Admin</p>
          <h2 className="font-display text-lg text-primary">Team Assignment & PM Feedback</h2>
          <p className="text-xs text-slate mt-0.5">Assign a startup problem to each team, add PM feedback after Sunday</p>
        </div>
        <span className="text-slate text-sm">{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100">
          {teams.length === 0 ? (
            <p className="text-sm text-slate mt-5">No teams created yet. Create teams first.</p>
          ) : (
            <div className="flex flex-col gap-4 mt-5">
              {teams.map((team) => (
                <div key={team.id} className="rounded-xl border border-gray-100 p-4">
                  <p className="text-sm font-semibold text-primary mb-3">{team.name}</p>

                  {/* Problem assignment */}
                  <div className="mb-3">
                    <label className="text-xs text-slate uppercase tracking-widest block mb-1.5">Assigned Problem</label>
                    <select
                      defaultValue={team.problem_id ?? ''}
                      onChange={(e) => handleAssignProblem(team.id, e.target.value)}
                      className={inputClass}
                    >
                      <option value="">No problem assigned</option>
                      {problems.map((p) => (
                        <option key={p.id} value={p.id}>{p.startup_name}</option>
                      ))}
                    </select>
                  </div>

                  {/* PM Feedback */}
                  <div>
                    <label className="text-xs text-slate uppercase tracking-widest block mb-1.5">
                      PM Feedback <span className="normal-case text-slate/60">(fill after Sunday)</span>
                    </label>
                    <textarea
                      rows={3}
                      value={feedbacks[team.id] ?? ''}
                      onChange={(e) => setFeedbacks((prev) => ({ ...prev, [team.id]: e.target.value }))}
                      className={inputClass}
                      placeholder="Write PM's feedback for this team..."
                    />
                    <button
                      onClick={() => handleSaveFeedback(team.id)}
                      disabled={saving === team.id}
                      className="mt-2 px-4 py-1.5 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                      style={{ background: '#e8913a' }}
                    >
                      {saving === team.id ? 'Saving…' : 'Save Feedback'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {toast && <p className="text-sm text-primary mt-4">{toast}</p>}
        </div>
      )}
    </div>
  )
}
