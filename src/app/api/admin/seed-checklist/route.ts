import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

const DEFAULT_CHECKLIST = [
  { text: 'Downloaded problem brief',          sort_order: 1 },
  { text: 'Joined Slack channel',              sort_order: 2 },
  { text: 'Tested Zoom link',                  sort_order: 3 },
  { text: 'Reviewed interview guide',          sort_order: 4 },
  { text: 'Prepared interview questions',      sort_order: 5 },
  { text: 'Blocked calendar for the weekend',  sort_order: 6 },
] as const

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { applicant_id } = await req.json()

  if (!applicant_id) {
    return NextResponse.json({ error: 'applicant_id is required' }, { status: 400 })
  }

  const rows = DEFAULT_CHECKLIST.map((item) => ({
    applicant_id,
    text: item.text,
    sort_order: item.sort_order,
    is_done: false,
  }))

  const { error } = await supabaseAdmin.from('checklist_items').insert(rows)

  if (error) {
    return NextResponse.json({ error: 'Failed to seed checklist', detail: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true, count: rows.length })
}
