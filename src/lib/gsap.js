import { useEffect, useRef } from "react";
import { canAnimate, lenisReady } from "./motion";

/* GSAP + ScrollTrigger own the scroll storytelling added on top of the shared --p loop
   (lib/motion.js): image reveals, parallax words, the horizontal portfolio. They load on
   first use and never where motion is reduced. ScrollTrigger reads the real window scroll,
   which Lenis drives, so ticking it from Lenis's scroll event is all the sync needed. */
let ready;
export function loadGsap() {
  return (ready ||= Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([{ gsap }, { ScrollTrigger }]) => {
    gsap.registerPlugin(ScrollTrigger);
    lenisReady.then((lenis) => lenis?.on("scroll", ScrollTrigger.update));
    return { gsap, ScrollTrigger };
  }));
}

/** Runs `setup(gsap, ScrollTrigger, el)` in a gsap.context scoped to the returned ref's
    element; everything it creates is reverted on unmount. Content is never hidden before
    this runs, so without JS or with reduced motion the page is complete and static.
    `setup` runs once, on mount: it should only read the element, not props that change. */
export function useGsap(setup) {
  const ref = useRef(null);
  useEffect(() => {
    if (!canAnimate()) return;
    let ctx;
    let alive = true;
    loadGsap()
      .then(({ gsap, ScrollTrigger }) => {
        if (alive && ref.current) ctx = gsap.context(() => setup(gsap, ScrollTrigger, ref.current), ref.current);
      })
      .catch(() => {}); // a failed chunk leaves the static page
    return () => {
      alive = false;
      ctx?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}
