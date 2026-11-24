import { useEffect, useRef } from "react";
import { canAnimate, finePointer, introDelay } from "../lib/motion";

/* Decorative WebGL canvas. three.js is only downloaded on desktop-sized screens with a
   mouse, without reduced motion or data saver, and only once the canvas is near the
   viewport. It renders only while on screen, and not at all without GPU acceleration (see
   mount() in three/scene.js). Everywhere else the canvas stays empty. */
/* Asks for a GPU without creating a WebGL context (asynchronous, never blocks): no WebGPU adapter,
   or only the software fallback, means no GPU acceleration, and the scene is skipped before three.js
   downloads. Browsers without WebGPU go ahead; mount() then checks the WebGL renderer itself.
   ponytail: also skips 3D where WebGPU is turned off on a real GPU (e.g. some Linux desktops),
   which just shows the static page there. */
const hasGpu = () =>
  navigator.gpu
    ? navigator.gpu.requestAdapter().then((a) => !!a && !a.info?.isFallbackAdapter, () => true)
    : Promise.resolve(true);

export default function Scene3D({ kind = "cluster" }) {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canAnimate() || !finePointer() || window.innerWidth < 900) return;

    let api = null;
    let dead = false;
    let loading = false;
    let visible = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        visible = entry.isIntersecting;
        if (api) return visible ? api.start() : api.stop();
        if (!visible || loading) return;
        loading = true;
        hasGpu()
          .then((gpu) => (gpu && !dead ? import("./three/scene.js") : null))
          .then((m) => (m && !dead ? m.mount(canvas, kind) : null))
          .then((a) => {
            if (dead) return a?.dispose();
            api = a;
            if (!api) return;
            canvas.classList.add("is-ready");
            if (visible) api.start();
          })
          .catch(() => {}); // decorative: a failed download just leaves the canvas empty
      },
      { rootMargin: "200px" }
    );
    // Setting up the scene is ~0.4s of main-thread work (split into short tasks). Start it only after the brand intro and
    // the hero's entrance have played (they run ~1.5s after the intro), then in idle time: while
    // they ran, the idle deadline fired mid-entrance and froze it for that long.
    const idle = window.requestIdleCallback ?? ((fn) => setTimeout(fn, 600));
    let handle = 0;
    const settle = setTimeout(() => {
      // (with a deadline: constant animation elsewhere can starve idle time indefinitely)
      handle = idle(() => io.observe(canvas), { timeout: 2000 });
    }, introDelay() + 1600);

    return () => {
      dead = true;
      clearTimeout(settle);
      (window.cancelIdleCallback ?? clearTimeout)(handle);
      io.disconnect();
      api?.dispose();
    };
  }, [kind]);

  return <canvas ref={ref} className={`s3d s3d--${kind}`} aria-hidden="true" />;
}
