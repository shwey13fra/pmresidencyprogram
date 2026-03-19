'use client'
import { useState, useMemo } from 'react'
import ApplicantRow from './ApplicantRow'

type Status = 'new' | 'accepted' | 'rejected' | 'waitlisted'
type SortField = 'name' | 'email' | 'current_role' | 'created_at' | 'status'

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

interface Team {
  id: string
  name: string
}

const STATUS_FILTERS = ['all', 'new', 'accepted', 'rejected', 'waitlisted'] as const
const COLUMNS: { key: SortField; label: string }[] = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'current_role', label: 'Role' },
  { key: 'created_at', label: 'Applied' },
  { key: 'status', label: 'Status' },
]

export default function ApplicantTable({
  applicants,
  teams,
  adminKey,
  onRefresh,
}: {
  applicants: Applicant[]
  teams: Team[]
  adminKey: string
  onRefresh: () => void
}) {
  const [filter, setFilter] = useState<typeof STATUS_FILTERS[number]>('all')
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortAsc, setSortAsc] = useState(false)

  function handleSort(field: SortField) {
    if (field === sortField) {
      setSortAsc(!sortAsc)
    } else {
      setSortField(field)
      setSortAsc(true)
    }
  }

  const filtered = useMemo(() => {
    let list = filter === 'all' ? applicants : applicants.filter((a) => a.status === filter)
    list = [...list].sort((a, b) => {
      const av = a[sortField] ?? ''
      const bv = b[sortField] ?? ''
      return sortAsc
        ? String(av).localeCompare(String(bv))
        : String(bv).localeCompare(String(av))
    })
    return list
  }, [applicants, filter, sortField, sortAsc])

  return (
    <div>
      {/* Filter buttons */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_FILTERS.map((f) => {
          const count = f === 'all' ? applicants.length : applicants.filter((a) => a.status === f).length
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                filter === f
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-slate hover:bg-gray-200'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}{' '}
              <span className="font-mono text-xs opacity-70">{count}</span>
            </button>
          )
        })}
      </div>

      {/* Table */}
      <div className="bg-card border border-gray-100 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/50">
                {COLUMNS.map((col) => (
                  <th
                    key={col.key}
                    onClick={() => handleSort(col.key)}
                    className="px-4 py-3 text-left text-xs font-medium text-slate uppercase tracking-widest cursor-pointer hover:text-primary transition-colors select-none"
                  >
                    {col.label}{' '}
                    {sortField === col.key && (
                      <span>{sortAsc ? '↑' : '↓'}</span>
                    )}
                  </th>
                ))}
                <th className="px-4 py-3 text-left text-xs font-medium text-slate uppercase tracking-widest">
                  Team
                </th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm text-slate">
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filtered.map((applicant) => (
                  <ApplicantRow
                    key={applicant.id}
                    applicant={applicant}
                    teams={teams}
                    adminKey={adminKey}
                    onRefresh={onRefresh}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
