# codefloorit.in — website, SEO and conversion pass (2026-11-24)

Branch `fix/gtm-preview-connection` (uncommitted). Not deployed.

## 1. Initial audit

The site was already in good shape. Most of the brief existed before this pass, so the work was gap-filling, not a rebuild.

| Area | Found | Severity | Business impact | Action / files |
|---|---|---|---|---|
| Hero | Already had the suggested headline "Websites & Software That Grow Your Business". CTAs read "Discuss Your Project / See Our Work"; no WhatsApp option. | Low | Weaker quote intent | CTAs now "Get a Free Quote / Explore Our Work" plus a WhatsApp link — `src/pages/Home.jsx` |
| Services | 6 services. UI/UX and IT Consulting are sold but had no pages. | Medium | Missed enquiries and keywords | Added both — `src/data/services.js`, `ServiceGlyph.jsx`, `index.html` JSON-LD |
| Pricing | No pricing; copy said "We do not publish fixed prices". | Medium | Price-sensitive visitors leave | Confirmed packages (GST incl., page ranges, payment terms) published — `PricingSection` on Home and /services; FAQ, cost article and Sukaram updated; unconfirmed fields hidden |
| Conversion CTAs | Contact section before the footer only. | Low | — | CTA band after Selected Work ("Get a Free Consultation"); Pricing after Why Codefloor |
| Trust | No founder or company details; no testimonials. | Medium | Lower trust | Founder profile and verified company details on /about; testimonials component (hidden until real ones exist) |
| Project labels | LeadHunter (in-house) and the Oracle/Aranya demos looked like client work. | Medium | Honesty | `origin` label ("In-house product" / "Demo project") on cards, case studies and Solutions; copy made neutral |
| Contact form | No budget field; no privacy notice beside the form. Backend, validation, honeypot, rate limit, loading/success/error states already existed and are honest. | Low | Lead qualification | Optional budget (validated client and server side), privacy notice; privacy policy updated |
| Analytics | GA4 via GTM already tracks `click_whatsapp`, `click_phone`, `click_email`, `cta_click`, `form_submit`, `generate_lead`, `service_view`, `portfolio_view`. | — | — | No change (see §10) |
| Technical SEO | Unique titles, descriptions, canonicals, OG/Twitter, one H1, JSON-LD (Organization, Service, Breadcrumb, FAQPage, Article, ItemList), sitemap, robots, llms.txt — all present and checked by `npm run check`. | — | — | Added Person (founder) schema; local "Company" titles |
| Accessibility | Animated headings already duplicate text as `sr-only` + `aria-hidden`; focus outlines; reduced motion respected. | — | — | Lighthouse a11y 100 |
| Performance | Mobile Lighthouse 34–45 **before** this pass; TBT ~1.6 s from the animation/3D stack. | High (pre-existing) | Mobile bounce | Not fixed here — see §11. Kept page weight flat (the ₹ glyph would have added ~100 KB of font; fixed). |

## 2. Modified files

`api/contact.js`, `index.html`, `README.md`, `scripts/check-contact.mjs`, `scripts/check-sukaram.mjs`, `src/components/{ContactForm,ServiceGlyph,cards,editorial,scenes,sections,ui}.jsx`, `src/data/{insights,projects,services,site,sukaram}.js`, `src/lib/contact.js`, `src/pages/{About,Home,Legal,ProjectDetail,Services}.jsx`, `src/styles/index.css`.

## 3. New components / data

- `PricingSection`, `Testimonials` (`src/components/sections.jsx`); `CtaBand` gained a `cta` label prop.
- `src/data/testimonials.js` (empty), `PACKAGES` and `TEAM` in `src/data/site.js`.

## 4. New pages (all prerendered, in sitemap)

- `/services/ui-ux-design`, `/services/it-consulting`
- `/insights/website-maintenance-security`, `/insights/ecommerce-website-benefits-india` (with OG images in `public/og/`)

37 → 41 pages.

## 5–6. Local SEO and keyword → page mapping

No duplicate city-swapped pages were created. Each target phrase maps to one existing or new page, so pages do not compete with each other:

| Target query | Page | Title |
|---|---|---|
| web development company in Ahmedabad | `/` | Web Development Company in Ahmedabad |
| website development company in Ahmedabad | `/services/business-website-development` | Website Development Company in Ahmedabad |
| software development company in Ahmedabad | `/services/custom-software-development` | Custom Software Development Company in Ahmedabad |
| custom web application development Ahmedabad | `/services/web-application-development` | Custom Web Application Development in Ahmedabad |
| e-commerce development Ahmedabad | `/services/ecommerce-development` | E-commerce Website Development in Ahmedabad |
| UI/UX design Ahmedabad | `/services/ui-ux-design` | UI/UX Design Services in Ahmedabad |
| IT consulting Ahmedabad | `/services/it-consulting` | IT Consulting for Businesses in Ahmedabad |
| website development Gujarat | covered by the pages above (each has a Gujarat/India section) | — |

**Skipped:** a separate "Website Development Services in Gujarat" page. It would duplicate the website-development page with the city swapped, which the brief rules out. Build it only if there is Gujarat-specific content, such as projects or clients in other Gujarat cities.

## 7. International SEO

- One English site at one URL set, so **hreflang does not apply** (it is for alternate language/region versions).
- Added an FAQ for clients outside India: remote delivery, INR prices, international projects quoted individually. The About page notes international clients.
- No country pages: there is no country-specific service, case study or delivery difference yet. Add one only when there is (e.g. a real UAE client case study).

