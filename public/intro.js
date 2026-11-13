// Brand intro, loaded as a file (not inline) because the CSP in vercel.json is script-src 'self'.
(function () {
  try {
    var h = document.documentElement;
    if (location.pathname !== "/" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    h.classList.add("has-intro");
    document.body.insertAdjacentHTML(
      "afterbegin",
      '<div class="intro" aria-hidden="true"><div class="intro__light"></div><div class="intro__mark">' +
        '<div class="intro__logo"><img src="/logo.webp" width="384" height="172" alt="" decoding="sync" fetchpriority="high" /></div>' +
        '<p class="intro__name">CODEFLOOR IT</p><p class="intro__tag">Build <i>&bull;</i> Innovate <i>&bull;</i> Transform</p></div></div>'
    );
    var el = document.body.firstElementChild, ev = ["pointerdown", "keydown", "wheel", "touchstart"], t;
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
    t = setTimeout(done, 2600);
    // the hero's entrance is offset while .has-intro is set; drop it once that entrance has finished
    setTimeout(function () { h.classList.remove("has-intro", "intro-skip"); }, 4300);
  } catch {}
})();
