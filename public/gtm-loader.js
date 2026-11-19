// Google Tag Manager (GTM-PB32R9GW), loaded as a file, not inline, because the CSP in vercel.json
// is script-src without 'unsafe-inline'. The only GTM install on the site: add tags in GTM, not here.
// Runs on the live domain only, so local and preview builds send nothing to GA4; GTM Preview
// (Tag Assistant adds ?gtm_debug=...) is let through anywhere for testing.
(function () {
  if (location.hostname !== "codefloorit.in" && !/[?&]gtm_debug=/.test(location.search)) return;
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
  var s = document.createElement("script");
  s.async = true;
  s.src = "https://www.googletagmanager.com/gtm.js?id=GTM-PB32R9GW";
  document.head.appendChild(s);
})();
