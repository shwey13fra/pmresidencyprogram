import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('*, problem_id, applicants(id, name, status)')
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Fetch teams error:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }

  return NextResponse.json({ teams: data })
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id, problem_id, pm_feedback } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const update: Record<string, unknown> = {}
  if (problem_id !== undefined) update.problem_id = problem_id || null
  if (pm_feedback !== undefined) update.pm_feedback = pm_feedback

  const { error } = await supabaseAdmin.from('teams').update(update).eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed to update team' }, { status: 500 })
  return NextResponse.json({ success: true })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { name } = await req.json()
  if (!name?.trim()) {
    return NextResponse.json({ error: 'Team name is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('teams')
    .insert({ name: name.trim(), cohort_date: '2026-04-11' })
    .select()
    .single()

  if (error) {
    console.error('Create team error:', error)
    return NextResponse.json({ error: 'Failed to create team' }, { status: 500 })
  }

  return NextResponse.json({ team: data })
}
