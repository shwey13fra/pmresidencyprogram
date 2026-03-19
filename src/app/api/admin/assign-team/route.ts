import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, team_id } = await req.json()
  if (!id) {
    return NextResponse.json({ error: 'Applicant id required' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('applicants')
    .update({ team_id: team_id || null })
    .eq('id', id)

  if (error) {
    console.error('Assign team error:', error)
    return NextResponse.json({ error: 'Failed to assign team' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
