import { useLayoutEffect, useRef } from "react";
import { CalendarDays, ChartColumn, FileText, PanelLeft, ShoppingCart, UserRound } from "lucide-react";
import { canAnimate } from "../lib/motion";

/* "What should it include?" — toggling a part adds its block to a small wireframe of the
   project, which springs into place (anime.js). The chosen parts travel with the enquiry
   as a line in the project details (ContactForm). */

export const PARTS = [
  { key: "pages", label: "Pages & content", Icon: FileText },
  { key: "store", label: "Online store", Icon: ShoppingCart },
  { key: "accounts", label: "Customer accounts", Icon: UserRound },
  { key: "booking", label: "Bookings & forms", Icon: CalendarDays },
  { key: "dashboard", label: "Dashboard & reports", Icon: ChartColumn },
  { key: "admin", label: "Admin panel", Icon: PanelLeft },
];

function Block({ part: { label, Icon } }) {
  const ref = useRef(null);
  // hide before the first paint, then spring in once anime.js is ready
  useLayoutEffect(() => {
    const el = ref.current;
    if (!canAnimate()) return;
    el.style.opacity = 0;
    let anim;
    let alive = true;
    import("animejs").then(({ animate, stagger }) => {
      if (!alive) return;
      anim = [
        animate(el, { opacity: [0, 1], scale: [0.55, 1], y: [16, 0], duration: 900, ease: "outElastic(1, 0.6)" }),
        animate(el.querySelectorAll(".bp__line"), { scaleX: [0, 1], delay: stagger(70, { start: 150 }), duration: 450, ease: "outExpo" }),
      ];
    }).catch(() => (el.style.opacity = "")); // chunk failed to load: just show the block
    return () => {
      alive = false;
      anim?.forEach((a) => a.revert());
    };
  }, []);
  return (
    <li className="bp__block" ref={ref}>
      <Icon size={18} aria-hidden="true" />
      <span className="bp__name">{label}</span>
      <span className="bp__line" />
      <span className="bp__line" />
    </li>
  );
}

export default function ProjectBlueprint({ value, onChange }) {
  const toggle = (key) => onChange(value.includes(key) ? value.filter((k) => k !== key) : [...value, key]);
  const chosen = PARTS.filter((p) => value.includes(p.key));
  return (
    <fieldset className="field bp">
      <legend>
        What should it include? <span className="field__opt">(optional)</span>
      </legend>
      <div className="bp__chips">
        {PARTS.map((p) => (
          <button key={p.key} type="button" className="bp__chip" aria-pressed={value.includes(p.key)} onClick={() => toggle(p.key)}>
            {p.label}
          </button>
        ))}
      </div>
      <div className="bp__frame" aria-hidden="true">
        <span className="bp__bar"><i /><i /><i /></span>
        {chosen.length ? (
          <ul className="bp__grid">
            {chosen.map((p) => (
              <Block key={p.key} part={p} />
            ))}
          </ul>
        ) : (
          <p className="bp__empty">Pick what you need and your project's blueprint builds here.</p>
        )}
      </div>
    </fieldset>
  );
}
