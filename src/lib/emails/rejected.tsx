export function rejectionEmailHtml({ name }: { name: string }) {
  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#fafaf8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px;">
          <tr><td>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Micro-PM Residency</p>
            <h1 style="margin:0 0 24px;font-size:24px;color:#1a1a2e;font-weight:600;">Hi ${name},</h1>
            <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.6;">
              Thank you for applying to the Micro-PM Residency. We read your application carefully
              and genuinely appreciated the thought you put into it.
            </p>
            <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.6;">
              This cohort's spots are filled, and we weren't able to include you this time.
              This isn't a reflection of your potential — we had strong applications and limited space.
            </p>
            <p style="margin:0 0 24px;font-size:15px;color:#64748b;line-height:1.6;">
              You're on our priority list for the next cohort. When we open applications again,
              you'll hear from us first.
            </p>
            <p style="margin:0 0 32px;font-size:15px;color:#1a1a2e;font-weight:500;">
              We hope to work with you soon.
            </p>
            <p style="margin:0;font-size:13px;color:#64748b;">— The Micro-PM Residency Team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}
