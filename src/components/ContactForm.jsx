import { useEffect, useRef, useState } from "react";
import { AnimatePresence, m } from "motion/react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { Link } from "react-router";
import { CONTACT, whatsappLink } from "../data/site";
import { services } from "../data/services";
import { BRIEF_KEY } from "../data/sukaram";
import { track } from "../lib/track";
import { validate } from "../lib/contact";
import ProjectBlueprint, { PARTS } from "./ProjectBlueprint";

/* Enquiries go to the site's own API (api/contact.js), which emails them. Setting
   VITE_CONTACT_ENDPOINT to another URL sends them there; setting it to an empty value
   switches the form back to opening WhatsApp with the message filled in (see .env.example). */
const ENDPOINT = import.meta.env.VITE_CONTACT_ENDPOINT ?? "/api/contact";

const SERVICE_OPTIONS = [...services.map((s) => s.title), "Not sure yet"];
const BUDGETS = ["Under ₹25,000", "₹25,000 – ₹1,00,000", "₹1,00,000 – ₹5,00,000", "Above ₹5,00,000", "Not sure yet"];
const EMPTY = { name: "", email: "", phone: "", company: "", service: "", budget: "", details: "", website: "", parts: [] };

/** Folds the blueprint parts into the details text, so what is sent keeps the same fields. */
const withParts = ({ parts, ...f }) =>
  parts.length
    ? { ...f, details: `${f.details}\n\nShould include: ${PARTS.filter((p) => parts.includes(p.key)).map((p) => p.label).join(", ")}` }
    : f;

