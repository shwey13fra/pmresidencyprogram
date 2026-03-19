'use client'
import { useState } from 'react'
import Button from '@/components/shared/Button'

export default function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      localStorage.setItem('adminKey', password)
      onSuccess()
    } else {
      setError('Incorrect password')
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background">
      <div className="w-full max-w-sm">
        <p className="text-xs text-accent font-mono uppercase tracking-widest mb-3">
          Admin
        </p>
        <h1 className="font-display text-3xl text-primary mb-8">
          Dashboard access
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            placeholder="Enter admin password"
            autoFocus
            className="w-full px-4 py-3 rounded-lg border border-gray-200 bg-card text-primary placeholder:text-slate/50 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-colors"
          />
          {error && <p className="text-sm text-error">{error}</p>}
          <Button type="submit" disabled={!password || loading} className="w-full py-3">
            {loading ? 'Checking...' : 'Enter dashboard →'}
          </Button>
        </form>
      </div>
    </div>
  )
}
