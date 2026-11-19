/* Checks the contact form's SMTP settings without printing the password.
     node scripts/verify-smtp.mjs          connect over TLS and log in (connect only, if SMTP_PASS is unset)
     node scripts/verify-smtp.mjs --send   also send one test email from SMTP_FROM/SMTP_USER to CONTACT_TO_EMAIL
   Reads the same environment variables as api/contact.js (see docs/contact-form-backend.md). */
import nodemailer from "nodemailer";
import { smtpOptions } from "../api/_smtp.js";

const env = process.env;
const opts = smtpOptions(env);
if (!opts) {
  console.error("SMTP_HOST is not set. Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_TO_EMAIL first.");
  process.exit(1);
}
console.log(`server:   ${opts.host}:${opts.port} (${opts.secure ? "TLS from the start" : "STARTTLS required"})`);
console.log(`login:    ${env.SMTP_USER || "(SMTP_USER not set)"}, password ${env.SMTP_PASS ? "set" : "NOT set: checking the connection only"}`);

const HINTS = {
  EAUTH: "Login refused. Check the username and password, that third-party app access is enabled for the mailbox, and that two-factor authentication is not blocking it.",
  ECONNECTION: "Could not connect. Check SMTP_HOST and SMTP_PORT.",
  ETIMEDOUT: "Timed out. Check SMTP_HOST and SMTP_PORT, or a firewall blocking outbound port " + opts.port + ".",
  ESOCKET: "Connection or TLS failed. Check SMTP_HOST and SMTP_PORT (465 = TLS, 587 = STARTTLS).",
  EDNS: "The host name does not resolve. Check SMTP_HOST.",
  EENVELOPE: "The server refused the sender or recipient. With Titan the From address must be the logged-in mailbox.",
  EMESSAGE: "The server refused the message.",
};
const fail = (err) => {
  // the code only: server replies can quote addresses, and nothing here may echo a credential
  console.error(`FAILED:   ${err?.code ?? "unknown"}${err?.responseCode ? ` (SMTP ${err.responseCode})` : ""}`);
  console.error(`          ${HINTS[err?.code] ?? "See docs/contact-form-backend.md."}`);
  process.exit(1);
};

const transport = nodemailer.createTransport(opts);
try {
  await transport.verify();
} catch (err) {
  fail(err);
}
console.log(opts.auth ? "OK:       connected over TLS and logged in" : "OK:       server reachable over TLS (login not tested)");

if (process.argv.includes("--send")) {
  if (!opts.auth || !env.CONTACT_TO_EMAIL) fail({ code: "missing SMTP_USER, SMTP_PASS or CONTACT_TO_EMAIL" });
  try {
    await transport.sendMail({
      from: { name: "Codefloor IT website", address: env.SMTP_FROM || env.SMTP_USER },
      to: env.CONTACT_TO_EMAIL,
      subject: "Contact form SMTP test",
      text: "This is a test from scripts/verify-smtp.mjs. If it arrived in the inbox (not spam), the contact form's email settings work.",
    });
  } catch (err) {
    fail(err);
  }
  console.log(`OK:       test email accepted for ${env.CONTACT_TO_EMAIL}. Check it arrives in the inbox, not spam or quarantine.`);
}