const summary = (f) =>
  [
    `Name: ${f.name}`,
    `Email: ${f.email}`,
    `Phone: ${f.phone || "-"}`,
    `Company: ${f.company || "-"}`,
    `Service required: ${f.service}`,
    `Budget: ${f.budget || "-"}`,
    "",
    f.details,
  ].join("\n");

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle"); // idle | sending | sent | failed | handoff
  // set synchronously, so even clicks faster than a re-render cannot start a second request
  const busy = useRef(false);
  // Prerendered HTML ships the button disabled: a tap before hydration would otherwise do a native submit.
  const [ready, setReady] = useState(false);

  // Preselect the service when arriving from a service page (/contact?service=<slug>).
  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- marks hydration complete
    setReady(true);
    const slug = new URLSearchParams(window.location.search).get("service");
    const match = services.find((s) => s.slug === slug);
    // oxlint-disable-next-line react/set-state-in-effect -- read after hydration so server and client markup match
    if (match) setForm((f) => ({ ...f, service: match.title }));
    // Carry over a project description the visitor already typed to Sukaram. Nothing is sent until they submit.
    try {
      const brief = sessionStorage.getItem(BRIEF_KEY);
      // oxlint-disable-next-line react/set-state-in-effect -- same reason as above
      if (brief) setForm((f) => (f.details ? f : { ...f, details: brief }));
    } catch {
      /* storage blocked: the field just starts empty */
    }
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const blur = (k) => () => setErrors((prev) => ({ ...prev, [k]: validate(form)[k] }));

  async function onSubmit(e) {
    e.preventDefault();
    if (busy.current) return; // no second request while one is in flight
    // the blueprint parts are appended to the details on send, so the length limit is checked on that text too
    const found = { ...validate(withParts(form)), ...validate(form) };
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) return document.getElementById(`cf-${first}`)?.focus();
    if (form.website) return; // honeypot: real visitors never see or fill this field

    // Analytics get the chosen service only, never what the visitor typed.
    const lead = { form_name: "project_enquiry", service_name: form.service };
    if (!ENDPOINT) {
      window.open(whatsappLink(`Project enquiry — Codefloor IT\n\n${summary(withParts(form))}`), "_blank", "noopener");
      // Not a lead: we cannot know whether they press send in WhatsApp.
      track("form_submit", { ...lead, submit_method: "whatsapp" });
      return setStatus("handoff");
    }

    busy.current = true;
    setStatus("sending");
    try {
      const { website: _honeypot, ...payload } = withParts(form);
      const res = await fetch(ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(20000), // a hung server ends in the error state, not an endless spinner
      });
      const body = await res.json().catch(() => ({}));
      if (res.status === 422 && body.errors) {
        // the server found something the browser check missed: show it on the field, like any other error
        setErrors(body.errors);
        setStatus("idle");
        return document.getElementById(`cf-${Object.keys(body.errors)[0]}`)?.focus();
      }
      if (!res.ok || !body.ok) throw new Error(`HTTP ${res.status}`);
      track("form_submit", { ...lead, submit_method: "endpoint" });
      // only once the server has emailed it; a repeat of an enquiry already sent is not a new lead
      if (!body.duplicate) track("generate_lead", lead);
      setForm(EMPTY);
      setStatus("sent");
    } catch {
      setStatus("failed");
    } finally {
      busy.current = false;
    }
  }

  const field = (k, label, props = {}, optional = false) => (
    <div className="field">
      <label htmlFor={`cf-${k}`}>
        {label} {optional && <span className="field__opt">(optional)</span>}
      </label>
      <input
        id={`cf-${k}`}
        name={k}
        value={form[k]}
        onChange={set(k)}
        onBlur={blur(k)}
        aria-invalid={errors[k] ? "true" : undefined}
        aria-describedby={errors[k] ? `cf-${k}-err` : undefined}
        required={!optional}
        {...props}
      />
      <FieldError id={`cf-${k}-err`} msg={errors[k]} />
    </div>
  );

  return (
    <form className="cform" method="post" onSubmit={onSubmit} noValidate aria-label="Project enquiry">
      <div className="cform__row">
        {field("name", "Full Name", { autoComplete: "name" })}
        {field("email", "Email", { type: "email", autoComplete: "email", inputMode: "email" })}
      </div>
      <div className="cform__row">
        {field("phone", "Phone Number", { type: "tel", autoComplete: "tel" }, true)}
        {field("company", "Company Name", { autoComplete: "organization" }, true)}
      </div>

      <div className="field">
        <label htmlFor="cf-service">Service Required</label>
        <select
          id="cf-service"
          name="service"
          value={form.service}
          onChange={set("service")}
          onBlur={blur("service")}
          aria-invalid={errors.service ? "true" : undefined}
          aria-describedby={errors.service ? "cf-service-err" : undefined}
          required
        >
          <option value="" disabled>Select a service</option>
          {SERVICE_OPTIONS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
        <FieldError id="cf-service-err" msg={errors.service} />
      </div>

      <div className="field">
        <label htmlFor="cf-budget">
          Project Budget <span className="field__opt">(optional)</span>
        </label>
        <select id="cf-budget" name="budget" value={form.budget} onChange={set("budget")}>
          <option value="">Prefer not to say</option>
          {BUDGETS.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      </div>

      <ProjectBlueprint value={form.parts} onChange={(parts) => setForm((f) => ({ ...f, parts }))} />

      <div className="field">
        <label htmlFor="cf-details">Project Details</label>
        <textarea
          id="cf-details"
          name="details"
          rows={5}
          value={form.details}
          onChange={set("details")}
          onBlur={blur("details")}
          aria-invalid={errors.details ? "true" : undefined}
          aria-describedby={errors.details ? "cf-details-err" : undefined}
          placeholder="What do you want to build, who is it for, and what problem does it solve?"
          required
        />
        <FieldError id="cf-details-err" msg={errors.details} />
      </div>

      {/* Honeypot — hidden from people and assistive tech, tempting to bots. */}
      <div className="cform__hp" aria-hidden="true">
        <label htmlFor="cf-website">Website</label>
        <input id="cf-website" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={set("website")} />
      </div>

      <button type="submit" className="btn btn--primary cform__submit" disabled={!ready || status === "sending"}>
        {status === "sending" ? (
          <><LoaderCircle size={18} className="spin" aria-hidden="true" /> Sending…</>
        ) : (
          <>{ENDPOINT ? "Send Message" : "Send on WhatsApp"} <Send size={18} aria-hidden="true" /></>
        )}
      </button>

      <p className="cform__note">
        We use your details only to reply to your enquiry. See our <Link to="/privacy-policy">privacy policy</Link>.
      </p>

      {!ENDPOINT && (
        <p className="cform__note">
          This opens WhatsApp (run by Meta) with your message filled in. Nothing is sent until you press send there.
        </p>
      )}

      <output className="cform__status">
        <AnimatePresence initial={false}>
        {status === "sent" && (
          <m.p key="sent" {...SLIDE} className="cform__msg cform__msg--ok">
            <CircleCheck size={20} aria-hidden="true" /> Thank you. Your message has been sent and we will reply by email.
          </m.p>
        )}
        {status === "handoff" && (
          <m.p key="handoff" {...SLIDE} className="cform__msg cform__msg--ok">
            <CircleCheck size={20} aria-hidden="true" />
            <span>
              WhatsApp should now be open with your message ready — press send there. If it did not open,{" "}
              <a href={whatsappLink(summary(withParts(form)))} target="_blank" rel="noopener noreferrer">open WhatsApp</a> or email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>.
            </span>
          </m.p>
        )}
        {status === "failed" && (
          <m.p key="failed" {...SLIDE} className="cform__msg cform__msg--err">
            <CircleAlert size={20} aria-hidden="true" />
            <span>
              Sorry, your message could not be sent. Please try again,{" "}
              <a href={whatsappLink(summary(withParts(form)))} target="_blank" rel="noopener noreferrer">send it on WhatsApp</a>, or email{" "}
              <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a> directly.
            </span>
          </m.p>
        )}
        </AnimatePresence>
      </output>
    </form>
  );
}

const SLIDE = { initial: { opacity: 0, y: -6, height: 0 }, animate: { opacity: 1, y: 0, height: "auto" }, exit: { opacity: 0, y: -6, height: 0 }, transition: { duration: 0.25, ease: [0.2, 0.7, 0.2, 1] } };

function FieldError({ id, msg }) {
  return (
    <AnimatePresence initial={false}>
      {msg && (
        <m.p className="field__err" id={id} key="err" {...SLIDE}>
          <CircleAlert size={15} aria-hidden="true" /> {msg}
        </m.p>
      )}
    </AnimatePresence>
  );
}
