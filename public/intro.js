// Brand intro: the markup and the html.has-intro class are in the prerendered homepage
// (scripts/prerender.mjs), and its timeline is CSS. This file only lets any key, click, wheel or
// touch skip it, and removes it when it has played. Loaded async, so it never blocks rendering;
// timings are measured from the start of the page load, since this may run a little late.
(function () {
  try {
    var h = document.documentElement, el = document.querySelector(".intro");
    if (!el) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.remove();
      h.classList.remove("has-intro");
      return;
    }
    var ev = ["pointerdown", "keydown", "wheel", "touchstart"], t;
    var at = function (ms) { return Math.max(0, ms - performance.now()); };
    var done = function () {
      ev.forEach(function (e) { removeEventListener(e, skip, true); });
      el.remove();
    };
    var skip = function () {
      if (h.classList.contains("intro-skip")) return;
      h.classList.add("intro-skip");
      clearTimeout(t);
      t = setTimeout(done, 400);
    };
    ev.forEach(function (e) { addEventListener(e, skip, { capture: true, passive: true }); });
    t = setTimeout(done, at(2600));
    // the hero's entrance is offset while .has-intro is set; drop it once that entrance has finished
    setTimeout(function () { h.classList.remove("has-intro", "intro-skip"); }, at(4300));
  } catch {}
})();
