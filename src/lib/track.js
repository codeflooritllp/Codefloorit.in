/* Analytics events go into Google Tag Manager's dataLayer (loaded by public/gtm-loader.js);
   GTM decides what reaches GA4. Never put names, emails, phone numbers, message text or
   link URLs with query strings in params: GA4 must not receive personal data. */
export function track(event, params = {}) {
  if (typeof window === "undefined") return;
  (window.dataLayer = window.dataLayer || []).push({ event, ...params });
}

let lastPage = "";

/** One page_view per page; repeat calls for the same path and query (re-renders, hash jumps) are ignored. */
export function trackPage() {
  const { origin, pathname, search } = window.location;
  if (pathname + search === lastPage) return;
  lastPage = pathname + search;
  track("page_view", { page_location: origin + pathname + search, page_title: document.title });
}

const area = (el) =>
  el.closest(".asst") ? "assistant"
  : el.closest(".cform") ? "contact_form"
  : el.closest(".contact__ways") ? "contact_section"
  : el.closest("footer") ? "footer"
  : el.closest(".nav") ? "header"
  : el.closest(".hero, .phero") ? "hero"
  : el.closest(".cta") ? "cta_band"
  : "page";

const ctaType = (path) =>
  path.startsWith("/contact") ? "contact"
  : path.startsWith("/work") ? "portfolio"
  : path.startsWith("/services") ? "services"
  : "other";

/** Contact-link and CTA clicks, from one listener. Runs in the capture phase, before
    the page-exit handler in App can delay the navigation. */
export function trackClicks() {
  window.addEventListener(
    "click",
    (e) => {
      const el = e.target.closest?.("a[href], .btn");
      if (!el) return;
      const href = el.getAttribute("href") ?? "";
      const link_location = area(el);
      if (href.startsWith("tel:")) return track("click_phone", { link_location });
      if (href.startsWith("mailto:")) return track("click_email", { link_location });
      if (/^https:\/\/(wa\.me|api\.whatsapp\.com)\//.test(href)) return track("click_whatsapp", { link_location });
      if (!el.classList.contains("btn") || el.type === "submit") return;
      const path = href ? new URL(href, window.location.href).pathname : "";
      track("cta_click", { cta_text: el.textContent.trim().slice(0, 100), cta_type: ctaType(path), cta_location: link_location });
    },
    true,
  );
}
