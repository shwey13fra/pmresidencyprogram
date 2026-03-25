import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')
  if (!team_id) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('teams')
    .select('deck_url, deck_submitted_at')
    .eq('id', team_id)
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deck_url: data.deck_url, deck_submitted_at: data.deck_submitted_at })
}

export async function PATCH(req: NextRequest) {
  const { team_id, deck_url } = await req.json()
  if (!team_id || !deck_url?.trim()) {
    return NextResponse.json({ error: 'team_id and deck_url required' }, { status: 400 })
  }

  const submittedAt = new Date().toISOString()
  const { error } = await supabaseAdmin
    .from('teams')
    .update({ deck_url: deck_url.trim(), deck_submitted_at: submittedAt })
    .eq('id', team_id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ deck_url: deck_url.trim(), deck_submitted_at: submittedAt })
}
