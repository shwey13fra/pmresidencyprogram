'use client'
import { useEffect, useState, useCallback } from 'react'
import AdminLogin from '@/components/admin/AdminLogin'
import StatsBar from '@/components/admin/StatsBar'
import ApplicantTable from '@/components/admin/ApplicantTable'
import TeamManager from '@/components/admin/TeamManager'

interface Applicant {
  id: string
  name: string
  email: string
  phone: string
  current_role: string
  linkedin_url: string | null
  why_pm: string
  product_answer: string
  status: 'new' | 'accepted' | 'rejected' | 'waitlisted'
  team_id: string | null
  created_at: string
  teams?: { id: string; name: string } | null
}

interface Team {
  id: string
  name: string
  applicants?: { id: string; name: string; status: string }[]
}

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState<string | null>(null)
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [teams, setTeams] = useState<Team[]>([])
  const [loading, setLoading] = useState(false)

  // Check localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('adminKey')
    if (stored) setAdminKey(stored)
  }, [])

  const fetchData = useCallback(async (key: string) => {
    setLoading(true)
    const [appRes, teamRes] = await Promise.all([
      fetch('/api/admin/applicants', { headers: { 'x-admin-key': key } }),
      fetch('/api/admin/teams', { headers: { 'x-admin-key': key } }),
    ])

    if (appRes.status === 401) {
      localStorage.removeItem('adminKey')
      setAdminKey(null)
      setLoading(false)
      return
    }

    const appData = await appRes.json()
    const teamData = await teamRes.json()
    setApplicants(appData.applicants ?? [])
    setTeams(teamData.teams ?? [])
    setLoading(false)
  }, [])

  useEffect(() => {
    if (adminKey) fetchData(adminKey)
  }, [adminKey, fetchData])

  function handleLoginSuccess() {
    const key = localStorage.getItem('adminKey')!
    setAdminKey(key)
  }

  function handleLogout() {
    localStorage.removeItem('adminKey')
    setAdminKey(null)
  }

  if (!adminKey) {
    return <AdminLogin onSuccess={handleLoginSuccess} />
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs text-accent font-mono uppercase tracking-widest mb-1">
              Admin
            </p>
            <h1 className="font-display text-3xl text-primary">Dashboard</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-slate hover:text-primary transition-colors cursor-pointer"
          >
            Sign out
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin w-6 h-6 border-2 border-accent border-t-transparent rounded-full" />
          </div>
        ) : (
          <>
            <StatsBar applicants={applicants} />
            <ApplicantTable
              applicants={applicants}
              teams={teams}
              adminKey={adminKey}
              onRefresh={() => fetchData(adminKey)}
            />
            <TeamManager
              teams={teams}
              adminKey={adminKey}
              onRefresh={() => fetchData(adminKey)}
            />
          </>
        )}
      </div>
    </div>
  )
}
