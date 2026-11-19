/* Self-check for api/contact.js: runs the handler with fake requests and a fake SMTP transport.
   Run: node scripts/check-contact.mjs   (no network, no real email is sent) */
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import nodemailer from "nodemailer";
import handler from "../api/contact.js";

const realCreateTransport = nodemailer.createTransport;
const outbox = [];
let smtp = "ok"; // ok | fail
nodemailer.createTransport = () => ({
  sendMail: async (msg) => {
    if (smtp === "fail") throw Object.assign(new Error("535 auth failed for user@secret.example"), { code: "EAUTH", responseCode: 535 });
    outbox.push(msg);
  },
});
Object.assign(process.env, { SMTP_HOST: "smtp.test", SMTP_PORT: "587", SMTP_USER: "site@test", SMTP_PASS: "x", CONTACT_TO_EMAIL: "info@codefloorit.in" });

let ipN = 0;
async function call({ method = "POST", body, raw, headers = {}, ip = `10.0.0.${++ipN}`, vercelBody } = {}) {
  const text = raw ?? (body === undefined ? "" : JSON.stringify(body));
  const req = Readable.from([text]);
  Object.assign(req, {
    method,
    headers: { host: "codefloorit.in", origin: "https://codefloorit.in", "content-type": "application/json", "content-length": String(Buffer.byteLength(text)), "x-forwarded-for": ip, ...headers },
  });
  if (vercelBody !== undefined) req.body = vercelBody; // Vercel pre-parses JSON bodies
  const res = { statusCode: 0, headers: {}, setHeader(k, v) { this.headers[k.toLowerCase()] = v; }, end(s) { this.body = JSON.parse(s); } };
  await handler(req, res);
  return res;
}

const valid = { name: "Asha Patel", email: "asha@example.com", phone: "+91 98765 43210", company: "Patel Traders", service: "E-commerce Development", details: "We want an online store for about 200 products." };
const mails = () => outbox.length;
const results = [];
async function check(name, fn) {
  await fn();
  results.push(name);
}

