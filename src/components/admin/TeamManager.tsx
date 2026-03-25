'use client'
import { useState } from 'react'
import Button from '@/components/shared/Button'
import type { Problem } from './StartupProblems'

interface TeamMember {
  id: string
  name: string
  status: string
}

interface Team {
  id: string
  name: string
  problem_id?: string | null
  pm_feedback?: string | null
  applicants?: TeamMember[]
}

export default function TeamManager({
  teams,
  adminKey,
  problems,
  onRefresh,
}: {
  teams: Team[]
  adminKey: string
  problems: Problem[]
  onRefresh: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')
  const [assignedProblems, setAssignedProblems] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const t of teams) init[t.id] = t.problem_id ?? ''
    return init
  })
  const [feedbacks, setFeedbacks] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {}
    for (const t of teams) init[t.id] = t.pm_feedback ?? ''
    return init
  })
  const [savingFeedback, setSavingFeedback] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) return
    setCreating(true)
    setError('')
    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ name: teamName.trim() }),
    })
    setCreating(false)
    if (res.ok) {
      setTeamName('')
      setShowForm(false)
      onRefresh()
    } else {
      setError('Failed to create team. Try again.')
    }
  }

  async function handleAssignProblem(teamId: string, problemId: string) {
    setAssignedProblems((prev) => ({ ...prev, [teamId]: problemId }))
    const res = await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: teamId, problem_id: problemId || null }),
    })
    if (res.ok) {
      showToast('Problem assigned.')
      onRefresh()
    } else {
      setAssignedProblems((prev) => ({ ...prev, [teamId]: '' }))
      showToast('Failed to assign problem.')
    }
  }

  async function handleSaveFeedback(teamId: string) {
    setSavingFeedback(teamId)
    const res = await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: teamId, pm_feedback: feedbacks[teamId] ?? '' }),
    })
    setSavingFeedback(null)
    showToast(res.ok ? 'Feedback saved.' : 'Failed to save feedback.')
  }

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-display text-2xl text-primary">Teams</h2>
        <Button
          onClick={() => setShowForm(!showForm)}
          variant={showForm ? 'outline' : 'primary'}
          className="text-sm px-4 py-2"
        >
          {showForm ? 'Cancel' : '+ Create team'}
        </Button>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={handleCreate} className="flex gap-3 mb-6">
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Team name (e.g. Team Atlas)"
            autoFocus
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 text-sm"
          />
          <Button type="submit" disabled={!teamName.trim() || creating} className="text-sm px-5 py-2.5">
            {creating ? 'Creating...' : 'Create'}
          </Button>
        </form>
      )}
      {error && <p className="text-sm text-error mb-4">{error}</p>}

      {/* Teams list */}
      {teams.length === 0 ? (
        <p className="text-sm text-slate">No teams yet. Create one above.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {teams.map((team) => {
            const members = team.applicants ?? []
            return (
              <div key={team.id} className="bg-card border border-gray-100 rounded-xl p-5 flex flex-col gap-4">

                {/* Team name + member count */}
                <div className="flex items-start justify-between">
                  <h3 className="font-medium text-primary">{team.name}</h3>
                  <span className="font-mono text-xs text-slate bg-gray-100 px-2 py-1 rounded">
                    {members.length} of 4
                  </span>
                </div>

                {/* Members */}
                {members.length === 0 ? (
                  <p className="text-xs text-slate/50">No members yet</p>
                ) : (
                  <ul className="space-y-1">
                    {members.map((m) => (
                      <li key={m.id} className="text-sm text-slate flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${m.status === 'accepted' ? 'bg-success' : 'bg-gray-300'}`} />
                        {m.name}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Problem assignment */}
                <div className="border-t border-gray-100 pt-3">
                  <p className="text-xs text-slate uppercase tracking-widest mb-1.5">Startup Problem</p>
                  <select
                    value={assignedProblems[team.id] ?? ''}
                    onChange={(e) => handleAssignProblem(team.id, e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
                  >
                    <option value="">Not assigned</option>
                    {problems.map((p) => (
                      <option key={p.id} value={p.id}>{p.startup_name}</option>
                    ))}
                  </select>
                </div>

                {/* PM Feedback */}
                <div>
                  <p className="text-xs text-slate uppercase tracking-widest mb-1.5">
                    PM Feedback <span className="normal-case text-slate/50">(after Sunday)</span>
                  </p>
                  <textarea
                    rows={4}
                    value={feedbacks[team.id] ?? ''}
                    onChange={(e) => setFeedbacks((prev) => ({ ...prev, [team.id]: e.target.value }))}
                    placeholder="Write feedback for this team..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-xs focus:outline-none focus:ring-2 focus:ring-accent/30"
                  />
                  <button
                    onClick={() => handleSaveFeedback(team.id)}
                    disabled={savingFeedback === team.id}
                    className="mt-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-white disabled:opacity-50"
                    style={{ background: '#e8913a' }}
                  >
                    {savingFeedback === team.id ? 'Saving…' : 'Save Feedback'}
                  </button>
                </div>

              </div>
            )
          })}
        </div>
      )}

      {toast && <p className="text-sm text-primary mt-4">{toast}</p>}
    </div>
  )
}
