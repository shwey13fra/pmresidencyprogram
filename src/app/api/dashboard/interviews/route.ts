import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')
  if (!team_id) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('interviews')
    .select('*')
    .eq('team_id', team_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ interviews: data ?? [] })
}

export async function POST(req: NextRequest) {
  const { team_id, author_id, interviewee_name, interviewee_role, key_insight, notes } = await req.json()

  if (!team_id || !author_id || !interviewee_name?.trim()) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('interviews')
    .insert({
      team_id,
      author_id,
      interviewee_name: interviewee_name.trim(),
      interviewee_role: interviewee_role?.trim() || null,
      key_insight: key_insight?.trim() || null,
      notes: notes?.trim() || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ interview: data })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  const requestor_id = req.nextUrl.searchParams.get('requestor_id')
  if (!id || !requestor_id) return NextResponse.json({ error: 'id and requestor_id required' }, { status: 400 })

  // Verify the requestor is the author before deleting
  const { data: interview } = await supabaseAdmin
    .from('interviews')
    .select('author_id')
    .eq('id', id)
    .single()

  if (!interview) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (interview.author_id !== requestor_id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabaseAdmin.from('interviews').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
