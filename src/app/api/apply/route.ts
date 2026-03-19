import { supabaseAdmin } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { confirmationEmailHtml } from '@/lib/emails/confirmation'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { name, email, phone, current_role, linkedin_url, why_pm, product_answer } = body

  // Server-side validation
  if (!name || !email || !phone || !current_role || !why_pm || !product_answer) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (why_pm.trim().length < 100) {
    return NextResponse.json(
      { error: 'Why PM answer must be at least 100 characters' },
      { status: 400 }
    )
  }
  if (product_answer.trim().length < 150) {
    return NextResponse.json(
      { error: 'Product answer must be at least 150 characters' },
      { status: 400 }
    )
  }

  // Insert into Supabase
  const { error: dbError } = await supabaseAdmin
    .from('applicants')
    .insert({
      name,
      email,
      phone,
      current_role,
      linkedin_url: linkedin_url || null,
      why_pm,
      product_answer,
    })

  if (dbError) {
    console.error('Supabase insert error:', dbError)
    if (dbError.code === '23505') {
      return NextResponse.json({ error: 'duplicate_email' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to save application' }, { status: 500 })
  }

  // Send confirmation email
  const statusUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/status`
  await resend.emails.send({
    from: 'Micro-PM Residency <onboarding@resend.dev>',
    to: email,
    subject: 'We got your application — Micro-PM Residency',
    html: confirmationEmailHtml({ name, statusUrl }),
  })

  return NextResponse.json({ success: true })
}
