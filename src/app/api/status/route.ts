import { supabase } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  if (!email?.trim()) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  const { data: applicant, error } = await supabase
    .from('applicants')
    .select('id, name, status, team_id, created_at, teams(id, name)')
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

  return NextResponse.json({
    status: applicant.status,
    name: applicant.name,
    applied_at: applicant.created_at,
    team: applicant.teams ?? null,
    teammates: teammateNames,
    links: {
      zoom: '#',
      slack: '#',
      deck_template: '#',
      problem_brief: '#',
    },
  })
}
