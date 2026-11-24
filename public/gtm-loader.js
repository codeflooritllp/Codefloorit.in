// Google Tag Manager (GTM-PB32R9GW), loaded as a file, not inline, because the CSP in vercel.json
// is script-src without 'unsafe-inline'. The only GTM install on the site: add tags in GTM, not here.
// Runs on the live domain only, so local and preview builds send nothing to GA4; GTM Preview
// (Tag Assistant adds ?gtm_debug=...) is let through anywhere for testing.
(function () {
  if (location.hostname !== "codefloorit.in" && !/[?&]gtm_debug=/.test(location.search)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  // gtm.js and the tags it loads are ~150 KB of third-party script: fetch them once the page has
  // loaded and the browser is idle, so they never compete with the page itself. Events pushed to
  // dataLayer before then (page_view, clicks) wait in the queue and are processed when GTM starts.
  var load = function () {
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-PB32R9GW";
    document.head.appendChild(s);
  };
  var later = function () {
    (window.requestIdleCallback || setTimeout)(load, { timeout: 2000 });
  };
  if (document.readyState === "complete") later();
  else addEventListener("load", later, { once: true });
})();
