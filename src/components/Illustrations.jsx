import { useId } from "react";

/* Original line illustrations in the brand palette (cyan -> blue -> violet on deep navy).
   Drawn as SVG: crisp at any size, a few hundred bytes each, no licensing questions, and
   clearly illustrations, so nothing here can be mistaken for real people, offices or clients.
   Decorative: the text beside each one carries the meaning. */

function Art({ className = "", children, viewBox = "0 0 240 150" }) {
  const id = useId().replace(/[^a-z0-9]/gi, "");
  return (
    <svg className={`illo ${className}`} viewBox={viewBox} fill="none" aria-hidden="true" focusable="false" style={{ "--g": `url(#g${id})`, "--f": `url(#f${id})` }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#00d4ff" />
          <stop offset=".55" stopColor="#3d8bff" />
          <stop offset="1" stopColor="#8b6cff" />
        </linearGradient>
        <linearGradient id={`f${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#3d8bff" stopOpacity=".22" />
          <stop offset="1" stopColor="#8b6cff" stopOpacity=".04" />
        </linearGradient>
      </defs>
      {children}
    </svg>
  );
}

/* shared strokes: S = gradient line, M = muted line, F = tinted panel. The gradients are
   per-instance ids, passed down as --g / --f (style, since SVG attributes cannot read var()) */
const S = { style: { stroke: "var(--g)" }, strokeWidth: 2, strokeLinecap: "round", strokeLinejoin: "round" };
const M = { stroke: "rgb(160 190 235 / .35)", strokeWidth: 1.5, strokeLinecap: "round" };
const F = { style: { fill: "var(--f)", stroke: "var(--g)" }, strokeWidth: 1.5 };

const STAGES = {
  // a magnifier over loose requirement notes
  Discover: (
    <>
      <rect x="34" y="34" width="62" height="44" rx="6" {...F} transform="rotate(-6 65 56)" />
      <rect x="84" y="60" width="62" height="44" rx="6" {...F} transform="rotate(5 115 82)" />
      <path d="M46 50h34M46 60h24M96 78h34M96 88h22" {...M} />
      <circle cx="160" cy="62" r="26" {...S} fill="rgb(0 212 255 / .06)" />
      <path d="M179 81l22 22" {...S} strokeWidth="5" />
      <path d="M150 58q10-10 20 0" {...S} />
    </>
  ),
  // a blueprint: modules joined on a grid, with milestones along the bottom
  Define: (
    <>
      <path d="M30 30h180M30 60h180M30 90h180M60 20v100M120 20v100M180 20v100" stroke="rgb(120 170 255 / .12)" />
      <rect x="40" y="36" width="50" height="34" rx="5" {...F} />
      <rect x="150" y="36" width="50" height="34" rx="5" {...F} />
      <rect x="95" y="78" width="50" height="30" rx="5" {...F} />
      <path d="M90 53h60M65 70v23h30M175 70v23h-30" {...S} strokeDasharray="4 5" />
      <path d="M40 128h160" {...M} />
      <circle cx="60" cy="128" r="5" fill="#00d4ff" /><circle cx="120" cy="128" r="5" fill="#3d8bff" /><circle cx="180" cy="128" r="5" {...S} />
    </>
  ),
  // a wireframe being laid out, with a cursor placing a block
  Design: (
    <>
      <rect x="34" y="22" width="150" height="106" rx="8" {...F} />
      <path d="M34 38h150" {...M} />
      <rect x="46" y="50" width="70" height="10" rx="5" {...S} />
      <path d="M46 70h56M46 80h44" {...M} />
      <rect x="128" y="50" width="44" height="40" rx="6" stroke="rgb(160 190 235 / .35)" strokeDasharray="4 4" />
      <rect x="46" y="100" width="36" height="14" rx="7" fill="#00d4ff" fillOpacity=".8" />
      <path d="M176 92l26 10-11 4-4 11z" fill="#eef4ff" stroke="#0a1020" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="210" cy="40" r="10" {...S} /><circle cx="210" cy="70" r="10" fill="#8b6cff" fillOpacity=".7" />
    </>
  ),
  // a code window that builds into a passing check
  Develop: (
    <>
      <rect x="30" y="22" width="180" height="106" rx="8" {...F} />
      <path d="M30 40h180" {...M} />
      <circle cx="42" cy="31" r="3" fill="#ff6b8b" /><circle cx="52" cy="31" r="3" fill="#ffc24b" /><circle cx="62" cy="31" r="3" fill="#33d69f" />
      <path d="M58 62l-14 12 14 12M98 62l14 12-14 12M84 58l-12 32" {...S} />
      <path d="M128 60h56M138 74h40M128 88h48M138 102h30" {...M} />
      <circle cx="186" cy="110" r="13" fill="#33d69f" fillOpacity=".15" stroke="#33d69f" strokeWidth="2" />
      <path d="M180 110l4 4 8-8" stroke="#33d69f" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    </>
  ),
  // tested build lifting off from its window: release
  Launch: (
    <>
      <rect x="40" y="70" width="110" height="58" rx="8" {...F} />
      <path d="M40 86h110M56 100h40M56 112h60" {...M} />
      <path d="M150 52c18-26 40-34 52-34 0 12-8 34-34 52l-10 10-18-18z" {...S} fill="rgb(0 212 255 / .08)" />
      <circle cx="176" cy="44" r="6" {...S} />
      <path d="M142 70l-14 2 12-14M162 80l-2 14 14-12" {...S} />
      <path d="M140 92l-16 16M150 100l-10 10M130 84l-8 8" stroke="#8b6cff" strokeWidth="2" strokeLinecap="round" opacity=".8" />
    </>
  ),
  // a rising chart with a loop: iterate after launch
  Improve: (
    <>
      <path d="M36 126h170M36 126V26" {...M} />
      <rect x="52" y="96" width="18" height="30" rx="3" fill="rgb(61 139 255 / .25)" />
      <rect x="82" y="82" width="18" height="44" rx="3" fill="rgb(61 139 255 / .35)" />
      <rect x="112" y="66" width="18" height="60" rx="3" fill="rgb(61 139 255 / .5)" />
      <rect x="142" y="46" width="18" height="80" rx="3" {...F} />
      <path d="M50 88l32-14 30-16 30-20 34-12" {...S} />
      <path d="M186 22c14 4 20 18 12 30M200 52l-2-10 10 2" {...S} />
    </>
  ),
};

/** Illustration for a process stage, keyed by its title in data/site.js PROCESS. */
export function StageArt({ stage }) {
  const art = STAGES[stage];
  return art ? <Art className="illo--stage">{art}</Art> : null;
}

/** An engineering workspace: a code screen, a dashboard and a phone preview on one desk. */
export function Workspace() {
  return (
    <Art className="illo--workspace" viewBox="0 0 480 300">
      <ellipse cx="240" cy="270" rx="210" ry="18" fill="rgb(0 212 255 / .06)" />
      <path d="M40 262h400" {...M} />
      {/* code monitor */}
      <rect x="54" y="60" width="200" height="130" rx="10" {...F} />
      <path d="M54 80h200" {...M} />
      <circle cx="68" cy="70" r="3.5" fill="#ff6b8b" /><circle cx="80" cy="70" r="3.5" fill="#ffc24b" /><circle cx="92" cy="70" r="3.5" fill="#33d69f" />
      <path d="M72 100h40M84 114h70M84 128h52M72 142h30M84 156h86M72 170h46" {...M} />
      <path d="M72 100h40M84 128h52" {...S} />
      <path d="M154 190v40M124 262l30-32 30 32" {...M} />
      {/* dashboard monitor */}
      <rect x="236" y="34" width="190" height="124" rx="10" {...F} />
      <rect x="252" y="52" width="48" height="30" rx="5" fill="rgb(0 212 255 / .18)" />
      <rect x="308" y="52" width="48" height="30" rx="5" fill="rgb(61 139 255 / .18)" />
      <rect x="364" y="52" width="46" height="30" rx="5" fill="rgb(139 108 255 / .2)" />
      <path d="M252 140l26-18 22 8 28-26 26 12 30-24 26-6" {...S} />
      <path d="M331 158v38M302 262l29-66 29 66" {...M} />
      {/* phone */}
      <rect x="386" y="168" width="52" height="94" rx="10" {...F} />
      <path d="M398 186h28M398 198h20" {...M} />
      <rect x="398" y="210" width="28" height="30" rx="4" fill="rgb(0 212 255 / .2)" />
      {/* signal arcs: the three screens are one product */}
      <path d="M254 120q-10 20-4 40M372 160q14 6 16 22" {...S} strokeDasharray="3 6" opacity=".7" />
    </Art>
  );
}
