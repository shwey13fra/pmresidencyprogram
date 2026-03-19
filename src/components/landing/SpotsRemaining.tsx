'use client'
import { useEffect, useState } from 'react'

const MAX_SPOTS = Number(process.env.NEXT_PUBLIC_MAX_SPOTS) || 20

export default function SpotsRemaining() {
  const [accepted, setAccepted] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/spots')
      .then((r) => r.json())
      .then((d) => setAccepted(d.accepted ?? 0))
      .finally(() => setLoading(false))
  }, [])

  const remaining = MAX_SPOTS - accepted
  const fillPercent = (accepted / MAX_SPOTS) * 100

  return (
    <div>
      <p className="text-xs text-slate uppercase tracking-widest mb-3">
        Spots Available
      </p>
      {loading ? (
        <div className="h-8 w-32 bg-gray-100 animate-pulse rounded" />
      ) : (
        <>
          <p className="font-mono text-2xl font-semibold text-primary">
            {remaining}{' '}
            <span className="text-slate text-base font-normal">
              of {MAX_SPOTS} left
            </span>
          </p>
          <div className="mt-2 h-1.5 w-32 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-accent rounded-full transition-all duration-700"
              style={{ width: `${fillPercent}%` }}
            />
          </div>
        </>
      )}
    </div>
  )
}
