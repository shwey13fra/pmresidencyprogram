import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const applicant_id = req.nextUrl.searchParams.get('applicant_id')

  if (!applicant_id) {
    return NextResponse.json({ error: 'applicant_id is required' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('checklist_items')
    .select('*')
    .eq('applicant_id', applicant_id)
    .order('sort_order', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch checklist' }, { status: 500 })
  }

  return NextResponse.json({ items: data })
}

export async function PATCH(req: NextRequest) {
  const { itemId, is_done } = await req.json()

  if (!itemId || typeof is_done !== 'boolean') {
    return NextResponse.json(
      { error: 'itemId and is_done (boolean) are required' },
      { status: 400 }
    )
  }

  const { error } = await supabaseAdmin
    .from('checklist_items')
    .update({ is_done })
    .eq('id', itemId)

  if (error) {
    return NextResponse.json({ error: 'Failed to update checklist item' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
