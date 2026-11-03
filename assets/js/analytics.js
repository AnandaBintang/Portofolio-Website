/* Umami Cloud analytics. Cookieless; Umami itself records country/region/city (from IP, never stored),
   device, browser, referrer, bounce and visit duration. This file adds the custom events.
   Paste your Website ID below. While it is empty nothing loads and window.track is a no-op. */
(() => {
  const WEBSITE_ID = "dcc0861a-0755-4666-b64f-ddfc6c821df0";
  const SRC = "https://cloud.umami.is/script.js";

  window.track = () => {};
  try {
    if (new URLSearchParams(location.search).has("notrack")) localStorage.setItem("notrack", "1");
    if (new URLSearchParams(location.search).get("notrack") === "0") localStorage.removeItem("notrack");
    if (localStorage.getItem("notrack")) return; // visit /?notrack once on your own devices
  } catch (e) {}
  if (!WEBSITE_ID || /^(localhost|127\.|\[::1\])/.test(location.hostname)) return;
  if (navigator.doNotTrack === "1") return;

  const s = document.createElement("script");
  s.defer = true;
  s.src = SRC;
  s.dataset.websiteId = WEBSITE_ID;
  s.dataset.doNotTrack = "true";
  document.head.appendChild(s);

  const send = (name, data) => { try { window.umami && window.umami.track(name, data); } catch (e) {} };
  const seen = new Set();
  window.track = (name, data, once) => {
    const key = once ? name + JSON.stringify(data || {}) : null;
    if (key) { if (seen.has(key)) return; seen.add(key); }
    send(name, data);
  };

  // Clicks on links: CV, contact, social, demo and source links.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a) return;
    const h = a.getAttribute("href");
    if (/\.pdf$/i.test(h)) track("cv-download");
    else if (h.startsWith("mailto:")) track("contact", { via: "email" });
    else if (/linkedin\.com/.test(h)) track("contact", { via: "linkedin" });
    else if (/github\.com\/AnandaBintang\/?$/.test(h)) track("contact", { via: "github" });
    else if (a.closest("#print")) track(a.classList.contains("primary") ? "project-demo" : "project-source", { url: h });
  });

  // Scroll depth, once per milestone.
  const marks = [25, 50, 75, 100];
  addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    if (max <= 0) return;
    const p = (scrollY / max) * 100;
    marks.forEach((m) => { if (p >= m - 1) track("scroll-depth", { percent: m }, true); });
  }, { passive: true });

  // Time actually spent looking at the page (tab visible), reported when the visitor leaves.
  let visible = document.visibilityState === "visible" ? Date.now() : 0, total = 0, sent = false;
  const flush = () => {
    if (visible) { total += Date.now() - visible; visible = 0; }
    if (sent || total < 1000) return;
    sent = true;
    send("engaged-seconds", { seconds: Math.round(total / 1000), bucket: total < 10e3 ? "<10s" : total < 30e3 ? "10-30s" : total < 90e3 ? "30-90s" : total < 300e3 ? "1.5-5min" : "5min+" });
  };
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush();
    else { visible = Date.now(); sent = false; total = 0; }
  });
  addEventListener("pagehide", flush);
})();
