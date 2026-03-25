'use client'
import { useEffect, useState } from 'react'

export type DashboardTab = 'overview' | 'tasks' | 'schedule' | 'deliverables' | 'notes'

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'tasks',        label: 'Tasks' },
  { id: 'schedule',     label: 'Schedule' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'notes',        label: 'Notes' },
]

interface DashboardLayoutProps {
  name: string
  cohortDate: string | null
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  children: React.ReactNode
}

function getInitials(name: string) {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

function useCountdown(targetDate: string | null) {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!targetDate) return

    const target = new Date(targetDate).getTime()

    function update() {
      const diff = target - Date.now()
      if (diff <= 0) {
        setCountdown('Live now!')
        return
      }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

      if (days > 0) setCountdown(`${days}d ${hours}h ${mins}m`)
      else setCountdown(`${hours}h ${mins}m`)
    }

    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [targetDate])

  return countdown
}

export default function DashboardLayout({
  name,
  cohortDate,
  activeTab,
  onTabChange,
  children,
}: DashboardLayoutProps) {
  const countdown = useCountdown(cohortDate)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#fafaf8' }}>
      {/* Top bar */}
      <header style={{ background: '#1a1a2e' }} className="sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          {/* Brand */}
          <span
            className="font-display font-semibold text-white text-base sm:text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Micro-PM Residency
          </span>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Countdown */}
            {countdown && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs" style={{ color: '#64748b' }}>Starts in</span>
                <span
                  className="text-sm font-semibold tabular-nums"
                  style={{ color: '#e8913a' }}
                >
                  {countdown}
                </span>
              </div>
            )}

            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: '#e8913a', color: '#fff' }}
            >
              {getInitials(name)}
            </div>
          </div>
        </div>

        {/* Mobile countdown strip */}
        {countdown && (
          <div
            className="sm:hidden flex items-center justify-center gap-2 py-1 border-t"
            style={{ borderColor: 'rgba(255,255,255,0.08)' }}
          >
            <span className="text-xs" style={{ color: '#64748b' }}>Starts in</span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: '#e8913a' }}>
              {countdown}
            </span>
          </div>
        )}
      </header>

      {/* Tab navigation */}
      <nav
        className="sticky top-14 z-30 border-b overflow-x-auto"
        style={{ background: '#fff', borderColor: '#e8e5df' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex gap-0 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className="px-4 sm:px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-colors border-b-2 -mb-px"
                  style={{
                    color: isActive ? '#1a1a2e' : '#64748b',
                    borderBottomColor: isActive ? '#e8913a' : 'transparent',
                    background: 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
