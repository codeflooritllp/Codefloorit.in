import { useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { projects } from "../data/projects";
import { services } from "../data/services";
import { scrollToTarget, useScrollProgress } from "../lib/motion";
import { ArrowLink, SectionHeading, StatusBadge } from "./ui";
import { Mockup } from "./cards";
import ServiceGlyph from "./ServiceGlyph";

/* The same conditions as the "Scenes" block in index.css: only then is a wrapper pinned. */
const PINNED = "(min-width: 900px) and (min-height: 640px) and (prefers-reduced-motion: no-preference)";
const pinned = () => window.matchMedia(PINNED).matches;
const smooth = (x) => x * x * (3 - 2 * x);
const clamp01 = (x) => Math.min(1, Math.max(0, x));

/* Scroll storytelling primitives. Pinning is plain `position: sticky` inside a tall
   wrapper; the shared scroll loop in lib/motion.js writes the wrapper's progress to
   --p and the stylesheet turns that into zoom, depth and fades. On phones and with
   reduced motion the wrappers collapse to normal flow (see "Scenes" in index.css). */

/** Content scales and fades up to full size as it enters the viewport. */
export function ZoomIn({ className = "", children }) {
  const ref = useScrollProgress("enter");
  return (
    <div ref={ref} className={`zoom ${className}`}>
      {children}
    </div>
  );
}

/* ---------- Digital evolution: idea -> innovation -> engineering -> transformation ---------- */

const STAGES = [
  { t: "Ideas", d: "Every product starts as a question: what should this make easier? We listen first and turn your idea into a clear, agreed brief." },
  { t: "Innovation", d: "We explore the options and shape a solution around how your business actually works, not around a template." },
  { t: "Engineering", d: "Clean architecture, working increments and testing at every step, so what we build is solid underneath." },
  { t: "Transformation", d: "The idea becomes a working website or software product that your team and your customers use every day." },
];
const NODES = 24;
const TAU = Math.PI * 2;
const rnd = (i) => {
  const x = Math.sin(i * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};
/* the 24 points take four formations: scattered sparks, a connected constellation,
   an engineered grid, and finally the frame of a finished product window */
const perimeter = (i) => {
  const W = 280;
  const H = 190;
  let t = (i / NODES) * 2 * (W + H);
  if (t < W) return [t - W / 2, -H / 2];
  t -= W;
  if (t < H) return [W / 2, t - H / 2];
  t -= H;
  if (t < W) return [W / 2 - t, H / 2];
  return [-W / 2, H / 2 - (t - W)];
};
const FORMATIONS = [
  Array.from({ length: NODES }, (_, i) => [Math.cos(rnd(i) * TAU) * (30 + rnd(i + 50) * 130), Math.sin(rnd(i) * TAU) * (30 + rnd(i + 50) * 130)]),
  Array.from({ length: NODES }, (_, i) => [Math.cos((i / NODES) * TAU - Math.PI / 2) * (i % 2 ? 92 : 150), Math.sin((i / NODES) * TAU - Math.PI / 2) * (i % 2 ? 92 : 150)]),
  Array.from({ length: NODES }, (_, i) => [((i % 6) - 2.5) * 52, (Math.floor(i / 6) - 1.5) * 52]),
  Array.from({ length: NODES }, (_, i) => perimeter(i)),
];
const pathOf = (pts) => `M${pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L")}Z`;

/** Pinned four-stage story. Scroll moves the 24 points between formations (written
    straight to the SVG, no re-render) and swaps the stage copy. On phones it is a list,
    with the drawing resting on the finished product. */
export function StoryScene() {
  const [active, setActive] = useState(0);
  const dots = useRef([]);
  const wire = useRef(null);
  const shown = useRef(0);
  const ref = useScrollProgress("pin", (p) => {
    if (!pinned()) return;
    // hold on each formation, travel between them
    const raw = p * (STAGES.length - 1);
    const from = Math.min(Math.floor(raw), STAGES.length - 2);
    const k = smooth(clamp01((raw - from - 0.2) / 0.6));
    const a = FORMATIONS[from];
    const b = FORMATIONS[from + 1];
    const pts = a.map(([x, y], i) => [x + (b[i][0] - x) * k, y + (b[i][1] - y) * k]);
    pts.forEach(([x, y], i) => {
      dots.current[i]?.setAttribute("cx", x.toFixed(1));
      dots.current[i]?.setAttribute("cy", y.toFixed(1));
    });
    wire.current?.setAttribute("d", pathOf(pts));
    const stage = Math.round(from + k);
    if (stage !== shown.current) setActive((shown.current = stage));
  });
  const rest = FORMATIONS[STAGES.length - 1];

  return (
    <section className="scene scene--story" ref={ref} data-robot="think">
      <div className="scene__pin">
        <div className="container story">
          <div className="story__copy">
            <SectionHeading eyebrow="Digital evolution" title="From an Idea to an Engineered Product" />
            <ol className="story__stages">
              {STAGES.map((st, i) => (
                <li key={st.t} className={`story__stage ${i === active ? "is-active" : ""}`}>
                  <span className="story__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{st.t}</h3>
                  <p>{st.d}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className="story__art" aria-hidden="true">
            <span className="story__big">{String(active + 1).padStart(2, "0")}</span>
            <svg viewBox="-200 -200 400 400" className="story__svg">
              <path ref={wire} className="story__wire" d={pathOf(rest)} />
              <g className="story__ui">
                <rect x="-140" y="-95" width="280" height="30" />
                <rect x="-118" y="-45" width="120" height="12" rx="6" />
                <rect x="-118" y="-20" width="190" height="8" rx="4" />
                <rect x="-118" y="0" width="160" height="8" rx="4" />
                <rect x="-118" y="34" width="70" height="26" rx="8" />
              </g>
              {rest.map(([x, y], i) => (
                <circle key={i} ref={(el) => (dots.current[i] = el)} className="story__dot" cx={x} cy={y} r={i % 6 ? 4 : 6} />
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Services: a pinned reel, one service at a time ---------- */

/** The six services as a scroll-driven reel: an oversized index of every service on the
    left, and the active service's illustration, summary and link on the right. The tone
    of the section shifts with each one. On phones the panels simply stack. */
export function ServiceReel({ eyebrow, title, sub, action }) {
  const n = services.length;
  const [active, setActive] = useState(0);
  const shown = useRef(0);
  const ref = useScrollProgress("pin", (p) => {
    const i = Math.min(n - 1, Math.floor(p * n));
    if (i !== shown.current) setActive((shown.current = i));
  });
  return (
    <section className="scene scene--svc" id="services" ref={ref} style={{ "--n": n }} data-robot="point" data-morph data-robot-hint="services">
      <div className="scene__pin">
        <div className="container">
          <div className="shead-row svc__head">
            <SectionHeading eyebrow={eyebrow} title={title} sub={sub} />
            {action}
          </div>
          <div className="svc">
            <ol className="svc__index" aria-hidden="true">
              {services.map((s, i) => (
                <li key={s.slug} className={i === active ? "is-active" : i < active ? "is-past" : ""}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </li>
              ))}
            </ol>
            <div className="svc__stage">
              {services.map((s, i) => {
                const Icon = s.icon;
                return (
                  <article key={s.slug} className={`svp ${i === active ? "is-active" : ""}`} style={{ "--i": i }}>
                    <div className="svp__art"><ServiceGlyph slug={s.slug} /></div>
                    <div className="svp__body">
                      <span className="icon-tile"><Icon size={24} aria-hidden="true" /></span>
                      <h3>{s.title}</h3>
                      <p>{s.short}</p>
                      <ArrowLink to={`/services/${s.slug}`}>
                        Learn more<span className="sr-only"> about {s.title}</span>
                      </ArrowLink>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Kinetic statement ---------- */

/** Splits a line into characters for the stylesheet, grouped into unbreakable words so a
    line only wraps between words. Screen readers get the sr-only copy instead. */
function Chars({ text }) {
  let c = 0;
  return text.split(" ").map((word, w) => (
    <span key={w}>
      {w > 0 && " "}
      <span className="kt__w">
        {[...word].map((ch) => {
          const i = c++;
          return <span key={i} className="kt__c" style={{ "--c": i + w }}>{ch}</span>;
        })}
      </span>
    </span>
  ));
}

/** Pinned typography: the first line assembles, then blurs away as the second line rises
    in letter by letter over an oversized word drifting in the background. */
export function KineticStatement() {
  const ref = useScrollProgress("pin");
  const a = "We don\u2019t just build websites.";
  const b = "We build business experiences.";
  return (
    <section className="scene scene--kt" ref={ref} data-robot="idle">
      <div className="scene__pin">
        <span className="kt__bg" aria-hidden="true">Experiences</span>
        <div className="container">
          <h2 className="kt">
            <span className="sr-only">{a} {b}</span>
            <span className="kt__l kt__l--a" aria-hidden="true"><Chars text={a} /></span>
            <span className="kt__l kt__l--b" aria-hidden="true"><Chars text={b} /></span>
          </h2>
        </div>
      </div>
    </section>
  );
}

/** Pinned portfolio: the projects travel past horizontally as the page scrolls down, each
    turning in 3D as it enters and leaves the centre. */
export function WorkScene() {
  const n = projects.length;
  const [active, setActive] = useState(0);
  const shown = useRef(0);
  const ref = useScrollProgress("pin", (p) => {
    const i = Math.round(p * (n - 1));
    if (i !== shown.current) setActive((shown.current = i));
  });
  // keyboard: tabbing into an off-screen project scrolls the page until it is centred
  const reveal = (i) => {
    const el = ref.current;
    if (!el || !pinned()) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToTarget(top + (i / Math.max(1, n - 1)) * (el.offsetHeight - window.innerHeight), { immediate: true });
  };

  return (
    <section className="scene scene--work" ref={ref} style={{ "--n": n }} data-robot="explore" data-morph data-robot-hint="work">
      <div className="scene__pin">
        <div className="container">
          <header className="wscene__head">
            <div>
              <p className="eyebrow">Our work</p>
              <h2 className="shead__title">Selected Work &amp; Digital Experiences</h2>
            </div>
            <div className="wscene__nav">
              <p className="wscene__count" aria-hidden="true">
                <b>{String(active + 1).padStart(2, "0")}</b> / {String(n).padStart(2, "0")}
              </p>
              <ArrowLink to="/work">All work</ArrowLink>
            </div>
          </header>

          <div className="wstage">
            {projects.map((p, i) => (
              <article
                key={p.slug}
                className={`wpanel pcard--${p.scene} ${i === active ? "is-active" : ""}`}
                style={{ "--i": i }}
              >
                <span className="wpanel__n" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                <div className="wpanel__media">
                  <Mockup project={p} />
                  {!p.shot && <span className="pcard__tag">Illustrative mockup</span>}
                </div>
                <div className="wpanel__body">
                  <div className="pcard__meta">
                    <span>{p.category}</span>
                    <StatusBadge status={p.status} />
                  </div>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  <ul className="tags" aria-label="Technology">
                    {p.tech.slice(0, 4).map((t) => (
                      <li key={t}>{t}</li>
                    ))}
                  </ul>
                  <Link to={`/work/${p.slug}`} className="btn btn--outline" onFocus={() => i !== active && reveal(i)}>
                    View case study<span className="sr-only">: {p.title}</span>
                    <ArrowUpRight size={18} className="btn__arrow" aria-hidden="true" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          <div className="wpips" aria-hidden="true">
            {projects.map((p, i) => (
              <i key={p.slug} className={i === active ? "is-active" : ""} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
