# Codefloor IT — codefloorit.in

Project root: `D:\CF\Codes\Website code\codefloorit.in`

When calling the claude-code MCP tool, always pass absolute paths under this project root — the tool's working directory is Antigravity's install folder, not this project.

## Stack

React 19 + Vite + React Router, plain CSS, prerendered to static HTML at build time, deployed on Vercel. See `README.md` for details.

## Commands

```bash
npm run build     # client + SSR build + prerender (dist/*.html, sitemap.xml, llms.txt)
npm run check     # verifies dist: links, titles, canonicals, one <h1>, no removed services
npm run lint      # oxlint
```

## Rules

- Canonical host is `https://codefloorit.in` (non-www). www 301-redirects to it in Vercel Domains settings. Never emit www URLs.
- Every route in `src/entry-server.jsx` `routes` is prerendered and listed in `sitemap.xml`; add pages through `src/data/` so this stays automatic.
- Do not add services without approval. Projects must be real; keep `status` honest.
- Preserve branding and existing URLs. Run `npm run build && npm run check` before calling work done.
