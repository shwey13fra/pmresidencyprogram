import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

const DEFAULT_TASKS = [
  // Pre-work (individual)
  { title: 'Read the problem brief document',       type: 'individual',    priority: 'medium', due_label: 'Before Friday' },
  { title: 'Join team Slack channel',               type: 'individual',    priority: 'low',    due_label: 'Before Friday' },
  { title: 'Test Zoom link',                        type: 'individual',    priority: 'low',    due_label: 'Before Friday' },
  { title: 'Block calendar for the weekend',        type: 'individual',    priority: 'low',    due_label: 'Before Friday' },
  // Friday
  { title: 'Review startup\'s onboarding flow data', type: 'individual',   priority: 'medium', due_label: 'Fri 9 PM' },
  // Saturday
  { title: 'Prepare 5 user interview questions',    type: 'individual',    priority: 'high',   due_label: 'Sat 10 AM' },
  { title: 'Conduct user interviews',               type: 'collaborative', priority: 'high',   due_label: 'Sat 12 PM' },
  { title: 'Draft opportunity hypothesis',          type: 'collaborative', priority: 'high',   due_label: 'Sat 2 PM' },
  { title: 'Synthesise user interview notes',       type: 'collaborative', priority: 'high',   due_label: 'Sat 3 PM' },
  { title: 'Define core opportunity',               type: 'collaborative', priority: 'high',   due_label: 'Sat 4 PM' },
  { title: 'Frame solution and trade-offs',         type: 'collaborative', priority: 'medium', due_label: 'Sat 5 PM' },
  // Sunday
  { title: 'Complete recommendation deck (slides 1-5)',  type: 'collaborative', priority: 'high',   due_label: 'Sun 11 AM' },
  { title: 'Complete recommendation deck (slides 6-10)', type: 'collaborative', priority: 'high',   due_label: 'Sun 11 AM' },
  { title: 'Practice presentation pitch',           type: 'collaborative', priority: 'medium', due_label: 'Sun 11:30 AM' },
] as const

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { team_id } = await req.json()

  if (!team_id) {
    return NextResponse.json({ error: 'team_id is required' }, { status: 400 })
  }

  const rows = DEFAULT_TASKS.map((task) => ({
    team_id,
    title: task.title,
    type: task.type,
    priority: task.priority,
    due_label: task.due_label,
    status: 'todo',
  }))

  const { error } = await supabaseAdmin.from('tasks').insert(rows)

  if (error) {
    return NextResponse.json({ error: 'Failed to seed tasks' }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: rows.length })
}
