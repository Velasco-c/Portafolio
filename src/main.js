import { portfolio as c } from "./content/portfolio.js";
import { $, prefersReducedMotion, osPrefersReducedMotion, isSmallScreen } from "./lib/dom.js";
import { renderNav } from "./sections/nav.js";
import { renderHero } from "./sections/hero.js";
import { renderAbout } from "./sections/about.js";
import { renderExperience } from "./sections/experience.js";
import { renderEcosystem } from "./sections/ecosystem.js";
import { renderProjects } from "./sections/projects.js";
import { renderContact } from "./sections/contact.js";
import { renderMarquee } from "./sections/marquee.js";
import { runPreloader } from "./animations/preloader.js";
import { initScroll } from "./animations/scroll.js";
import { initPointer } from "./animations/pointer.js";
import { initText } from "./animations/text.js";
import { initLetters } from "./animations/letters.js";
import { initMarquee } from "./animations/marquee.js";

const reduced = prefersReducedMotion();
const root = document.documentElement;

// Restore a deliberate theme before any content is rendered to avoid a flash.
let savedTheme = "dark";
try { savedTheme = localStorage.getItem("portfolio-theme") || "dark"; } catch {}
root.dataset.theme = savedTheme === "light" ? "light" : "dark";

// 1 · Render the page from the content file.
document.title = c.meta.title;
$('meta[name="description"]')?.setAttribute("content", c.meta.description);
$("#nav").innerHTML = renderNav(c);
$("#main").innerHTML = [
  renderHero,
  () => renderMarquee(c.marquee?.a, "left"),
  renderAbout, renderExperience, renderEcosystem, renderProjects,
  () => renderMarquee(c.marquee?.b, "right"),
  renderContact,
].map((r) => r(c)).join("");

// 2 · Interaction-driven WebGL fluid (code-split; neutral background remains if unavailable).
const fluidCanvas = $("#fluid");
const lowPower = isSmallScreen() || (navigator.hardwareConcurrency || 4) <= 4;
if (reduced) root.classList.add("no-fluid");
else import("./effects/fluid.js").then(({ initFluid }) => {
  const fx = initFluid(fluidCanvas, { lowPower });
  if (!fx) return root.classList.add("no-fluid");
  fluidCanvas.addEventListener("fluid:lost", () => root.classList.add("no-fluid"));
  root.classList.add("has-fluid");
}).catch(() => root.classList.add("no-fluid"));

// 3 · 3D technology sphere — only loaded when its section approaches the viewport.
const cloudCanvas = $("#tech-cloud");
if (cloudCanvas) {
  const io = new IntersectionObserver(([e]) => {
    if (!e.isIntersecting) return; io.disconnect();
    import("./effects/techCloud.js").then(({ initTechCloud }) =>
      initTechCloud(cloudCanvas, c.technologies, { reducedMotion: reduced }));
  }, { rootMargin: "500px" });
  io.observe(cloudCanvas);
}

// 4 · Interaction + scroll systems, then the preloader hands over to the hero.
initText();      // split letters (skipped in reduced mode) — must run before scroll/pointer read the DOM
initScroll();
initPointer();
initLetters();   // hero + contact letters lean away from the cursor
initMarquee();   // keyword bands that speed up with scroll velocity
const themeToggle = $(".theme-toggle");
const syncThemeControl = () => {
  const light = root.dataset.theme === "light";
  themeToggle?.setAttribute("aria-pressed", String(light));
  const label = light ? c.labels.themeDark : c.labels.themeLight;
  themeToggle?.setAttribute("aria-label", label);
  themeToggle?.setAttribute("title", label);
  $('meta[name="theme-color"]')?.setAttribute("content", light ? "#f1f0ec" : "#08090e");
  const icon = themeToggle?.querySelector("svg");
  if (icon) icon.innerHTML = light
    ? '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>'
    : '<path d="M20.8 13A8.5 8.5 0 0 1 11 3.2 8.6 8.6 0 1 0 20.8 13Z"/>';
};
syncThemeControl();
themeToggle?.addEventListener("click", () => {
  root.dataset.theme = root.dataset.theme === "light" ? "dark" : "light";
  try { localStorage.setItem("portfolio-theme", root.dataset.theme); } catch {}
  syncThemeControl();
});
runPreloader($("#preloader"), c.profile.nameLines, {
  reducedMotion: reduced,
  onReveal: () => root.classList.add("is-ready"),
});

// 5 · Motion control: the visitor can always override the OS setting (stored; reloads to re-split text cleanly).
const motionToggle = $(".motion-toggle");
const setMotion = (mode) => {
  try { localStorage.setItem("portfolio-motion", mode); } catch {}
  location.reload();
};
if (motionToggle) {
  const full = !reduced;
  motionToggle.setAttribute("aria-pressed", String(full));
  const label = full ? c.labels.motionOff : c.labels.motionOn;
  motionToggle.setAttribute("aria-label", label);
  motionToggle.setAttribute("title", label);
  motionToggle.addEventListener("click", () => setMotion(full ? "reduced" : "full"));
}
let hintDismissed = false;
try { hintDismissed = localStorage.getItem("portfolio-motion-hint") === "1"; } catch {}
if (reduced && osPrefersReducedMotion() && root.dataset.motionSource === "system" && !hintDismissed) {
  const toast = document.createElement("div");
  toast.className = "toast"; toast.setAttribute("role", "status");
  toast.innerHTML = `<p>${c.labels.motionNotice}</p><div><button type="button" data-act="on">${c.labels.motionEnable}</button><button type="button" data-act="x" aria-label="${c.labels.dismiss}">✕</button></div>`;
  toast.addEventListener("click", (e) => {
    const act = e.target.closest("button")?.dataset.act;
    if (act === "on") setMotion("full");
    if (act === "x") { try { localStorage.setItem("portfolio-motion-hint", "1"); } catch {} toast.remove(); }
  });
  document.body.append(toast);
}
