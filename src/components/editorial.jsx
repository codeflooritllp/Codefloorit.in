import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import { useGsap } from "../lib/gsap";
import { Mockup } from "./cards";
import { StatusBadge } from "./ui";

/* Editorial pieces shared by every page: an oversized serif word that drifts behind a
   section, media that opens up as it scrolls in, a table of contents, and the horizontal
   portfolio. All are complete static layouts; GSAP (lib/gsap.js) only adds the motion. */

/** Decorative oversized italic word behind a section; slides sideways with scroll. */
export function BigWord({ children, className = "" }) {
  const ref = useGsap((gsap, _, el) => {
    gsap.fromTo(el, { xPercent: 12 }, { xPercent: -18, ease: "none", scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true } });
  });
  return (
    <span ref={ref} className={`bigword ${className}`} aria-hidden="true">
      {children}
    </span>
  );
}

/** Media that opens from an inset frame and settles from a slight zoom as it scrolls in. */
export function MediaReveal({ className = "", children }) {
  const ref = useGsap((gsap, _, el) => {
    const st = { trigger: el, start: "top 92%", end: "top 30%", scrub: 0.6 };
    gsap.fromTo(el, { clipPath: "inset(10% 7% 10% 7% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 20px)", ease: "none", scrollTrigger: st });
    gsap.fromTo(el.firstElementChild, { scale: 1.16 }, { scale: 1, ease: "none", scrollTrigger: st });
  });
  return (
    <div ref={ref} className={`mreveal ${className}`}>
      <div className="mreveal__in">{children}</div>
    </div>
  );
}

/** Fades and lifts each matching child in turn as the block scrolls into view. */
export function Stagger({ as: Tag = "div", selector = ":scope > *", className = "", children }) {
  const ref = useGsap((gsap, _, el) => {
    const items = el.querySelectorAll(selector);
    gsap.from(items, { y: 48, opacity: 0, duration: 0.9, ease: "power3.out", stagger: 0.08, scrollTrigger: { trigger: el, start: "top 85%", once: true } });
  });
  return (
    <Tag ref={ref} className={className}>
      {children}
    </Tag>
  );
}

/** Sticky table of contents; the section in view is marked current. `items`: [{ id, text }]. */
export function Toc({ items, label = "On this page" }) {
  const [active, setActive] = useState(items[0]?.id);
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter(Boolean);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items]);
  if (items.length < 2) return null;
  return (
    <nav className="toc" aria-label={label}>
      <p className="toc__label">{label}</p>
      <ol>
        {items.map((i, n) => (
          <li key={i.id}>
            <a href={`#${i.id}`} aria-current={active === i.id ? "true" : undefined}>
              <span aria-hidden="true">{String(n + 1).padStart(2, "0")}</span>
              {i.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** "Hotel booking: what to plan" -> "hotel-booking-what-to-plan" */
export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** The portfolio as full-height panels. On wide screens the page pins and the panels
    travel sideways as you scroll down; on phones and tablets they are a native swipe
    carousel (CSS scroll snap) with dots that follow the swipe and jump to a project. */
export function HorizontalShowcase({ projects }) {
  const [current, setCurrent] = useState(0);
  const track = useRef(null);
  useEffect(() => {
    const panels = [...track.current.children];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setCurrent(panels.indexOf(e.target))),
      { root: track.current, threshold: 0.6 }
    );
    panels.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
  const go = (i) => {
    const t = track.current;
    t.scrollTo({ left: t.children[i].offsetLeft - (t.clientWidth - t.children[i].offsetWidth) / 2, behavior: "smooth" });
  };
  const ref = useGsap((gsap, ScrollTrigger, el) => {
    const mm = gsap.matchMedia();
    mm.add("(min-width: 900px) and (min-height: 600px)", () => {
      const track = el.querySelector(".hshow__track");
      const distance = () => track.scrollWidth - window.innerWidth;
      const tween = gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { trigger: el, start: "top top", end: () => `+=${distance()}`, pin: true, scrub: 0.8, invalidateOnRefresh: true, anticipatePin: 1 },
      });
      // each panel's screen leans in from the right and settles as it reaches the centre
      el.querySelectorAll(".hshow__media").forEach((m) => {
        gsap.fromTo(m, { rotateY: -18, scale: 0.9 }, { rotateY: 0, scale: 1, ease: "none", scrollTrigger: { trigger: m, containerAnimation: tween, start: "left right", end: "center center", scrub: true } });
      });
      el.querySelectorAll(".hshow__title").forEach((t) => {
        gsap.from(t, { xPercent: 30, opacity: 0.2, ease: "none", scrollTrigger: { trigger: t, containerAnimation: tween, start: "left right", end: "left 40%", scrub: true } });
      });
    });
  });
  return (
    <section className="hshow" ref={ref} aria-label="Projects">
      <div className="hshow__track" ref={track}>
        {projects.map((p, i) => (
          <article key={p.slug} className={`hshow__panel pcard--${p.scene}`}>
            <div className="hshow__media">
              <Mockup project={p} />
              {!p.shot && <span className="pcard__tag">Illustrative mockup</span>}
            </div>
            <div className="hshow__body">
              <p className="hshow__n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")} <span>/ {String(projects.length).padStart(2, "0")}</span>
              </p>
              <div className="pcard__meta">
                <span>{p.category}</span>
                <StatusBadge status={p.status} />
              </div>
              <h2 className="hshow__title">{p.title}</h2>
              <p>{p.summary}</p>
              <ul className="tags" aria-label="Technology">
                {p.tech.slice(0, 4).map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </ul>
              <Link to={`/work/${p.slug}`} className="btn btn--outline">
                View case study<span className="sr-only">: {p.title}</span>
                <ArrowUpRight size={18} className="btn__arrow" aria-hidden="true" />
              </Link>
            </div>
          </article>
        ))}
      </div>
      <div className="hshow__dots">
        {projects.map((p, i) => (
          <button key={p.slug} type="button" aria-label={`Show ${p.title}`} aria-current={i === current ? "true" : undefined} onClick={() => go(i)} />
        ))}
      </div>
    </section>
  );
}
