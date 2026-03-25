import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const applicant_id = req.nextUrl.searchParams.get('applicant_id')
  if (!applicant_id) return NextResponse.json({ error: 'applicant_id required' }, { status: 400 })

  const { data, error } = await supabaseAdmin
    .from('private_notes')
    .select('*')
    .eq('applicant_id', applicant_id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ notes: data ?? [] })
}

export async function POST(req: NextRequest) {
  const { applicant_id, content } = await req.json()
  if (!applicant_id || !content?.trim()) {
    return NextResponse.json({ error: 'applicant_id and content required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('private_notes')
    .insert({ applicant_id, content: content.trim() })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ note: data })
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const { error } = await supabaseAdmin.from('private_notes').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
