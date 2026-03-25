import { supabaseAdmin } from '@/lib/supabase'
import { resend } from '@/lib/resend'
import { acceptanceEmailHtml } from '@/lib/emails/accepted'
import { rejectionEmailHtml } from '@/lib/emails/rejected'
import { NextRequest, NextResponse } from 'next/server'

function isAdmin(req: NextRequest) {
  return req.headers.get('x-admin-key') === process.env.ADMIN_PASSWORD
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id, status } = await req.json()
  if (!id || !status) {
    return NextResponse.json({ error: 'id and status required' }, { status: 400 })
  }

  const { error: updateError } = await supabaseAdmin
    .from('applicants')
    .update({ status })
    .eq('id', id)

  if (updateError) {
    console.error('Update status error:', updateError)
    return NextResponse.json({ error: 'Failed to update status' }, { status: 500 })
  }

  // Send email for accepted or rejected
  if (status === 'accepted' || status === 'rejected') {
    const { data: applicant } = await supabaseAdmin
      .from('applicants')
      .select('*, teams(id, name)')
      .eq('id', id)
      .single()

    if (applicant) {
      const statusUrl = `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/status`

      if (status === 'accepted') {
        let teammateNames: string[] = []
        if (applicant.team_id) {
          const { data: teammates } = await supabaseAdmin
            .from('applicants')
            .select('name')
            .eq('team_id', applicant.team_id)
            .neq('id', id)
          teammateNames = (teammates ?? []).map((t: { name: string }) => t.name)
        }

        await resend.emails.send({
          from: 'Micro-PM Residency <onboarding@resend.dev>',
          to: applicant.email,
          subject: "You're in! Micro-PM Residency — April 11–13",
          html: acceptanceEmailHtml({
            name: applicant.name,
            teamName: applicant.teams?.name,
            teammateNames,
            statusUrl,
            siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
          }),
        })
      } else {
        await resend.emails.send({
          from: 'Micro-PM Residency <onboarding@resend.dev>',
          to: applicant.email,
          subject: 'Update on your Micro-PM Residency application',
          html: rejectionEmailHtml({ name: applicant.name }),
        })
      }
    }
  }

  return NextResponse.json({ success: true })
}