## 8. Schema

Organization + ProfessionalService (site-wide, `index.html`: now 8 services, `founder`), WebSite, Service + FAQPage + BreadcrumbList (service pages), Article + FAQPage (articles), CreativeWork (projects), Person (About), ItemList, CollectionPage/AboutPage/ContactPage. No ratings, reviews, opening hours or street address — none are verified. LocalBusiness subtype is `ProfessionalService` with city-level address only.

Note: Google now shows FAQ rich results only for authoritative government/health sites. The FAQPage markup is valid and harmless, but do not expect FAQ snippets.

## 9. Performance comparison (Lighthouse 12, mobile emulation, local `vite preview`, this laptop)

| | Before (HEAD) | After |
|---|---|---|
| Home performance | 34–45 | 37–70 (noisy) |
| Home LCP | 4.2–6.1 s | 4.3–6.0 s |
| Home TBT | ~1.6 s | 0.3–2.4 s |
| Home transfer | 387 KB | 395 KB |
| Accessibility / Best practices / SEO | — | 100 / 100 / 100 (home, /services/ui-ux-design, /contact) |
| Contact performance | — | 72 |

Local runs on a busy laptop vary ±20 points. Re-measure on PageSpeed Insights after deploy. The performance targets (90+, LCP ≤ 2.5 s) are **not met**, and they were not met before this pass either.

## 10. Conversion tracking

Events already flow dataLayer → GTM → GA4 (`src/lib/track.js`, GTM container in `docs/gtm-ga4-import.json`). The event names differ from the brief; they were **not renamed**, because renaming would break the live GTM tags and the GA4 history.

| Brief name | Live event | Fired when |
|---|---|---|
| generate_lead | `generate_lead` | the server confirms the email was sent (not on duplicates) |
| form_submit | `form_submit` | successful submit (`submit_method`: endpoint/whatsapp) |
| whatsapp_click | `click_whatsapp` | any wa.me link (`link_location`) |
| phone_click | `click_phone` | any tel: link |
| email_click | `click_email` | any mailto: link |
| quote_request | `cta_click` with `cta_text` "Get a Free Quote" / "Request a Custom Quote" | quote buttons in the hero and Pricing |
| project_view | `portfolio_view` | a case-study page opens |

**In GA4:** mark `generate_lead` as a key event (conversion). Optionally mark `click_whatsapp` and `click_phone` as secondary key events. No personal data is sent; the budget is not sent to analytics.

**Search Console:** verify with a DNS TXT record at the domain registrar (works for the whole domain and needs no code change). No verification tag was added.

## 11. Remaining issues / needs your input

Confirmed 2026-11-24 and now on the site: package prices (GST included), page ranges (Starter 5–10, Business 10–15), payment terms (50 / 30 / 20), Oracle Legal Consultancy and Aranya Palace labelled "Demo project", no testimonials.

1. **Still to confirm:** delivery timelines, support/warranty duration, and per-package feature lists. They are configurable `null` fields in `PACKAGES` (`src/data/site.js`) and are hidden until filled in.
2. **Testimonials:** none published. Add real ones with written permission to `src/data/testimonials.js`; the section appears automatically.
3. **Founder photo:** optional; add `photo` to `TEAM`.
4. **Mobile performance:** the main cost is the animation stack (three.js scenes, GSAP, Lenis, anime.js, intro). The biggest win would be cutting main-thread JS during load on phones. That is a separate piece of work that affects the design.
5. **Antigravity review** could not run headless without `--dangerously-skip-permissions`, which was not used.

## 12. Deployment

```bash
npm run build && npm run check && npm run lint
node scripts/check-contact.mjs && node scripts/check-sukaram.mjs
```

All pass. Commit, push the branch, open a PR, check the Vercel preview (noindex on *.vercel.app), then merge to deploy. No new environment variables are needed.

## 13. Content roadmap (Insights)

| Topic | Status | Target keyword | Intent | Links to |
|---|---|---|---|---|
| Website development cost in India | exists (`business-website-cost-india`, now with package prices) | website development cost India | commercial | pricing, business website service |
| Business website cost in Ahmedabad | **covered by the above**; a separate article would duplicate it | — | — | — |
| Custom vs ready-made software | exists | custom vs off the shelf software | informational | custom software, IT consulting |
| E-commerce for Indian businesses | **new** (`ecommerce-website-benefits-india`) | e-commerce website benefits India | informational | e-commerce service |
| How to choose a development company | exists (`choose-software-company`) | how to choose software development company | commercial | IT consulting, contact |
| Why businesses need custom web apps | exists (`when-to-build-custom-software`, `website-vs-web-application`) | custom web application benefits | informational | web app service |
| Website maintenance and security | **new** (`website-maintenance-security`) | website maintenance services | commercial | maintenance service |
| Business automation for small companies | **next to write.** Outline: what to automate first (repeated data entry, follow-ups, approvals), spreadsheet → system, cost/benefit, when not to automate. Frame it under Custom Software, since automation is not a listed service. | business process automation small business | informational | custom software, LeadHunter case study |

## 14. Future recommendations

- Google Business Profile with the verified address, and real reviews there (they matter more for local search than anything on-page).
- One detailed case study per new service once a real UI/UX or consulting project exists.
- Mobile performance work (§11.6).
- Write the business automation article.