await check("GET is rejected with 405 and Allow: POST", async () => {
  const r = await call({ method: "GET" });
  assert.equal(r.statusCode, 405);
  assert.equal(r.headers.allow, "POST");
});
await check("a cross-origin browser POST is rejected (403)", async () => {
  assert.equal((await call({ body: valid, headers: { origin: "https://evil.example" } })).statusCode, 403);
});
await check("non-JSON is rejected (415)", async () => {
  assert.equal((await call({ raw: "name=a", headers: { "content-type": "application/x-www-form-urlencoded" } })).statusCode, 415);
});
await check("an oversized body is rejected (413)", async () => {
  assert.equal((await call({ body: { ...valid, details: "x".repeat(30_000) } })).statusCode, 413);
});
await check("malformed JSON is rejected (400)", async () => {
  assert.equal((await call({ raw: "{not json" })).statusCode, 400);
});
await check("invalid email: 422 with an email error, nothing sent", async () => {
  const before = mails();
  const r = await call({ body: { ...valid, email: "asha@example" } });
  assert.equal(r.statusCode, 422);
  assert.ok(r.body.errors.email);
  assert.equal(mails(), before);
});
await check("missing required fields: 422 naming each one", async () => {
  const r = await call({ body: {} });
  assert.equal(r.statusCode, 422);
  assert.deepEqual(Object.keys(r.body.errors).sort(), ["details", "email", "name", "service"]);
});
await check("empty or whitespace-only message: 422 on details", async () => {
  const r = await call({ body: { ...valid, details: "   \n\t  " } });
  assert.equal(r.statusCode, 422);
  assert.ok(r.body.errors.details);
});
await check("over-long field: 422", async () => {
  assert.ok((await call({ body: { ...valid, name: "A".repeat(150) } })).body.errors.name);
});
await check("honeypot filled: 200 so bots learn nothing, but no email", async () => {
  const before = mails();
  const r = await call({ body: { ...valid, website: "http://spam.example" } });
  assert.equal(r.statusCode, 200);
  assert.equal(mails(), before);
});
await check("link spam: 422 on details", async () => {
  const links = Array.from({ length: 6 }, (_, i) => `https://spam${i}.example`).join(" ");
  const r = await call({ body: { ...valid, details: `Buy now ${links}` } });
  assert.equal(r.statusCode, 422);
  assert.match(r.body.errors.details, /links/);
});
await check("valid enquiry: 200, one plain-text email to CONTACT_TO_EMAIL with reply-to the visitor", async () => {
  const before = mails();
  const r = await call({ body: valid });
  assert.equal(r.statusCode, 200);
  assert.deepEqual(r.body, { ok: true });
  assert.equal(mails(), before + 1);
  const m = outbox.at(-1);
  assert.equal(m.to, "info@codefloorit.in");
  assert.equal(m.replyTo.address, "asha@example.com");
  assert.equal(m.html, undefined);
  assert.match(m.text, /Patel Traders/);
});
await check("Vercel's pre-parsed req.body is accepted too", async () => {
  assert.equal((await call({ body: valid, vercelBody: { ...valid, details: valid.details + " Second store." } })).statusCode, 200);
});
await check("the same enquiry again: 200 duplicate, not emailed twice", async () => {
  const before = mails();
  const r = await call({ body: valid });
  assert.deepEqual(r.body, { ok: true, duplicate: true });
  assert.equal(mails(), before);
});
await check("header injection: CR/LF and control characters are stripped from single-line fields", async () => {
  await call({ body: { ...valid, name: "Eve\r\nBcc: victim@example.com", details: "Hello\u0000 there, this is a real enquiry.\r\nSecond line." } });
  const m = outbox.at(-1);
  assert.doesNotMatch(m.subject, /[\r\n]/);
  assert.doesNotMatch(m.replyTo.name, /[\r\n]/);
  assert.match(m.text, /Hello there, this is a real enquiry\.\nSecond line\./);
});
await check("SMTP failure: 502 with a generic message that leaks nothing", async () => {
  smtp = "fail";
  const r = await call({ body: { ...valid, details: valid.details + " (smtp test)" } });
  smtp = "ok";
  assert.equal(r.statusCode, 502);
  assert.doesNotMatch(JSON.stringify(r.body), /535|EAUTH|secret|smtp\.test/i);
});
await check("a failed send is not remembered: the retry is emailed", async () => {
  const before = mails();
  assert.equal((await call({ body: { ...valid, details: valid.details + " (smtp test)" } })).statusCode, 200);
  assert.equal(mails(), before + 1);
});
await check("SMTP not configured: 503, generic message", async () => {
  const pass = process.env.SMTP_PASS;
  delete process.env.SMTP_PASS;
  const r = await call({ body: { ...valid, details: valid.details + " (no config)" } });
  process.env.SMTP_PASS = pass;
  assert.equal(r.statusCode, 503);
  assert.doesNotMatch(JSON.stringify(r.body), /SMTP/);
});
await check("rate limit: the 6th request from one IP within 10 minutes gets 429 with Retry-After", async () => {
  const codes = [];
  for (let i = 0; i < 6; i++) codes.push((await call({ ip: "203.0.113.9", body: { ...valid, details: `${valid.details} #${i}` } })).statusCode);
  assert.deepEqual(codes, [200, 200, 200, 200, 200, 429]);
  assert.ok((await call({ ip: "203.0.113.9", body: valid })).headers["retry-after"]);
});
await check("no response ever echoes the visitor's details", async () => {
  const r = await call({ body: { ...valid, email: "bad-address" } });
  assert.doesNotMatch(JSON.stringify(r.body), /bad-address|Asha|98765/);
});
await check("real nodemailer, SMTP server unreachable: 502 within the timeout", async () => {
  nodemailer.createTransport = realCreateTransport;
  Object.assign(process.env, { SMTP_HOST: "127.0.0.1", SMTP_PORT: "1" });
  const r = await call({ body: { ...valid, details: valid.details + " (unreachable)" } });
  assert.equal(r.statusCode, 502);
});

console.log(results.map((n) => `ok  ${n}`).join("\n"));
console.log(`\ncheck-contact: ${results.length} checks passed`);
