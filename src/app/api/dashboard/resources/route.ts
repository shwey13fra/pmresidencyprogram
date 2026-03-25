import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')
  if (!team_id) return NextResponse.json({ error: 'team_id required' }, { status: 400 })

  // Fetch global resources (team_id is null) + team-specific resources
  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .or(`team_id.is.null,team_id.eq.${team_id}`)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resources: data ?? [] })
}
