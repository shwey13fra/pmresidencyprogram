import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 })
  }

  // Fetch applicant with team (including problem + pm_feedback)
  const { data: applicant, error } = await supabaseAdmin
    .from('applicants')
    .select('*, teams(id, name, problem_id, pm_feedback, startup_problems(*))')
    .eq('email', email.toLowerCase().trim())
    .eq('status', 'accepted')
    .single()

  if (error || !applicant) {
    return NextResponse.json(
      { error: 'No accepted application found for this email' },
      { status: 401 }
    )
  }

  // Fetch teammates
  let teammates: { id: string; name: string; current_role: string }[] = []
  if (applicant.team_id) {
    const { data } = await supabaseAdmin
      .from('applicants')
      .select('id, name, current_role')
      .eq('team_id', applicant.team_id)
      .neq('id', applicant.id)
      .eq('status', 'accepted')
    teammates = data ?? []
  }

  // Fetch cohort config (just the date)
  const { data: cohortConfig } = await supabaseAdmin
    .from('cohort_config')
    .select('cohort_date')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const team = applicant.teams as {
    id: string
    name: string
    problem_id: string | null
    pm_feedback: string | null
    startup_problems: Record<string, unknown> | null
  } | null

  return NextResponse.json({
    applicant: {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      current_role: applicant.current_role,
      team_id: applicant.team_id,
      dashboard_token: applicant.dashboard_token,
    },
    team: team ? { id: team.id, name: team.name } : null,
    teammates,
    // problem is the startup's problem assigned to this team
    problem: team?.startup_problems ?? null,
    // pm_feedback is per team
    pmFeedback: team?.pm_feedback ?? null,
    cohortDate: cohortConfig?.cohort_date ?? null,
  })
}
