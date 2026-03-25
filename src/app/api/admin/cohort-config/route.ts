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
    .from('cohort_config')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error) {
    return NextResponse.json({ cohortConfig: null })
  }

  return NextResponse.json({ cohortConfig: data })
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()

  const {
    cohort_date,
    startup_name,
    startup_problem,
    startup_pm_name,
    startup_data_description,
    zoom_link,
    miro_link,
    slack_link,
    deck_template_link,
    problem_brief_link,
    interview_guide_link,
    pm_feedback,
  } = body

  if (!cohort_date) {
    return NextResponse.json({ error: 'cohort_date is required' }, { status: 400 })
  }

  // Check if a row already exists — upsert by replacing the latest row
  const { data: existing } = await supabaseAdmin
    .from('cohort_config')
    .select('id')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  const payload = {
    cohort_date,
    startup_name: startup_name ?? null,
    startup_problem: startup_problem ?? null,
    startup_pm_name: startup_pm_name ?? null,
    startup_data_description: startup_data_description ?? null,
    zoom_link: zoom_link ?? null,
    miro_link: miro_link ?? null,
    slack_link: slack_link ?? null,
    deck_template_link: deck_template_link ?? null,
    problem_brief_link: problem_brief_link ?? null,
    interview_guide_link: interview_guide_link ?? null,
    pm_feedback: pm_feedback ?? null,
  }

  let error
  if (existing?.id) {
    ;({ error } = await supabaseAdmin
      .from('cohort_config')
      .update(payload)
      .eq('id', existing.id))
  } else {
    ;({ error } = await supabaseAdmin.from('cohort_config').insert(payload))
  }

  if (error) {
    return NextResponse.json({ error: 'Failed to save cohort config' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
