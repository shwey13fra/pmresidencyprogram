'use client'
import type { StartupProblem } from './OverviewTab'

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const DELIVERABLES = [
  {
    icon: '◈',
    iconColor: '#e8913a',
    iconBg: '#fef3e2',
    title: 'Portfolio-Ready Recommendation Deck',
    desc: "Your team's deck, built on a real startup's problem with real user insights. Not a case study — real work.",
    badge: 'In Progress',
    badgeBg: '#fef3e2',
    badgeColor: '#e8913a',
  },
  {
    icon: '◎',
    iconColor: '#3b82f6',
    iconBg: '#eff6ff',
    title: 'Written Feedback from a Practising PM',
    desc: "The startup's PM writes a specific feedback summary for your team. What you got right, what you missed, how a PM would think about it differently.",
    badge: 'After Sunday',
    badgeBg: '#f1f5f9',
    badgeColor: '#64748b',
  },
  {
    icon: '◉',
    iconColor: '#10b981',
    iconBg: '#dcfce7',
    title: 'Residency Summary for Your Resume',
    desc: 'A one-page document stating the startup you worked with, the problem you tackled, and what you recommended. Link it on LinkedIn.',
    badge: 'After Sunday',
    badgeBg: '#f1f5f9',
    badgeColor: '#64748b',
  },
]

const FEEDBACK_PLACEHOLDERS = [
  'What you got right',
  'What you missed',
  "How I'd think about it differently",
  'Specific strengths I noticed',
]

interface DeliverablesTabProps {
  problem: StartupProblem | null
  pmFeedback: string | null
}

export default function DeliverablesTab({ problem, pmFeedback }: DeliverablesTabProps) {
  const pmName = problem?.startup_pm_name ?? 'Your PM Mentor'
  const hasFeedback = !!pmFeedback

  return (
    <div className="flex flex-col gap-8">

      {/* Heading */}
      <div>
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
        >
          What You Walk Away With
        </h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          These are delivered within 48 hours after Sunday&apos;s presentations.
        </p>
      </div>

      {/* Deliverable cards */}
      <div className="flex flex-col gap-4">
        {DELIVERABLES.map((d) => (
          <div
            key={d.title}
            className="rounded-2xl p-6 flex items-start gap-5 bg-white"
            style={{ border: '1px solid #e8e5df' }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
              style={{ background: d.iconBg, color: d.iconColor }}
            >
              {d.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3 flex-wrap mb-2">
                <h3 className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
                  {d.title}
                </h3>
                <span
                  className="text-xs font-medium px-2.5 py-1 rounded-full shrink-0"
                  style={{ background: d.badgeBg, color: d.badgeColor }}
                >
                  {d.badge}
                </span>
              </div>
              <p className="text-sm leading-relaxed" style={{ color: '#64748b' }}>
                {d.desc}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* PM Feedback section */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: '1px solid #e8e5df' }}
      >
        {/* Header */}
        <div
          className="px-6 py-4 border-b flex items-center gap-4"
          style={{ background: '#fafaf8', borderColor: '#e8e5df' }}
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0"
            style={{ background: '#1a1a2e', color: '#fff' }}
          >
            {getInitials(pmName)}
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: '#1a1a2e' }}>
              {pmName}
            </p>
            <p className="text-xs" style={{ color: '#64748b' }}>PM Feedback Preview</p>
          </div>
        </div>

        {/* Body */}
        <div className="bg-white px-6 py-5">
          {hasFeedback ? (
            <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#1a1a2e' }}>
              {pmFeedback}
            </p>
          ) : (
            <div className="flex flex-col gap-3">
              {FEEDBACK_PLACEHOLDERS.map((item) => (
                <div
                  key={item}
                  className="rounded-xl px-4 py-3 flex items-center gap-3"
                  style={{ border: '1.5px dashed #e8e5df' }}
                >
                  <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#cbd5e1' }} />
                  <div>
                    <p className="text-xs font-medium" style={{ color: '#94a3b8' }}>{item}</p>
                    <p className="text-xs" style={{ color: '#cbd5e1' }}>Feedback will appear here after Sunday</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  )
}
