/* Runs after the client and SSR builds: renders every route to static HTML with
   its own <head> tags (so content is crawlable without JavaScript) and writes sitemap.xml
   and llms.txt (a plain-text index of the same pages, from the same titles and descriptions). */
import { mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const dist = (p) => resolve(root, "dist", p);
const { render, routes, SITE_URL } = await import(pathToFileURL(resolve(root, "dist-ssr/entry-server.js")));

// preload the two latin fonts: otherwise they are found only after the CSS is parsed, and text repaints late
const fonts = readdirSync(dist("assets")).filter((f) => /^(inter|space-grotesk)-latin-wght-normal-.*\.woff2$/.test(f));

/* BOOT: the pages are complete prerendered HTML, so the JavaScript only adds interactivity. It
   starts downloading just after the first paint instead of with the HTML: on a phone network the
   ~170 KB of modules otherwise compete with the page and its fonts for bandwidth and delay the first
   paint. A tiny deferred file (the CSP blocks inline scripts) adds the entry module and its preloads
   once the parser is done and a frame has been painted. */
const viteHtml = readFileSync(dist("index.html"), "utf8");
const entry = viteHtml.match(/<script type="module" crossorigin src="([^"]+)"><\/script>/)[1];
const preloads = [...viteHtml.matchAll(/<link rel="modulepreload" crossorigin href="([^"]+)">/g)].map((m) => m[1]);
const boot = `(function(){var go=function(){if(go.done)return;go.done=1;var h=document.head;${JSON.stringify(preloads)}.forEach(function(u){var l=document.createElement("link");l.rel="modulepreload";l.crossOrigin="";l.href=u;h.appendChild(l)});var s=document.createElement("script");s.type="module";s.crossOrigin="";s.src=${JSON.stringify(entry)};h.appendChild(s)};if(document.visibilityState==="hidden")go();else{requestAnimationFrame(function(){setTimeout(go,0)});setTimeout(go,1500)}})();
`;
const bootFile = `boot-${createHash("sha256").update(boot).digest("hex").slice(0, 8)}.js`;
writeFileSync(dist(`assets/${bootFile}`), boot);
const template = readFileSync(dist("index.html"), "utf8")
  .replace(
    "</head>",
    () => fonts.map((f) => `  <link rel="preload" href="/assets/${f}" as="font" type="font/woff2" crossorigin />\n`).join("") + "  </head>"
  )
  // the app's JavaScript starts loading after the first paint (see BOOT below)
  .replace(/\s*<script type="module" crossorigin src="[^"]+"><\/script>|\s*<link rel="modulepreload" crossorigin href="[^"]+">/g, "")
  .replace("</head>", () => `  <script src="/assets/${bootFile}" defer></script>
  </head>`)
  // Inline the stylesheet: as a separate file it is a render-blocking request, which on a phone
  // network delays the first paint by a whole round trip. (The CSP allows inline styles.) The file
  // stays linked but `disabled`: a disabled stylesheet is neither downloaded nor applied, and the link
  // is how Vite's loader sees it is already on the page, so lazy chunks that list it do not add it again.
  .replace(
    /<link rel="stylesheet" crossorigin href="(\/assets\/([^"]+\.css))">/,
    (_, href, f) => `<style>${readFileSync(dist(`assets/${f}`), "utf8")}</style>
    <link rel="stylesheet" href="${href}" disabled />`
  );
const pages = [];

/* The brand intro on the homepage, in the HTML itself so it paints with the first frame. Its
   timeline is CSS ("Intro" in src/styles/index.css; hidden with reduced motion); public/intro.js
   only adds skip-on-input and removes it afterwards, so it loads async and blocks nothing. */
const INTRO = `<div class="intro" aria-hidden="true"><div class="intro__light"></div><div class="intro__mark"><div class="intro__logo"><img src="/logo.webp" width="384" height="172" alt="" decoding="sync" fetchpriority="high" /></div><p class="intro__name">CODEFLOOR IT</p><p class="intro__tag">Build <i>&bull;</i> Innovate <i>&bull;</i> Transform</p></div></div>
    <script src="/intro.js" async></script>`;
const unesc = (s) =>
  s.replace(/&quot;/g, '"').replace(/&#x27;|&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&");

/* The readable text of a page's <main>, as light Markdown, for llms-full.txt. Decorative
   (aria-hidden) markup is dropped first; headings and list items keep their shape. */
const mainText = (html) => {
  const main = html.match(/<main[^>]*>([\s\S]*)<\/main>/)?.[1] ?? "";
  return unesc(
    main
      .replace(/<(svg|script|style|canvas)[\s\S]*?<\/\1>/g, "")
      .replace(/<(\w+)[^>]*aria-hidden="true"[^>]*>[\s\S]*?<\/\1>/g, "")
      .replace(/<h([1-4])[^>]*>/g, (_, n) => `\n\n${"#".repeat(Number(n) + 1)} `)
      .replace(/<\/h[1-4]>/g, "\n")
      .replace(/<li[^>]*>/g, "\n- ")
      .replace(/<\/(p|div|section|ul|ol|details|summary|article|header|a|button)>/g, "\n")
      .replace(/<[^>]+>/g, "")
  )
    .replace(/[ \t]+/g, " ")
    .replace(/ *\n */g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

for (const route of [...routes, "/404"]) {
  const { html, head } = await render(route);
  let page = template
    .replace(/<!--seo-->[\s\S]*<!--\/seo-->/, () => head)
    .replace("<!--intro-->", () => (route === "/" ? INTRO : ""))
    .replace("<!--app-->", () => html);
  if (route === "/") page = page.replace('<html lang="en">', '<html lang="en" class="has-intro">');
  if (route !== "/404") {
    const title = unesc(head.match(/<title>([^<]*)/)[1]);
    const description = unesc(head.match(/name="description" content="([^"]*)/)[1]);
    pages.push({ route, title, description, text: mainText(html) });
  }
  const file = dist(route === "/" ? "index.html" : `${route.slice(1)}.html`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, page);
}

// no <lastmod>: the build date is not when a page changed, and a date that is always "today" gets ignored
writeFileSync(
  dist("sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((r) => `  <url><loc>${SITE_URL}${r}</loc></url>`).join("\n")}
</urlset>
`
);

const section = (name, test) =>
  `## ${name}\n\n${pages
    .filter((p) => test(p.route))
    .map((p) => `- [${p.title}](${SITE_URL}${p.route}): ${p.description}`)
    .join("\n")}\n`;
writeFileSync(
  dist("llms.txt"),
  [
    `# Codefloor IT\n\n> ${pages[0].description}\n`,
    section("Company", (r) => ["/", "/about", "/solutions", "/contact"].includes(r)),
    section("Services", (r) => r.startsWith("/services")),
    section("Work", (r) => r.startsWith("/work")),
    section("Insights", (r) => r.startsWith("/insights")),
  ].join("\n")
);

// the full text of every page, so an answer engine can quote the site without crawling it
writeFileSync(
  dist("llms-full.txt"),
  `# Codefloor IT — full site text\n\n> ${pages[0].description}\n\n` +
    pages.map((p) => `---\n\n# ${p.title}\n\nURL: ${SITE_URL}${p.route}\n\n${p.text}\n`).join("\n")
);

rmSync(resolve(root, "dist-ssr"), { recursive: true, force: true });
console.log(`prerendered ${routes.length + 1} pages, sitemap.xml with ${routes.length} URLs, llms.txt, llms-full.txt`);
