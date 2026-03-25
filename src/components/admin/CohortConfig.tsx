'use client'
import { useEffect, useState } from 'react'

interface Problem {
  id: string
  startup_name: string
  startup_problem: string
  startup_pm_name: string
  startup_data_description: string
  zoom_link: string
  miro_link: string
  slack_link: string
  deck_template_link: string
  problem_brief_link: string
  interview_guide_link: string
}

type ProblemForm = Omit<Problem, 'id'>

const EMPTY_FORM: ProblemForm = {
  startup_name: '',
  startup_problem: '',
  startup_pm_name: '',
  startup_data_description: '',
  zoom_link: '',
  miro_link: '',
  slack_link: '',
  deck_template_link: '',
  problem_brief_link: '',
  interview_guide_link: '',
}

interface Team {
  id: string
  name: string
  problem_id?: string | null
}

export default function CohortConfig({ adminKey, teams }: { adminKey: string; teams: Team[] }) {
  const [open, setOpen] = useState(false)
  const [problems, setProblems] = useState<Problem[]>([])
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [forms, setForms] = useState<Record<string, ProblemForm>>({})
  const [newForm, setNewForm] = useState<ProblemForm>(EMPTY_FORM)
  const [saving, setSaving] = useState<string | null>(null)
  const [toast, setToast] = useState('')
  const [addingNew, setAddingNew] = useState(false)

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  useEffect(() => {
    if (!open) return
    fetch('/api/admin/problems', { headers: { 'x-admin-key': adminKey } })
      .then((r) => r.json())
      .then(({ problems: data }) => {
        setProblems(data ?? [])
        const initial: Record<string, ProblemForm> = {}
        for (const p of data ?? []) {
          initial[p.id] = {
            startup_name: p.startup_name ?? '',
            startup_problem: p.startup_problem ?? '',
            startup_pm_name: p.startup_pm_name ?? '',
            startup_data_description: p.startup_data_description ?? '',
            zoom_link: p.zoom_link ?? '',
            miro_link: p.miro_link ?? '',
            slack_link: p.slack_link ?? '',
            deck_template_link: p.deck_template_link ?? '',
            problem_brief_link: p.problem_brief_link ?? '',
            interview_guide_link: p.interview_guide_link ?? '',
          }
        }
        setForms(initial)
      })
  }, [open, adminKey])

  function setField(id: string, key: keyof ProblemForm, value: string) {
    setForms((prev) => ({ ...prev, [id]: { ...prev[id], [key]: value } }))
  }

  async function handleSave(id: string) {
    setSaving(id)
    const res = await fetch('/api/admin/problems', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id, ...forms[id] }),
    })
    setSaving(null)
    showToast(res.ok ? 'Problem saved.' : 'Failed to save.')
    if (res.ok) setProblems((prev) => prev.map((p) => p.id === id ? { ...p, ...forms[id] } : p))
  }

  async function handleDelete(id: string) {
    if (!confirm('Delete this problem? Teams assigned to it will be unassigned.')) return
    const res = await fetch('/api/admin/problems', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id }),
    })
    if (res.ok) setProblems((prev) => prev.filter((p) => p.id !== id))
    else showToast('Failed to delete.')
  }

  async function handleCreate() {
    if (!newForm.startup_name.trim()) return
    setSaving('new')
    const res = await fetch('/api/admin/problems', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify(newForm),
    })
    setSaving(null)
    if (res.ok) {
      const { problem } = await res.json()
      setProblems((prev) => [...prev, problem])
      setForms((prev) => ({ ...prev, [problem.id]: { ...newForm } }))
      setNewForm(EMPTY_FORM)
      setAddingNew(false)
      showToast('Problem created.')
    } else {
      showToast('Failed to create.')
    }
  }

  async function handleAssignTeam(teamId: string, problemId: string) {
    const res = await fetch('/api/admin/teams', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
      body: JSON.stringify({ id: teamId, problem_id: problemId || null }),
    })
    showToast(res.ok ? 'Team assigned.' : 'Failed to assign team.')
  }

  const inputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30'

  function ProblemFields({ form, onChange }: { form: ProblemForm; onChange: (key: keyof ProblemForm, val: string) => void }) {
    return (
      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Startup Name *</label>
          <input type="text" value={form.startup_name} onChange={(e) => onChange('startup_name', e.target.value)} className={inputClass} placeholder="e.g. Zepto" />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">PM Name</label>
          <input type="text" value={form.startup_pm_name} onChange={(e) => onChange('startup_pm_name', e.target.value)} className={inputClass} placeholder="e.g. Rahul Sharma" />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Problem Description</label>
          <textarea rows={3} value={form.startup_problem} onChange={(e) => onChange('startup_problem', e.target.value)} className={inputClass} placeholder="Describe the startup's problem..." />
        </div>
        <div className="md:col-span-2">
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Data Provided</label>
          <input type="text" value={form.startup_data_description} onChange={(e) => onChange('startup_data_description', e.target.value)} className={inputClass} placeholder="e.g. Mixpanel funnel data, NPS scores" />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Zoom Link</label>
          <input type="url" value={form.zoom_link} onChange={(e) => onChange('zoom_link', e.target.value)} className={inputClass} placeholder="https://zoom.us/j/..." />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Miro Board</label>
          <input type="url" value={form.miro_link} onChange={(e) => onChange('miro_link', e.target.value)} className={inputClass} placeholder="https://miro.com/..." />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Slack / WhatsApp</label>
          <input type="url" value={form.slack_link} onChange={(e) => onChange('slack_link', e.target.value)} className={inputClass} placeholder="https://..." />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Deck Template</label>
          <input type="url" value={form.deck_template_link} onChange={(e) => onChange('deck_template_link', e.target.value)} className={inputClass} placeholder="https://docs.google.com/..." />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Problem Brief</label>
          <input type="url" value={form.problem_brief_link} onChange={(e) => onChange('problem_brief_link', e.target.value)} className={inputClass} placeholder="https://notion.so/..." />
        </div>
        <div>
          <label className="text-xs text-slate uppercase tracking-widest block mb-1">Interview Guide</label>
          <input type="url" value={form.interview_guide_link} onChange={(e) => onChange('interview_guide_link', e.target.value)} className={inputClass} placeholder="https://notion.so/..." />
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
      {/* Header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left"
      >
        <div>
          <p className="text-xs text-accent font-mono uppercase tracking-widest mb-0.5">Admin</p>
          <h2 className="font-display text-lg text-primary">Startup Problems & Team Assignment</h2>
        </div>
        <span className="text-slate text-sm">{open ? '▲ Collapse' : '▼ Expand'}</span>
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-gray-100">

          {/* Team → Problem assignment table */}
          {teams.length > 0 && (
            <div className="mt-5 mb-6">
              <p className="text-xs text-slate uppercase tracking-widest mb-3">Assign Problems to Teams</p>
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {teams.map((team) => (
                  <div key={team.id} className="flex items-center gap-4 px-4 py-3 border-b border-gray-50 last:border-0">
                    <span className="text-sm font-medium text-primary w-32 shrink-0">{team.name}</span>
                    <select
                      defaultValue={team.problem_id ?? ''}
                      onChange={(e) => handleAssignTeam(team.id, e.target.value)}
                      className="flex-1 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-primary text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                    >
                      <option value="">No problem assigned</option>
                      {problems.map((p) => (
                        <option key={p.id} value={p.id}>{p.startup_name}</option>
                      ))}
                    </select>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Existing problems */}
          <div className="flex flex-col gap-4 mt-2">
            {problems.map((problem) => (
              <div key={problem.id} className="rounded-xl border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === problem.id ? null : problem.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 text-left hover:bg-gray-100 transition-colors"
                >
                  <span className="text-sm font-semibold text-primary">{problem.startup_name}</span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(problem.id) }}
                      className="text-xs text-error hover:underline"
                    >
                      Delete
                    </button>
                    <span className="text-slate text-xs">{expandedId === problem.id ? '▲' : '▼'}</span>
                  </div>
                </button>
                {expandedId === problem.id && forms[problem.id] && (
                  <div className="px-4 pb-4">
                    <ProblemFields
                      form={forms[problem.id]}
                      onChange={(key, val) => setField(problem.id, key, val)}
                    />
                    <button
                      onClick={() => handleSave(problem.id)}
                      disabled={saving === problem.id}
                      className="mt-4 px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                      style={{ background: '#e8913a', cursor: saving === problem.id ? 'not-allowed' : 'pointer' }}
                    >
                      {saving === problem.id ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Add new */}
          {addingNew ? (
            <div className="mt-4 rounded-xl border border-gray-100 px-4 pb-4">
              <p className="text-sm font-semibold text-primary pt-4 mb-1">New Startup Problem</p>
              <ProblemFields form={newForm} onChange={(key, val) => setNewForm((prev) => ({ ...prev, [key]: val }))} />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={handleCreate}
                  disabled={saving === 'new' || !newForm.startup_name.trim()}
                  className="px-5 py-2 rounded-lg text-sm font-semibold text-white disabled:opacity-50"
                  style={{ background: '#e8913a' }}
                >
                  {saving === 'new' ? 'Creating…' : 'Create Problem'}
                </button>
                <button onClick={() => { setAddingNew(false); setNewForm(EMPTY_FORM) }} className="px-4 py-2 text-sm text-slate hover:text-primary">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAddingNew(true)}
              className="mt-4 flex items-center gap-2 text-sm font-medium text-accent hover:underline"
            >
              + Add Startup Problem
            </button>
          )}

          {toast && <p className="text-sm text-primary mt-4">{toast}</p>}
        </div>
      )}
    </div>
  )
}
