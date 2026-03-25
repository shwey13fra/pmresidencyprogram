'use client'

const DAYS = [
  {
    day: 'Friday',
    date: 'Apr 11',
    time: '6:00–8:00 PM IST',
    session: 'Problem Brief + Toolkit',
    accent: '#e8913a',
    bg: '#fffbf5',
    badge: '#fef3e2',
    items: [
      'Startup PM presents the problem',
      '30-min crash course: interviews, framing, decks',
      'Team formation & icebreaker',
    ],
  },
  {
    day: 'Saturday',
    date: 'Apr 12',
    time: '10:00 AM–6:00 PM IST',
    session: 'Deep Work Day',
    accent: '#3b82f6',
    bg: '#f0f7ff',
    badge: '#eff6ff',
    items: [
      '10–12: User interviews (2 slots × 20 min)',
      '12–1: Lunch break',
      '1–3: Synthesis & opportunity mapping',
      '3–5: Solution framing & trade-offs',
      '5–6: PM check-in (15 min per team)',
    ],
  },
  {
    day: 'Sunday',
    date: 'Apr 13',
    time: '10:00 AM–1:00 PM IST',
    session: 'Presentations + Feedback',
    accent: '#10b981',
    bg: '#f0fdf9',
    badge: '#dcfce7',
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
        <h2
          className="text-xl font-bold mb-1"
          style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
        >
          Weekend Schedule
        </h2>
        <p className="text-sm" style={{ color: '#64748b' }}>
          All times in IST. Block your calendar now.
        </p>
      </div>

      {DAYS.map((day) => (
        <div
          key={day.day}
          className="rounded-2xl overflow-hidden"
          style={{ border: '1px solid #e8e5df' }}
        >
          {/* Left accent bar + header */}
          <div
            className="flex items-start sm:items-center justify-between gap-4 px-6 py-5 border-b flex-wrap"
            style={{
              background: day.bg,
              borderColor: '#e8e5df',
              borderLeft: `4px solid ${day.accent}`,
            }}
          >
            <div className="flex items-center gap-3">
              <h3
                className="text-lg font-bold"
                style={{ fontFamily: 'var(--font-display)', color: '#1a1a2e' }}
              >
                {day.day}
              </h3>
              <span
                className="text-xs font-semibold px-2.5 py-1 rounded-full"
                style={{ background: day.badge, color: day.accent }}
              >
                {day.date}
              </span>
            </div>
            <span className="text-xs font-medium tabular-nums" style={{ color: '#64748b' }}>
              {day.time}
            </span>
          </div>

          {/* Session title + items */}
          <div
            className="px-6 py-5 bg-white"
            style={{ borderLeft: `4px solid ${day.accent}` }}
          >
            <p className="text-sm font-semibold mb-4" style={{ color: '#1a1a2e' }}>
              {day.session}
            </p>
            <ul className="flex flex-col gap-2.5">
              {day.items.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span
                    className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                    style={{ background: day.accent }}
                  />
                  <span className="text-sm" style={{ color: '#1a1a2e' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}
