/* POST /api/contact: receives the contact form (src/components/ContactForm.jsx) and emails it to
   CONTACT_TO_EMAIL over SMTP. A Vercel serverless function; SMTP settings come only from the
   project's environment variables (see .env.example). Never log or echo back what the visitor typed. */
import { createHash } from "node:crypto";
import nodemailer from "nodemailer";
import { FIELDS, validate } from "../src/lib/contact.js";
import { smtpOptions } from "./_smtp.js";

const MAX_BYTES = 20_000; // the largest valid enquiry is well under this
const MAX_LINKS = 5;

// ponytail: in-memory and per function instance. Vercel runs several instances and recycles them,
// so the rate limit and duplicate check are best-effort; move both to a shared store (Vercel KV,
// Upstash Redis) if abuse gets past them.
const RATE_WINDOW_MS = 10 * 60_000;
const RATE_MAX = 5; // requests per IP per window
const hits = new Map(); // ip -> request times
const sent = new Map(); // enquiry fingerprint -> time sent, so a resend is not emailed twice

function reply(res, status, body, headers = {}) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  for (const [k, v] of Object.entries(headers)) res.setHeader(k, v);
  res.end(JSON.stringify(body));
}

const SORRY = "We could not send your message right now. Please try again shortly, or contact us on WhatsApp or by email.";

/** Plain text only: control characters removed (newlines and tabs kept in the message), trimmed. */
const clean = (v, multiline = false) =>
  String(v ?? "")
    .replace(/\r\n?/g, "\n")
    .replace(multiline ? /(?![\n\t])\p{Cc}/gu : /\p{Cc}/gu, multiline ? "" : " ")
    .trim();

function rateLimited(ip, now) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 10_000) hits.clear(); // bound memory on a long-lived instance
  return recent.length > RATE_MAX;
}

function sameOrigin(req) {
  const origin = req.headers.origin;
  if (!origin) return true; // non-browser clients send none; the other checks still apply
  try {
    return new URL(origin).host === req.headers.host;
  } catch {
    return false; // e.g. "null" from a sandboxed page
  }
}

async function readJson(req) {
  if (req.body !== undefined) return typeof req.body === "string" ? JSON.parse(req.body) : req.body; // parsed by Vercel
  let raw = "";
  for await (const chunk of req) raw += chunk;
  return JSON.parse(raw);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return reply(res, 405, { ok: false, error: "Method not allowed." }, { Allow: "POST" });
  if (!sameOrigin(req)) return reply(res, 403, { ok: false, error: "Forbidden." });
  if (!String(req.headers["content-type"] ?? "").includes("application/json"))
    return reply(res, 415, { ok: false, error: "Send the enquiry as JSON." });
  if (Number(req.headers["content-length"] ?? 0) > MAX_BYTES) return reply(res, 413, { ok: false, error: "The enquiry is too long." });

  const ip = String(req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "").split(",")[0].trim();
  if (rateLimited(ip, Date.now()))
    return reply(res, 429, { ok: false, error: "Too many messages from this connection. Please try again later." }, { "Retry-After": String(RATE_WINDOW_MS / 1000) });

  let body;
  try {
    body = await readJson(req);
  } catch {
    return reply(res, 400, { ok: false, error: "The enquiry could not be read." });
  }
  if (!body || typeof body !== "object" || Array.isArray(body)) return reply(res, 400, { ok: false, error: "The enquiry could not be read." });

  // Honeypot: a hidden field people never fill. Answer as if it worked so bots learn nothing.
  if (clean(body.website)) return reply(res, 200, { ok: true });

  const lead = Object.fromEntries(FIELDS.map((k) => [k, clean(body[k], k === "details")]));
  const errors = validate(lead);
  if (!errors.details && (lead.details.match(/https?:\/\/|www\./gi)?.length ?? 0) > MAX_LINKS)
    errors.details = `Please include no more than ${MAX_LINKS} links.`;
  if (Object.keys(errors).length) return reply(res, 422, { ok: false, errors });

  const now = Date.now();
  const fingerprint = createHash("sha256").update(`${lead.email.toLowerCase()}\n${lead.details}`).digest("hex");
  for (const [k, t] of sent) if (now - t > RATE_WINDOW_MS) sent.delete(k);
  if (sent.has(fingerprint)) return reply(res, 200, { ok: true, duplicate: true });

  const { SMTP_HOST, SMTP_USER, SMTP_PASS, SMTP_FROM, CONTACT_TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO_EMAIL) {
    console.error("contact: SMTP is not configured (SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO_EMAIL)");
    return reply(res, 503, { ok: false, error: SORRY });
  }

  // To keep leads later, save `lead` (plus a received-at time) to a database here, before emailing it.
  const transport = nodemailer.createTransport(smtpOptions());
  try {
    await transport.sendMail({
      from: { name: "Codefloor IT website", address: SMTP_FROM || SMTP_USER },
      to: CONTACT_TO_EMAIL,
      replyTo: { name: lead.name, address: lead.email },
      subject: `Project enquiry: ${lead.service} from ${lead.name}`,
      text: [
        `Name: ${lead.name}`,
        `Email: ${lead.email}`,
        `Phone: ${lead.phone || "-"}`,
        `Company: ${lead.company || "-"}`,
        `Service required: ${lead.service}`,
        "",
        lead.details,
        "",
        "Sent from the contact form on codefloorit.in. Reply to this email to answer the enquiry.",
      ].join("\n"),
    });
  } catch (err) {
    // the error code only: SMTP replies can quote addresses from the message
    console.error("contact: email failed", err?.code ?? err?.name ?? "unknown", err?.responseCode ?? "");
    return reply(res, 502, { ok: false, error: SORRY });
  }

  sent.set(fingerprint, now);
  return reply(res, 200, { ok: true });
}
