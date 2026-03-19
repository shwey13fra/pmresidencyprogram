import { supabaseAdmin } from '@/lib/supabase'
import { NextResponse } from 'next/server'

export async function GET() {
  const { count, error } = await supabaseAdmin
    .from('applicants')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'accepted')

  if (error) return NextResponse.json({ accepted: 0 })
  return NextResponse.json({ accepted: count ?? 0 })
}
