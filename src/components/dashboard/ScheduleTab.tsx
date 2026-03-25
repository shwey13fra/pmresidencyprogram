'use client'

const DAYS = [
  {
    day: 'Friday', date: 'Apr 11', time: '6:00–8:00 PM IST', session: 'Problem Brief + Toolkit',
    accent: '#a78bfa', bg: 'var(--dc-day-fri)', border: 'var(--dc-border)', badge: 'var(--dc-note)',
    items: [
      'Startup PM presents the problem',
      '30-min crash course: interviews, framing, decks',
      'Team formation & icebreaker',
    ],
  },
  {
    day: 'Saturday', date: 'Apr 12', time: '10:00 AM–6:00 PM IST', session: 'Deep Work Day',
    accent: '#60a5fa', bg: 'var(--dc-day-sat)', border: 'var(--dc-border)', badge: 'var(--dc-note)',
    items: [
      '10–12: User interviews (2 slots × 20 min)',
      '12–1: Lunch break',
      '1–3: Synthesis & opportunity mapping',
      '3–5: Solution framing & trade-offs',
      '5–6: PM check-in (15 min per team)',
    ],
  },
  {
    day: 'Sunday', date: 'Apr 13', time: '10:00 AM–1:00 PM IST', session: 'Presentations + Feedback',
    accent: '#34d399', bg: 'var(--dc-day-sun)', border: 'var(--dc-border)', badge: 'var(--dc-note)',
    items: [
      '10–11: Deck finalisation',
      '11–12:30: Team presentations',
      '12:30–1: Live feedback from startup PM',
    ],
  },
]

export default function ScheduleTab() {
  return (
    <div className="flex flex-col gap-5">
      <div>
        <h2 className="text-xl font-bold mb-1" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
          Weekend Schedule
        </h2>
        <p className="text-sm" style={{ color: 'var(--dc-text-2)' }}>All times in IST. Block your calendar now.</p>
      </div>

      {DAYS.map((day) => (
        <div
          key={day.day}
          className="rounded-3xl overflow-hidden transition-all duration-200"
          style={{ border: '1.5px solid var(--dc-border)', boxShadow: '0 1px 6px rgba(0,0,0,0.15)' }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 4px 24px rgba(0,0,0,0.4)` }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,0,0,0.3)' }}
        >
          <div
            className="flex items-start sm:items-center justify-between gap-4 px-6 py-5 border-b flex-wrap"
            style={{ background: day.bg, borderColor: day.border, borderLeft: `4px solid ${day.accent}` }}
          >
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-bold" style={{ fontFamily: 'var(--font-display)', color: 'var(--dc-text-1)' }}>
                {day.day}
              </h3>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={{ background: day.badge, color: day.accent }}>
                {day.date}
              </span>
            </div>
            <span className="text-xs font-medium tabular-nums" style={{ color: 'var(--dc-text-2)' }}>{day.time}</span>
          </div>

          <div className="px-6 py-5" style={{ background: 'var(--dc-card)', borderLeft: `4px solid ${day.accent}` }}>
            <p className="text-sm font-semibold mb-4" style={{ color: 'var(--dc-text-1)' }}>{day.session}</p>
            <ul className="flex flex-col gap-2.5">
              {day.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0" style={{ background: day.accent }} />
                  <span className="text-sm" style={{ color: 'var(--dc-text-1)' }}>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
