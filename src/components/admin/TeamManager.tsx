'use client'
import { useState } from 'react'
import Button from '@/components/shared/Button'

interface TeamMember {
  id: string
  name: string
  status: string
}

interface Team {
  id: string
  name: string
  applicants?: TeamMember[]
}

export default function TeamManager({
  teams,
  adminKey,
  onRefresh,
}: {
  teams: Team[]
  adminKey: string
  onRefresh: () => void
}) {
  const [showForm, setShowForm] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState('')

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!teamName.trim()) return
    setCreating(true)
    setError('')

    const res = await fetch('/api/admin/teams', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-key': adminKey,
      },
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
              <div key={team.id} className="bg-card border border-gray-100 rounded-xl p-5">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-medium text-primary">{team.name}</h3>
                  <span className="font-mono text-xs text-slate bg-gray-100 px-2 py-1 rounded">
                    {members.length} of 4
                  </span>
                </div>
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
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
