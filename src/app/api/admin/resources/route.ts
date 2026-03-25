import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

const ADMIN_KEY = process.env.ADMIN_KEY

function checkAuth(req: NextRequest) {
  return req.headers.get('x-admin-key') === ADMIN_KEY
}

export async function GET(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabaseAdmin
    .from('resources')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resources: data ?? [] })
}

export async function POST(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { team_id, title, url, description, type } = await req.json()
  if (!title?.trim() || !url?.trim()) {
    return NextResponse.json({ error: 'title and url required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('resources')
    .insert({
      team_id: team_id || null,
      title: title.trim(),
      url: url.trim(),
      description: description?.trim() || null,
      type: type || 'link',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ resource: data })
}

export async function DELETE(req: NextRequest) {
  if (!checkAuth(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('resources').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
