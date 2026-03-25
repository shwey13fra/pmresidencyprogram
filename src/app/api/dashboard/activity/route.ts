import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')
  if (!team_id) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

  // Fetch all team member names for mapping
  const { data: members } = await supabaseAdmin
    .from('applicants')
    .select('id, name')
    .eq('team_id', team_id)

  const nameMap: Record<string, string> = {}
  for (const m of members ?? []) nameMap[m.id] = m.name

  // Recent team notes
  const { data: notes } = await supabaseAdmin
    .from('notes')
    .select('id, author_id, tag, created_at')
    .eq('team_id', team_id)
    .order('created_at', { ascending: false })
    .limit(10)

  // Recent interviews
  const { data: interviews } = await supabaseAdmin
    .from('interviews')
    .select('id, author_id, interviewee_name, created_at')
    .eq('team_id', team_id)
    .order('created_at', { ascending: false })
    .limit(10)

  const noteEvents = (notes ?? []).map((n) => ({
    id: `note-${n.id}`,
    type: 'note' as const,
    actor_name: nameMap[n.author_id] ?? 'Someone',
    summary: n.tag ? `posted a ${n.tag}` : 'posted a note',
    created_at: n.created_at,
  }))

  const interviewEvents = (interviews ?? []).map((i) => ({
    id: `interview-${i.id}`,
    type: 'interview' as const,
    actor_name: nameMap[i.author_id] ?? 'Someone',
    summary: `logged an interview with ${i.interviewee_name}`,
    created_at: i.created_at,
  }))

  const activity = [...noteEvents, ...interviewEvents]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 15)

  return NextResponse.json({ activity })
}
