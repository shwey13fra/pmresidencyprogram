import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

// GET — fetch all startup problems
export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('startup_problems')
    .select('*')
    .order('created_at', { ascending: true })

  if (error) return NextResponse.json({ error: 'Failed to fetch problems' }, { status: 500 })
  return NextResponse.json({ problems: data })
}

// POST — create a new startup problem
export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const {
    startup_name, startup_problem, startup_pm_name, startup_data_description,
    zoom_link, miro_link, slack_link, deck_template_link, problem_brief_link, interview_guide_link,
  } = body

  if (!startup_name) return NextResponse.json({ error: 'startup_name is required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('startup_problems')
    .insert({
      startup_name,
      startup_problem: startup_problem ?? null,
      startup_pm_name: startup_pm_name ?? null,
      startup_data_description: startup_data_description ?? null,
      zoom_link: zoom_link ?? null,
      miro_link: miro_link ?? null,
      slack_link: slack_link ?? null,
      deck_template_link: deck_template_link ?? null,
      problem_brief_link: problem_brief_link ?? null,
      interview_guide_link: interview_guide_link ?? null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create problem' }, { status: 500 })
  return NextResponse.json({ problem: data }, { status: 201 })
}

// PATCH — update an existing startup problem
export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { id, ...fields } = body

  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('startup_problems')
    .update(fields)
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to update problem' }, { status: 500 })
  return NextResponse.json({ success: true })
}

// DELETE — remove a startup problem
export async function DELETE(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const { error } = await supabaseAdmin
    .from('startup_problems')
    .delete()
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'Failed to delete problem' }, { status: 500 })
  return NextResponse.json({ success: true })
}
