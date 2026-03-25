export function acceptanceEmailHtml({
  name,
  teamName,
  teammateNames = [],
  statusUrl,
  siteUrl,
}: {
  name: string
  teamName?: string
  teammateNames?: string[]
  statusUrl: string
  siteUrl?: string
}) {
  const teamSection = teamName
    ? `
    <div style="background:#f8f9fa;border-radius:8px;padding:20px;margin:24px 0;border-left:3px solid #e8913a;">
      <p style="margin:0 0 6px;font-size:12px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Your Team</p>
      <p style="margin:0 0 4px;font-size:17px;font-weight:600;color:#1a1a2e;">${teamName}</p>
      ${teammateNames.length ? `<p style="margin:0;font-size:14px;color:#64748b;">With: ${teammateNames.join(', ')}</p>` : ''}
    </div>`
    : ''

  return `<!DOCTYPE html>
<html>
  <head><meta charset="utf-8" /><meta name="viewport" content="width=device-width, initial-scale=1" /></head>
  <body style="margin:0;padding:0;background:#fafaf8;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
      <tr><td align="center">
        <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px;">
          <tr><td>
            <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">Micro-PM Residency</p>
            <h1 style="margin:0 0 8px;font-size:26px;color:#1a1a2e;font-weight:700;">You're in, ${name}!</h1>
            <p style="margin:0 0 24px;font-size:15px;color:#e8913a;font-weight:600;">April 11–13, 2026</p>
            <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.6;">
              We reviewed every application personally and we're genuinely excited to have you.
              You've been selected for the Micro-PM Residency.
            </p>
            ${teamSection}
            ${siteUrl ? `
            <div style="background:#fff8f2;border-radius:8px;padding:16px 20px;margin:0 0 24px;border:1px solid #fde8c8;">
              <p style="margin:0 0 6px;font-size:13px;color:#64748b;">Access your participant dashboard</p>
              <a href="${siteUrl}/dashboard" style="font-size:14px;font-weight:600;color:#e8913a;text-decoration:none;">${siteUrl}/dashboard →</a>
            </div>` : ''}
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1a1a2e;">The weekend schedule (IST):</p>
            <table width="100%" style="margin:0 0 24px;font-size:13px;color:#64748b;border-collapse:collapse;">
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;"><strong style="color:#1a1a2e;">Friday</strong></td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">6:00 PM – 8:00 PM</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">Problem brief + team formation</td></tr>
              <tr><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;"><strong style="color:#1a1a2e;">Saturday</strong></td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">10:00 AM – 6:00 PM</td><td style="padding:8px 0;border-bottom:1px solid #f1f5f9;">User interviews + recommendation</td></tr>
              <tr><td style="padding:8px 0;"><strong style="color:#1a1a2e;">Sunday</strong></td><td style="padding:8px 0;">10:00 AM – 1:00 PM</td><td style="padding:8px 0;">Final pitch + PM feedback</td></tr>
            </table>
            <p style="margin:0 0 8px;font-size:14px;font-weight:600;color:#1a1a2e;">What to do next:</p>
            <ul style="margin:0 0 24px;padding-left:20px;font-size:14px;color:#64748b;line-height:1.8;">
              <li>Join the Slack workspace (link coming soon)</li>
              <li>Say hi to your team</li>
              <li>Block April 11–13 on your calendar</li>
            </ul>
            <a href="${statusUrl}" style="display:inline-block;background:#e8913a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;">Check your status →</a>
            <p style="margin:32px 0 0;font-size:13px;color:#64748b;">— The Micro-PM Residency Team</p>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}
