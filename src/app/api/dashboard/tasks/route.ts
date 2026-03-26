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

export async function POST(req: NextRequest) {
  const { team_id, author_id, title, type, priority } = await req.json()

  if (!team_id || !author_id || !title?.trim()) {
    return NextResponse.json({ error: 'team_id, author_id, and title are required' }, { status: 400 })
  }

  const validTypes = ['individual', 'collaborative']
  const validPriorities = ['high', 'medium', 'low']
  if (!validTypes.includes(type)) return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
  if (!validPriorities.includes(priority)) return NextResponse.json({ error: 'Invalid priority' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('tasks')
    .insert({
      team_id,
      title: title.trim(),
      type,
      priority,
      status: 'todo',
      assignee_id: type === 'individual' ? author_id : null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: 'Failed to create task' }, { status: 500 })
  return NextResponse.json({ task: data })
}

export async function PATCH(req: NextRequest) {
  const { taskId, status, assignee_id } = await req.json()

  if (!taskId) {
    return NextResponse.json({ error: 'taskId is required' }, { status: 400 })
  }

  const update: Record<string, unknown> = {}

  if (status !== undefined) {
    const validStatuses = ['todo', 'in_progress', 'review', 'done']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 })
    }
    update.status = status
  }

  if (assignee_id !== undefined) {
    update.assignee_id = assignee_id
  }

  if (Object.keys(update).length === 0) {
    return NextResponse.json({ error: 'Nothing to update' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('tasks')
    .update(update)
    .eq('id', taskId)

  if (error) return NextResponse.json({ error: 'Failed to update task' }, { status: 500 })
  return NextResponse.json({ success: true })
}
