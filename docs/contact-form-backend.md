# Contact form backend

`POST /api/contact` (`api/contact.js`) receives the contact form and emails each enquiry over SMTP to `CONTACT_TO_EMAIL`. It is a Vercel serverless function deployed alongside the static site, and needs no routing configuration. Self-check: `node scripts/check-contact.mjs` (fake SMTP, sends nothing). Real SMTP check: `node scripts/verify-smtp.mjs` (below).

## Security review

| Area | How it is handled | Verified by |
|---|---|---|
| Server-side validation | Every field is checked again on the server with the same rules as the form (`src/lib/contact.js`): required fields, email format, phone format, minimum message length and maximum length for every field. The browser check is never trusted. | `check-contact`: invalid email, missing fields, empty or whitespace-only message, over-long field |
| Input sanitising | Control characters are removed. Line breaks are kept only in the message, so the name and service cannot inject email headers. The email is plain text, so HTML in a message is never rendered. | `check-contact`: header injection |
| Request checks | POST only (405), JSON only (415), at most 20 KB (413), malformed JSON (400), and a cross-site browser POST is rejected (403) | `check-contact` |
| Spam | Hidden honeypot field (a filled one gets a 200 response but no email), more than 5 links in the message is rejected, plus the rate limit and duplicate check below | `check-contact`, browser test |
| Error handling | Visitors get a generic message. Logs record only an error code (for example `EAUTH`), because SMTP replies can quote addresses. No response repeats what the visitor typed. | `check-contact`: SMTP failure, SMTP not configured |
| Credentials | `SMTP_*` live only in Vercel's environment variables and are read only by the function. They have no `VITE_` prefix, so Vite cannot bundle them, and `vite.config.js` does not change the prefix. | A search of the built `dist/` finds no `SMTP_`, `nodemailer`, `process.env` or `CONTACT_TO_EMAIL`, and `api/` is not copied there |
| Transport security | Settings live in `api/_smtp.js`, shared with the verify script. Port 465 uses TLS from the start. Any other port must upgrade with STARTTLS (`requireTLS`), so credentials never cross the network unencrypted. Timeouts stop a stuck SMTP server from hanging the function. | `check-contact`: unreachable server returns 502 |
| Analytics | `generate_lead` fires only on a 200 `{ ok: true }` response that is not a duplicate. `form_submit` carries only `form_name`, `service_name` and `submit_method`. | Browser test, desktop and mobile |

### Limits of the rate limit and duplicate check on Vercel

Both are kept **in memory inside one function instance**:

- Vercel runs several instances at once and starts new ones when it needs to, so a determined sender spread across instances can exceed **5 requests per IP per 10 minutes**.
- An instance can be recycled at any time, which resets both counters early.
- The duplicate check (same email and message within 10 minutes) is also per instance, so the same enquiry handled by two instances can be emailed twice.

This is acceptable for a small business site's traffic. It is a first line of defence, not a guarantee.

### Improving them with shared storage (future)

When spam gets past these checks, or leads should be kept outside the inbox, add one shared store and use it for:

1. **Rate limit:** a counter per IP with a 10-minute expiry, incremented atomically (for example Redis `INCR` plus `EXPIRE`). This holds across every instance.
2. **Duplicate check:** store the existing SHA-256 fingerprint with a 10-minute expiry, set only when absent (Redis `SET NX EX`). A second instance then sees the first one's send.
3. **Lead storage:** `api/contact.js` marks where to save the lead, before the email is sent. Saving it first means an SMTP outage loses no enquiries; a retry job can send the email later.

Candidates that work from Vercel functions: Upstash Redis (from the Vercel Marketplace) for 1 and 2, and a Postgres or similar database for 3. Before storing leads, decide and publish a retention period. The privacy policy currently makes no specific retention promise.

Other improvements to consider: a CAPTCHA such as Cloudflare Turnstile, if bots get past the honeypot (it would need security-policy changes), and alerting on repeated `email failed` log lines.

## SMTP configuration on Vercel (GoDaddy Professional Email)

codefloorit.in's email is hosted by **GoDaddy Professional Email** (sold by GoDaddy as "Professional Email powered by Titan"). The contact form sends through GoDaddy's SMTP server, logged in as `info@codefloorit.in`, to `info@codefloorit.in`.

GoDaddy's settings for websites and plugins ([GoDaddy Help](https://www.godaddy.com/help/set-up-third-party-plugins-or-websites-using-smtp-settings-42788)): server `smtpout.secureserver.net`, port `465` with SSL/TLS, authentication with the full email address and the mailbox password.

