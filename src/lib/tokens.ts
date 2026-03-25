/**
 * Generates a secure, URL-safe 32-character alphanumeric token.
 * Used for participant dashboard access links — no password needed.
 *
 * Strategy: take two UUIDs (128 bits each), strip hyphens, concat,
 * then slice to 32 chars. Result is hex but collision-resistant
 * enough for this use case (~128 bits of entropy).
 */
export function generateDashboardToken(): string {
  const a = crypto.randomUUID().replace(/-/g, '');
  const b = crypto.randomUUID().replace(/-/g, '');
  return (a + b).slice(0, 32);
}
