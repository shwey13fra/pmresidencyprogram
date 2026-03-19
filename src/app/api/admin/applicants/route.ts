import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabaseAdmin
    .from('applicants')
    .select('*, teams(id, name)')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Fetch applicants error:', error)
    return NextResponse.json({ error: 'Failed to fetch applicants' }, { status: 500 })
  }

  return NextResponse.json({ applicants: data })
}
