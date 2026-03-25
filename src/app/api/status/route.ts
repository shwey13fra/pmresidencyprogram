import { supabaseAdmin as supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { data: applicant, error } = await supabase
    .from('applicants')
    .select('id, name, status, team_id, created_at, teams(id, name, problem_id, startup_problems(startup_name, startup_problem, startup_pm_name, zoom_link, miro_link, slack_link, deck_template_link, problem_brief_link, interview_guide_link))')
    .eq('email', email.trim().toLowerCase())
    .single()

  if (error || !applicant) {
    return NextResponse.json({ error: 'not_found' }, { status: 404 })
  }

  let teammateNames: string[] = []
  if (applicant.team_id) {
    const { data: teammates } = await supabase
      .from('applicants')
      .select('name')
      .eq('team_id', applicant.team_id)
      .neq('id', applicant.id)
    teammateNames = (teammates ?? []).map((t: { name: string }) => t.name.split(' ')[0])
  }

  const team = applicant.teams as unknown as {
    id: string
    name: string
    startup_problems: {
      startup_name: string | null
      startup_problem: string | null
      startup_pm_name: string | null
      zoom_link: string | null
      miro_link: string | null
      slack_link: string | null
      deck_template_link: string | null
      problem_brief_link: string | null
      interview_guide_link: string | null
    } | null
  } | null

  const problem = team?.startup_problems ?? null

  return NextResponse.json({
    status: applicant.status,
    name: applicant.name,
    applied_at: applicant.created_at,
    team: team ? { id: team.id, name: team.name } : null,
    teammates: teammateNames,
    problem,
  })
}