Do not use `smtp.titan.email` for this mailbox. GoDaddy documents only `smtpout.secureserver.net` for its accounts, and mail sent from Titan's own servers is not covered by this domain's SPF or DKIM, so DMARC (`p=reject`) would have it rejected.

### DNS: no changes needed

The domain's existing records already authorise GoDaddy's servers, so contact-form email passes SPF, DKIM and DMARC as they stand. As checked in November 2026 (do not change these for the contact form):

| Record | Value |
|---|---|
| MX | `0 smtp.secureserver.net`, `10 mailstore1.secureserver.net` |
| SPF (TXT on `@`) | `v=spf1 include:secureserver.net -all` (the only SPF record; keep it that way) |
| DKIM | `secureserver1._domainkey` CNAME `s1.dkim.codefloorit_in.d6e.onsecureserver.net`, `secureserver2._domainkey` CNAME `s2.dkim.codefloorit_in.d6e.onsecureserver.net` |
| DMARC (TXT on `_dmarc`) | `v=DMARC1; p=reject; rua=mailto:dmarc_rua@onsecureserver.net; adkim=r; aspf=r;` |

Adding another provider's SPF include is not a safe shortcut: `include:secureserver.net` already uses 6 of SPF's 10 DNS lookups, and adding Titan's would take it to 14, which breaks SPF for all of the domain's mail.

### Variables

Vercel → the `codefloorit.in` project → **Settings → Environment Variables**. Add each one for **Production** and **Preview**, and mark `SMTP_PASS` as **Sensitive** so it can never be read back.

| Name | Value |
|---|---|
| `SMTP_HOST` | `smtpout.secureserver.net` |
| `SMTP_PORT` | `465`: SSL/TLS from the start (`api/_smtp.js` sets `secure: true` for this port) |
| `SMTP_USER` | `info@codefloorit.in` |
| `SMTP_PASS` | the info@codefloorit.in mailbox password, as a Sensitive variable: never in the repo, a `.env` file that is committed, or front-end code |
| `CONTACT_TO_EMAIL` | `info@codefloorit.in` |
| `SMTP_FROM` | leave unset: the From address is then `SMTP_USER`, the logged-in mailbox, which keeps DMARC aligned |

Do **not** set `VITE_CONTACT_ENDPOINT`. Unset, the form posts to `/api/contact`; set to an empty value, it switches the form back to WhatsApp-only.

### Check the settings before deploying

`scripts/verify-smtp.mjs` uses the same settings code as the live endpoint (`api/_smtp.js`). It prints the server, the login name and whether a password is set, never the password itself, and on failure only an error code with a hint.

In PowerShell, on your own machine (the password is typed hidden and never saved to a file or the shell history):

```powershell
$env:SMTP_HOST = "smtpout.secureserver.net"; $env:SMTP_PORT = "465"
$env:SMTP_USER = "info@codefloorit.in"; $env:CONTACT_TO_EMAIL = "info@codefloorit.in"
$p = Read-Host "Password for info@codefloorit.in" -AsSecureString
$env:SMTP_PASS = [Runtime.InteropServices.Marshal]::PtrToStringBSTR([Runtime.InteropServices.Marshal]::SecureStringToBSTR($p))
node scripts/verify-smtp.mjs          # connect over SSL/TLS + log in, sends nothing
node scripts/verify-smtp.mjs --send   # also sends one test email to CONTACT_TO_EMAIL
Remove-Item Env:SMTP_PASS; Remove-Variable p
```

| Result | Meaning |
|---|---|
| `OK: connected over TLS and logged in` | Host, port and password are right |
| `FAILED: EAUTH` | Login refused: check the password. If it is right, check the mailbox in GoDaddy's Email & Office dashboard, or ask GoDaddy support whether SMTP sending is enabled for it |
| `FAILED: ETIMEDOUT` / `ESOCKET` / `EDNS` | Host or port wrong, or the network blocks outbound port 465 |
| `--send` OK, but no email arrives | Check spam, then the received message's headers (below) |

In the test email, open the full headers ("Show original" or similar). `Authentication-Results` should show `spf=pass`, `dkim=pass` (with `header.d=codefloorit.in`) and `dmarc=pass`.

### Rollout check

1. Run `verify-smtp.mjs --send` and confirm the test email lands in the inbox with SPF, DKIM and DMARC passing.
2. Add the variables in Vercel, then deploy a **preview** (variables apply only to deployments made after they are added).
3. On the preview URL, send a real enquiry. It should arrive at info@codefloorit.in with the visitor's address as Reply-To.
4. In Vercel → the deployment → **Functions / Logs**, there should be no `contact:` error lines. `EAUTH` and the others mean the same as in the table above. `SMTP is not configured` means a variable is missing in that environment.
5. Then deploy to production and repeat step 3 once.
