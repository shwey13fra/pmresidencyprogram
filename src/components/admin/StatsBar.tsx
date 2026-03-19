const MAX_SPOTS = Number(process.env.NEXT_PUBLIC_MAX_SPOTS) || 20

interface Applicant {
  status: string
}

export default function StatsBar({ applicants }: { applicants: Applicant[] }) {
  const total = applicants.length
  const accepted = applicants.filter((a) => a.status === 'accepted').length
  const rejected = applicants.filter((a) => a.status === 'rejected').length
  const remaining = MAX_SPOTS - accepted

  const stats = [
    { label: 'Total applications', value: total },
    { label: 'Accepted', value: accepted },
    { label: 'Rejected', value: rejected },
    { label: 'Spots remaining', value: remaining },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-card border border-gray-100 rounded-xl p-5"
        >
          <p className="text-xs text-slate uppercase tracking-widest mb-2">
            {s.label}
          </p>
          <p className="font-mono text-3xl font-semibold text-primary">
            {s.value}
          </p>
        </div>
      ))}
    </div>
  )
}
