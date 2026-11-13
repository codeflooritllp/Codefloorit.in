import { animate, createAnimatable, random, scrambleText, stagger } from "animejs";
import { canAnimate, finePointer, introDelay } from "./motion";

/* Pointer effects for desktops with a mouse: a soft light and a HUD reticle that follow the
   cursor, cards that tilt toward it, short labels that "decode" on hover, and section
   headings that decode word by word as they scroll into view. Everything is delegated
   from the document, so it covers every page and component without wiring. Skipped for
   touch, reduced motion and low-powered devices (.lite). */

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#%&*+=<>/";
const SCRAMBLE = ".nav__link, .eyebrow, .alink, .btn";
const TILT = ".card, .tech__card, .wpanel__media";
const MAX_TILT = 6; // degrees
const HOT = "a, button, summary, select, input, textarea, [role='button']";

/** Re-types the element's first text node through random glyphs, left to right. */
function scramble(el) {
  const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.nodeValue.trim());
  if (!node || el.dataset.fxBusy) return;
  el.dataset.fxBusy = "1";
  // anime writes to a plain proxy so only this text node changes, not icons beside it
  const text = { textContent: node.nodeValue };
  animate(text, {
    textContent: scrambleText({ chars: GLYPHS, duration: 420 }),
    onUpdate: () => (node.nodeValue = text.textContent),
    onComplete: () => delete el.dataset.fxBusy,
  });
}

/** Service card art breaks apart and springs back together, like a build snapping into place. */
function assemble(card) {
  animate(card.querySelectorAll(".glyph__front > *"), {
    translateX: { from: () => random(-34, 34), to: 0 }, // not x/y: on SVG shapes those are the position attributes
    translateY: { from: () => random(-26, 26), to: 0 },
    rotate: { from: () => random(-50, 50), to: 0 },
    scale: { from: 0.4, to: 1 },
    delay: stagger(45),
    duration: 900,
    ease: "outElastic(1, 0.55)",
  });
}

/** Card icons give a small springy wobble when the pointer arrives. */
function nudge(icon) {
  animate(icon, { rotate: { from: -16, to: 0 }, scale: { from: 1.18, to: 1 }, duration: 800, ease: "outElastic(1, 0.4)" });
}

export function initFx() {
  if (!canAnimate() || !finePointer()) return;
  const html = document.documentElement;
  html.classList.add("fx");

  const glow = document.createElement("div");
  glow.className = "fx-glow";
  glow.setAttribute("aria-hidden", "true");
  document.body.appendChild(glow);

  // the reticle trails the pointer a little and locks onto anything clickable
  const reticle = document.createElement("div");
  reticle.className = "fx-reticle";
  reticle.setAttribute("aria-hidden", "true");
  document.body.appendChild(reticle);

  // anime batches these writes into its own frame, so pointermove only reads layout
  const light = createAnimatable(glow, { x: 0, y: 0, duration: 60, ease: "linear" });
  const trail = createAnimatable(reticle, { x: 0, y: 0, duration: 180, ease: "out(3)" });
  for (const a of [light, trail]) {
    a.x(innerWidth / 2, 0);
    a.y(innerHeight / 2, 0);
  }
  let x = 0;
  let y = 0;
  let tilted = null;
  document.addEventListener("pointerdown", (e) => {
    reticle.classList.add("is-down");
    // shockwave at the click, and the origin for the next page's portal reveal
    const ring = document.createElement("span");
    ring.className = "fx-shock";
    ring.setAttribute("aria-hidden", "true");
    ring.style.left = `${e.clientX}px`;
    ring.style.top = `${e.clientY}px`;
    ring.addEventListener("animationend", () => ring.remove());
    document.body.appendChild(ring);
    html.style.setProperty("--cx", `${e.clientX}px`);
    html.style.setProperty("--cy", `${e.clientY}px`);
  });
  document.addEventListener("pointerup", () => reticle.classList.remove("is-down"));
  document.documentElement.addEventListener("pointerleave", () => reticle.classList.add("is-away"));
  document.documentElement.addEventListener("pointerenter", () => reticle.classList.remove("is-away"));

  document.addEventListener(
    "pointermove",
    (e) => {
      x = e.clientX;
      y = e.clientY;
      light.x(x);
      light.y(y);
      trail.x(x);
      trail.y(y);

      // soft glow inside buttons follows the pointer (.fx .btn::after)
      const btn = e.target.closest?.(".btn");
      if (btn) {
        const b = btn.getBoundingClientRect();
        btn.style.setProperty("--bx", `${x - b.left}px`);
        btn.style.setProperty("--by", `${y - b.top}px`);
      }

      const card = e.target.closest?.(TILT);
      if (tilted && tilted !== card) {
        tilted.style.removeProperty("--tx");
        tilted.style.removeProperty("--ty");
      }
      tilted = card;
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty("--tx", `${((x - r.left) / r.width - 0.5) * 2 * MAX_TILT}deg`);
      card.style.setProperty("--ty", `${((y - r.top) / r.height - 0.5) * -2 * MAX_TILT}deg`);
    },
    { passive: true }
  );

  document.addEventListener("pointerover", (e) => {
    reticle.classList.toggle("is-hot", !!e.target.closest?.(HOT));
    const el = e.target.closest?.(SCRAMBLE);
    if (el && !el.contains(e.relatedTarget)) scramble(el);
    const card = e.target.closest?.(".scard");
    if (card && !card.contains(e.relatedTarget)) assemble(card);
    const tile = e.target.closest?.(".card, .srow");
    const icon = tile && !tile.contains(e.relatedTarget) && tile.querySelector(".icon-tile svg");
    if (icon) nudge(icon);
  });

  // tickers speed up and lean with the scroll, then settle back
  let lastY = scrollY;
  let vel = 0;
  let spinning = 0;
  const settle = () => {
    vel *= 0.9;
    const skew = `${Math.max(-12, Math.min(12, vel * -0.25)).toFixed(2)}deg`;
    const rate = 1 + Math.min(6, Math.abs(vel) * 0.12);
    // read every track's animations before writing anything: getAnimations() after a style
    // write forces a recalc, and writing --skew on <html> made that recalc cover the whole page
    const tracks = [...document.querySelectorAll(".mq__track")].map((t) => [t, t.getAnimations()]);
    for (const [track, anims] of tracks) {
      track.style.setProperty("--skew", skew);
      for (const a of anims) a.playbackRate = rate;
    }
    spinning = Math.abs(vel) > 0.05 ? requestAnimationFrame(settle) : 0;
  };
  addEventListener(
    "scroll",
    () => {
      vel = vel * 0.6 + (scrollY - lastY) * 0.4;
      lastY = scrollY;
      if (!spinning) spinning = requestAnimationFrame(settle);
    },
    { passive: true }
  );

  // section headings decode once, word by word, when they scroll into view
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        io.unobserve(entry.target);
        entry.target.querySelectorAll(".sw > span").forEach((word, i) => setTimeout(() => scramble(word), 120 + i * 70));
      }
    },
    { threshold: 0.6 }
  );
  const watch = (root) => {
    root.querySelectorAll?.(".shead__title").forEach((h) => io.observe(h));
    // page entrance: the hero eyebrow decodes once, alongside the CSS rise
    root.querySelectorAll?.(".hero .eyebrow, .phero .eyebrow").forEach((el) => setTimeout(() => scramble(el), 300 + introDelay()));
  };
  watch(document);
  // pages rendered later by the router bring new headings
  new MutationObserver((records) => records.forEach((r) => r.addedNodes.forEach(watch))).observe(document.getElementById("root"), {
    childList: true,
    subtree: true,
  });
}
