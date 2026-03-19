'use client'
import { useEffect, useState } from 'react'

const COHORT_DATE = new Date(
  process.env.NEXT_PUBLIC_COHORT_DATE ?? '2026-04-11T18:00:00+05:30'
)

function getTimeLeft(target: Date) {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

type TimeLeft = ReturnType<typeof getTimeLeft>

export default function CountdownTimer() {
  const [time, setTime] = useState<TimeLeft | null>(null)

  useEffect(() => {
    setTime(getTimeLeft(COHORT_DATE))
    const interval = setInterval(
      () => setTime(getTimeLeft(COHORT_DATE)),
      1000
    )
    return () => clearInterval(interval)
  }, [])

  const units = [
    { label: 'Days', value: time?.days ?? 0 },
    { label: 'Hours', value: time?.hours ?? 0 },
    { label: 'Mins', value: time?.minutes ?? 0 },
    { label: 'Secs', value: time?.seconds ?? 0 },
  ]

  return (
    <div>
      <p className="text-xs text-slate uppercase tracking-widest mb-3">
        Cohort starts in
      </p>
      <div className="flex gap-4">
        {units.map(({ label, value }) => (
          <div key={label} className="flex flex-col items-center">
            <span className="font-mono text-2xl font-semibold text-primary tabular-nums">
              {time === null ? '--' : String(value).padStart(2, '0')}
            </span>
            <span className="text-xs text-slate mt-1">{label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
