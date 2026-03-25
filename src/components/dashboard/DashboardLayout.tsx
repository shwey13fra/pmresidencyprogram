'use client'
import { useEffect, useState } from 'react'
import ThemeProvider, { useTheme } from '@/components/shared/ThemeProvider'
import ThemeToggle from '@/components/shared/ThemeToggle'

export type DashboardTab = 'overview' | 'tasks' | 'schedule' | 'deliverables' | 'notes' | 'interviews'

const TABS: { id: DashboardTab; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'tasks',        label: 'Tasks' },
  { id: 'schedule',     label: 'Schedule' },
  { id: 'deliverables', label: 'Deliverables' },
  { id: 'notes',        label: 'Notes' },
  { id: 'interviews',   label: 'Interviews' },
]

// Dark palette
const DARK = {
  pageBg:    '#09091f',
  topBar:    '#060614',
  topBorder: '#1a1836',
  navBg:     '#0d0c20',
  navBorder: '#1a1836',
}

// Light palette — white bg, dark nav bar retained for contrast
const LIGHT = {
  pageBg:    '#fafaf8',
  topBar:    '#1a1a2e',
  topBorder: '#2d2b4a',
  navBg:     '#1a1a2e',
  navBorder: '#2d2b4a',
}

interface DashboardLayoutProps {
  name: string
  cohortDate: string | null
  activeTab: DashboardTab
  onTabChange: (tab: DashboardTab) => void
  children: React.ReactNode
}

function getInitials(name: string) {
  return name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

function useCountdown(targetDate: string | null) {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!targetDate) return
    const target = new Date(targetDate).getTime()

    function update() {
      const diff = target - Date.now()
      if (diff <= 0) { setCountdown('Live now!'); return }
      const days = Math.floor(diff / (1000 * 60 * 60 * 24))
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      setCountdown(days > 0 ? `${days}d ${hours}h ${mins}m` : `${hours}h ${mins}m`)
    }

    update()
    const id = setInterval(update, 60_000)
    return () => clearInterval(id)
  }, [targetDate])

  return countdown
}

function LayoutInner({
  name, cohortDate, activeTab, onTabChange, children,
}: DashboardLayoutProps) {
  const { theme } = useTheme()
  const pal = theme === 'light' ? LIGHT : DARK
  const countdown = useCountdown(cohortDate)

  return (
    <div className={`min-h-screen flex flex-col${theme === 'light' ? ' dashboard-light' : ''}`} style={{ background: pal.pageBg }}>
      {/* Top bar */}
      <header className="sticky top-0 z-40" style={{ background: pal.topBar, borderBottom: `1px solid ${pal.topBorder}` }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <span
            className="font-semibold text-base sm:text-lg tracking-tight"
            style={{ fontFamily: 'var(--font-display)', color: '#e8e5ff' }}
          >
            Micro-PM Residency
          </span>

          <div className="flex items-center gap-3 sm:gap-4">
            {countdown && (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-xs" style={{ color: '#4d4b6b' }}>Starts in</span>
                <span className="text-sm font-semibold tabular-nums" style={{ color: '#6d6af5' }}>
                  {countdown}
                </span>
              </div>
            )}
            <ThemeToggle size={30} />
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
              style={{ background: 'linear-gradient(135deg, #6d6af5, #4a7cf5)', color: '#fff' }}
            >
              {getInitials(name)}
            </div>
          </div>
        </div>

        {/* Mobile countdown strip */}
        {countdown && (
          <div
            className="sm:hidden flex items-center justify-center gap-2 py-1 border-t"
            style={{ borderColor: pal.topBorder }}
          >
            <span className="text-xs" style={{ color: '#4d4b6b' }}>Starts in</span>
            <span className="text-xs font-semibold tabular-nums" style={{ color: '#6d6af5' }}>
              {countdown}
            </span>
          </div>
        )}
      </header>

      {/* Tab navigation */}
      <nav
        className="sticky top-14 z-30 border-b overflow-x-auto"
        style={{ background: pal.navBg, borderColor: pal.navBorder }}
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
                    color: isActive ? '#e8e5ff' : '#4d4b6b',
                    borderBottomColor: isActive ? '#6d6af5' : 'transparent',
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

export default function DashboardLayout(props: DashboardLayoutProps) {
  return (
    <ThemeProvider storageKey="dashboard_theme">
      <LayoutInner {...props} />
    </ThemeProvider>
  )
}
