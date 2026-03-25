import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')

  if (!team_id) {
    return NextResponse.json({ error: 'team_id is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('notes')
    .select('*')
    .eq('team_id', team_id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch notes' }, { status: 500 })
  }

  return NextResponse.json({ notes: data })
}

export async function POST(req: NextRequest) {
  const { team_id, author_id, content, tag } = await req.json()

  if (!team_id || !author_id || !content) {
    return NextResponse.json(
      { error: 'team_id, author_id, and content are required' },
      { status: 400 }
    )
  }

  const validTags = ['insight', 'decision', 'risk']
  if (tag && !validTags.includes(tag)) {
    return NextResponse.json({ error: 'Invalid tag value' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('notes')
    .insert({ team_id, author_id, content, tag: tag ?? null })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to create note' }, { status: 500 })
  }

  return NextResponse.json({ note: data }, { status: 201 })
}
