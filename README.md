# Codefloor IT — codefloorit.in

React 19 + Vite + React Router. Plain CSS (tokens in `src/styles/index.css`), Lucide icons,
no animation library. Every route is prerendered to static HTML at build time and hydrated.

```bash
npm install
npm run dev       # dev server
npm run build     # client build + SSR build + prerender (dist/*.html, sitemap.xml, llms.txt)
npm run check     # verifies dist: links, titles, canonicals, one <h1>, no removed services
npm run lint      # oxlint
npm run preview   # serve dist/
```

## Motion and scenes

No animation library. `src/lib/motion.js` runs one shared scroll loop that writes a
progress value (`--p`) to registered elements; the stylesheet turns it into movement.
Pinned scenes (home hero, portfolio) are `position: sticky` inside a tall wrapper, enabled
only on desktop-sized, tall-enough viewports without reduced motion (see "Scenes" in
`src/styles/index.css`); everywhere else they are ordinary sections.

Smooth scrolling is [Lenis](https://github.com/darkroomengineering/lenis), loaded only for a mouse or
trackpad without reduced motion (touch keeps native scrolling). It moves the real window scroll,
so sticky scenes and observers are unaffected. Scroll programmatically with `scrollToTarget()`
from `lib/motion.js`, not `window.scrollTo`, or the two will fight; tune the feel with `lerp` and
`wheelMultiplier` in `initSmoothScroll()`.

The brand intro plays on every full load of the homepage (not on in-app navigation), never with
reduced motion. `scripts/prerender.mjs` writes its markup into the prerendered homepage, so it paints
with the first frame without a render-blocking script; its 2.5s timeline is CSS ("Intro" in
`src/styles/index.css`). `public/intro.js` (async) only lets any key, click, wheel or touch skip it and
removes it afterwards. In `npm run dev` there is no intro (the dev server does not prerender).

The robot (`components/Robot.jsx`) is an SVG with CSS poses. Sections choose its pose with
`data-robot="idle|point|explore|think|greet"`. The robot is named Sukaram. Everything he
knows and says lives in `src/data/sukaram.js` (greeting, suggested questions, answers,
keyword matching for typed questions, section tips); `components/Assistant.jsx` and
`AssistantPanel.jsx` only render it. He is a scripted guide, not an AI model, and says so
in the panel header — to add real AI, replace `respond()` in that file with a call to your
own backend. Once per browsing session, as soon as the hero stage and its speech bubble are on
screen, the hero robot (`components/HeroVisual.jsx`) plays the `INTRO` sequence from that file
(`sessionStorage` key `sukaram-intro-seen`; open a new tab to see it again). Tapping his face,
belly, antenna or hands plays a reaction; tapping the rest of him or "Click on Me!" replays the
introduction. The hero robot never opens the chat: only the floating button does.
Sections can offer a one-line tip
with `data-robot-hint="services|work|process|contact"`. Run `node scripts/check-sukaram.mjs`
after editing his answers.

3D scenes (`components/three/scene.js`, mounted by `Scene3D.jsx`) use three.js with models built
from primitives - no model files. The three.js chunk (~136 KB gzipped) is downloaded only on
desktop screens with a mouse, without reduced motion or data saver, when a canvas nears the viewport,
and only with GPU acceleration: no WebGPU adapter (checked asynchronously) or a software WebGL renderer
(SwiftShader, Microsoft Basic Render) leaves the canvas empty, as on phones. Scene setup yields to the
browser between steps so it is several short tasks, not one long one.

## Loading performance

`scripts/prerender.mjs` inlines the stylesheet into every page (no render-blocking CSS request) and
replaces Vite's entry `<script type="module">` and modulepreloads with a small generated
`/assets/boot-<hash>.js` that adds them just after the first paint, so the JavaScript does not compete
with the HTML and fonts on a slow connection. Hydration runs inside `startTransition`, so it yields
instead of blocking. `public/gtm-loader.js` fetches Google Tag Manager only after the page has loaded
and the browser is idle; events pushed before that wait in `dataLayer`. On touch screens the hero's
letter and word entrances drop their blur filter (it cannot run on the compositor).

## Content lives in `src/data/`

- `services.js` — the eight services offered (UI/UX Design and IT Consulting approved 2026-11-24). **Do not add services without approval.**
- `site.js` also holds `PACKAGES` (published website prices) and `TEAM` (About page); `testimonials.js` holds client quotes (section hidden while empty, publish only with written permission).
- `solutions.js` — use-case categories (what can be built; not client claims).
- `projects.js` — real projects only. Keep `status` honest (`Completed` / `In Development`).
- `insights.js` — articles. `tech.js` — technology list. `site.js` — contact, nav, process, FAQ.

Adding a service, project or article automatically adds its page, sitemap entry and links.

## Contact form

The form POSTs JSON (`name, email, phone, company, service, details`) to `/api/contact`
(`api/contact.js`, a Vercel serverless function), which checks it again with the same rules
(`src/lib/contact.js`), applies spam protection and rate limiting, and emails it over SMTP to
`CONTACT_TO_EMAIL`. The SMTP variables live only in Vercel (see `.env.example`). The form shows
success only when the function confirms the email was sent; on failure it offers WhatsApp and email.
Setting `VITE_CONTACT_ENDPOINT` to an empty value switches the form back to opening WhatsApp
with the message filled in. Security notes and the SMTP setup for Vercel are in
`docs/contact-form-backend.md`.

## Deployment

Static output in `dist/`. `vercel.json` enables clean URLs (`/services` -> `services.html`);
unknown URLs get `404.html`. The canonical host is `https://codefloorit.in` because Vercel
serves the bare domain and 301-redirects www to it (Vercel Domains settings). If that changes, update `SITE_URL` in
`src/lib/seo.js`, `index.html`, `public/robots.txt` and `scripts/check-dist.mjs`.
`docs/codefloorit-com-redirects.json` is a page-to-page redirect map for the separate
codefloorit.com Vercel project; it does nothing in this repo.

Project visuals are illustrative CSS mockups (labelled as such). Replace `Mockup` in
`src/components/cards.jsx` with real screenshots when available.
