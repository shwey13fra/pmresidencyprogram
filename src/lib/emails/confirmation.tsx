export function confirmationEmailHtml({
  name,
  statusUrl,
}: {
  name: string
  statusUrl: string
}) {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style="margin:0;padding:0;background:#fafaf8;font-family:'DM Sans',Arial,sans-serif;">
        <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 20px;">
          <tr>
            <td align="center">
              <table width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;border:1px solid #e5e7eb;padding:40px;">
                <tr>
                  <td>
                    <p style="margin:0 0 8px;font-size:13px;color:#64748b;text-transform:uppercase;letter-spacing:0.1em;">
                      Micro-PM Residency
                    </p>
                    <h1 style="margin:0 0 24px;font-size:24px;color:#1a1a2e;font-weight:600;">
                      We got your application, ${name}.
                    </h1>
                    <p style="margin:0 0 16px;font-size:15px;color:#64748b;line-height:1.6;">
                      Thanks for applying to the Micro-PM Residency (April 11–13).
                      We review every application personally and you'll hear back within 48 hours.
                    </p>
                    <p style="margin:0 0 32px;font-size:15px;color:#64748b;line-height:1.6;">
                      In the meantime, you can check your application status anytime:
                    </p>
                    <a
                      href="${statusUrl}"
                      style="display:inline-block;background:#e8913a;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:600;"
                    >
                      Check your status →
                    </a>
                    <p style="margin:40px 0 0;font-size:13px;color:#64748b;">
                      — The Micro-PM Residency Team
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
    </html>
  `
}
