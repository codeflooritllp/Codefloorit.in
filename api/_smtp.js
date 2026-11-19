/* SMTP settings for the contact form, read only from environment variables (see .env.example and
   docs/contact-form-backend.md). Shared by api/contact.js and scripts/verify-smtp.mjs, so the check
   tests exactly what the live endpoint uses. The "_" prefix stops Vercel serving this file as an endpoint. */

/** Nodemailer transport options, or null when SMTP_HOST is unset. Includes auth only when both
    SMTP_USER and SMTP_PASS are set. */
export function smtpOptions(env = process.env) {
  if (!env.SMTP_HOST) return null;
  const port = Number(env.SMTP_PORT) || 587;
  return {
    host: env.SMTP_HOST,
    port,
    secure: port === 465, // 465 (e.g. Titan) is TLS from the start; other ports must upgrade with STARTTLS
    requireTLS: port !== 465,
    ...(env.SMTP_USER && env.SMTP_PASS ? { auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } } : {}),
    connectionTimeout: 10_000,
    greetingTimeout: 10_000,
    socketTimeout: 15_000,
  };
}
