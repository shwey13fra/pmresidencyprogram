import { supabaseAdmin } from '@/lib/supabase'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  // Verify applicant exists and is accepted
  const { data: applicant } = await supabaseAdmin
    .from('applicants')
    .select('id')
    .eq('email', email.toLowerCase().trim())
    .eq('status', 'accepted')
    .single()

  if (!applicant) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const hash = await bcrypt.hash(password, 12)

  const { error } = await supabaseAdmin
    .from('applicants')
    .update({ password_hash: hash })
    .eq('id', applicant.id)

  if (error) {
    return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
