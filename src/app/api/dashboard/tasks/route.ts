import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const team_id = req.nextUrl.searchParams.get('team_id')

  if (!team_id) {
    return NextResponse.json({ error: 'team_id is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .select('*')
    .eq('team_id', team_id)
    .order('created_at', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch tasks' }, { status: 500 })
  }

  return NextResponse.json({ tasks: data })
}

export async function PATCH(req: NextRequest) {
  const { taskId, status } = await req.json()

  if (!taskId || !status) {
    return NextResponse.json({ error: 'taskId and status are required' }, { status: 400 })
  }

  const validStatuses = ['todo', 'in_progress', 'review', 'done']
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('tasks')
    .update({ status })
    .eq('id', taskId)

  if (error) {
    return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
