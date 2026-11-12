import { useEffect, useRef } from "react";
import { canAnimate } from "../lib/motion";

/* A glowing instrument dial: a segmented ring with ticks, a stack of bars that breathe
   like a waveform, and a trail of dots that redraws itself through different easing
   curves. The markup is a complete still frame (prerendered, reduced motion, .lite);
   anime.js is loaded only once the dial scrolls into view. Then a spark flies from the
   floating Sukaram's antenna into the dial, and the dial powers on. */

const SEGS = 8;
const TICKS = 120;
const BARS = 31;
const DOTS = 22;
const R = 186;

const polar = (deg, r) => [r * Math.sin((deg * Math.PI) / 180), -r * Math.cos((deg * Math.PI) / 180)];
const arc = (from, to) => {
  const [x1, y1] = polar(from, R);
  const [x2, y2] = polar(to, R);
  return `M${x1.toFixed(1)} ${y1.toFixed(1)}A${R} ${R} 0 0 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
};
const segs = Array.from({ length: SEGS }, (_, i) => ({
  d: arc(i * 45 + 2.5, i * 45 + 42.5),
  hue: 190 + 70 * Math.sin((Math.PI * i) / SEGS), // cyan -> violet -> cyan around the ring
}));
const ticks = Array.from({ length: TICKS }, (_, i) => {
  const deg = (i * 360) / TICKS;
  const [x1, y1] = polar(deg, i % 10 ? 166 : 158);
  const [x2, y2] = polar(deg, 172);
  return [x1, y1, x2, y2].map((n) => n.toFixed(1));
});
const bars = Array.from({ length: BARS }, (_, i) => {
  const u = (i / (BARS - 1)) * 2 - 1;
  return { y: u * 110, half: 18 + 110 * Math.cos((u * Math.PI) / 2) ** 0.9 };
});
const dotX = (i) => -110 + (220 * i) / (DOTS - 1);
const dotY = (ease, i) => 85 - 170 * ease(i / (DOTS - 1));
const inOutSine = (t) => -(Math.cos(Math.PI * t) - 1) / 2;

export default function SignalDial() {
  const ref = useRef(null);
  const label = useRef(null);

  useEffect(() => {
    const root = ref.current;
    if (!canAnimate()) return;
    let alive = true;
    let scope;
    let spark;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        import("animejs").then(({ animate, createDrawable, createMotionPath, createScope, eases, scrambleText, stagger }) => {
          if (!alive) return;
          const curves = [
            ["inOutSine", eases.inOutSine],
            ["outElastic", eases.outElastic(1, 0.4)],
            ["inOutBack", eases.inOutBack(2)],
            ["outBounce", eases.outBounce],
            ["inOutExpo", eases.inOutExpo],
          ];
          scope = createScope({ root }).add(() => {
            root.classList.add("is-booting");
            const powerOn = () => {
              spark?.remove();
              if (!alive) return;
              root.classList.remove("is-booting");
              animate(createDrawable(".sd__seg"), { draw: ["0 0", "0 1"], delay: stagger(90), duration: 900, ease: "inOutQuad" });
            };

            // the spark: a curved wire from Sukaram's antenna (the floating button) to the dial's centre
            const from = document.querySelector(".asst__fab")?.getBoundingClientRect();
            const to = root.querySelector(".sd__svg").getBoundingClientRect();
            if (!from?.width) return powerOn();
            const sx = from.left + from.width / 2;
            const sy = from.top + 4;
            const ex = to.left + to.width / 2;
            const ey = to.top + to.height / 2;
            spark = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            spark.setAttribute("class", "sd-spark");
            spark.setAttribute("aria-hidden", "true");
            spark.innerHTML = `<path d="M${sx} ${sy}Q${(sx + ex) / 2 + 120} ${Math.min(sy, ey) - 140} ${ex} ${ey}"/><circle r="5"/>`;
            document.body.appendChild(spark);
            const wire = spark.querySelector("path");
            animate(createDrawable(wire), { draw: ["0 0", "0 1", "1 1"], duration: 1100, ease: "inOutQuad" });
            animate(spark.querySelector("circle"), { ...createMotionPath(wire), duration: 1000, ease: "inOutQuad", onComplete: powerOn });
            animate(".sd__ticks", { rotate: 360, duration: 90000, ease: "linear", loop: true });
            animate(".sd__tick", { opacity: [0.18, 1], delay: stagger(14), duration: 700, ease: "inOutSine", loop: true, alternate: true });
            animate(".sd__bar", {
              scaleX: [0.25, 1],
              delay: stagger(45, { from: "center" }),
              duration: 1300,
              ease: "inOutSine",
              loop: true,
              alternate: true,
            });

            // every few seconds the dots redraw the next easing curve, and the readout decodes its name
            let n = 0;
            const next = () => {
              if (!alive) return;
              n = (n + 1) % curves.length;
              const [name, ease] = curves[n];
              animate(label.current, { textContent: scrambleText({ text: name, chars: "a-zA-Z" }) });
              animate(".sd__dot", { cy: (_, i) => dotY(ease, i), delay: stagger(28), duration: 900, ease: "outExpo" }).then(() =>
                setTimeout(next, 1800)
              );
            };
            setTimeout(next, 1800);
          });
        });
      },
      { threshold: 0.35 }
    );
    io.observe(root);
    return () => {
      alive = false;
      io.disconnect();
      scope?.revert();
      spark?.remove();
    };
  }, []);

  return (
    <figure className="sd" ref={ref} aria-hidden="true">
      <svg className="sd__svg" viewBox="-200 -200 400 400">
        {segs.map((s, i) => (
          <path key={i} className="sd__seg" d={s.d} style={{ "--h": s.hue }} />
        ))}
        <g className="sd__ticks">
          {ticks.map(([x1, y1, x2, y2], i) => (
            <line key={i} className="sd__tick" x1={x1} y1={y1} x2={x2} y2={y2} />
          ))}
        </g>
        {bars.map((b, i) => (
          <rect key={i} className="sd__bar" x={-b.half} y={b.y - 1.25} width={b.half * 2} height="2.5" rx="1.25" />
        ))}
        {Array.from({ length: DOTS }, (_, i) => (
          <circle key={i} className="sd__dot" cx={dotX(i)} cy={dotY(inOutSine, i)} r="4" />
        ))}
      </svg>
      <figcaption className="sd__readout">
        ease: <code ref={label}>inOutSine</code>
      </figcaption>
    </figure>
  );
}
