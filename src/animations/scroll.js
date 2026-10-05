/**
 * Scroll narrative: reveal-on-enter, active scene, reading progress, letter-by-letter scrub,
 * hero exit, project parallax, drawing timeline, mobile menu.
 * Everything animates transform / opacity / CSS custom properties only.
 */
import { $, $$, clamp, prefersReducedMotion } from "../lib/dom.js";

export function initScroll() {
  const root = document.documentElement, reduced = prefersReducedMotion();
  const cleanup = [];

  // Reveal on enter (hero items wait for `is-ready`, set after the preloader).
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
  }, { threshold: 0.08, rootMargin: "0px 0px -8% 0px" });
  $$("[data-reveal]").forEach((el) => (reduced ? el.classList.add("is-in") : io.observe(el)));
  cleanup.push(() => io.disconnect());

  // Active scene + nav highlight.
  const links = new Map($$("[data-nav]").map((a) => [a.dataset.nav, a]));
  const sceneIO = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const scene = e.target.dataset.scene;
      root.dataset.scene = scene;
      links.forEach((a, id) => (id === e.target.id ? a.setAttribute("aria-current", "true") : a.removeAttribute("aria-current")));
    }
  }, { rootMargin: "-45% 0px -45% 0px" });
  $$("[data-scene]").forEach((s) => sceneIO.observe(s));
  cleanup.push(() => sceneIO.disconnect());

  // Scroll-linked bits, batched in one rAF scroll handler. Each block is skipped while off-screen.
  const bar = $(".progress i"), line = $("[data-timeline]"), hero = $(".hero");
  const scrubs = $$("[data-split=\"scrub\"]"), projs = $$("[data-proj]");
  let ticking = false;
  const near = (r, vh) => r.bottom > -vh * 0.5 && r.top < vh * 1.5;
  const update = () => {
    ticking = false;
    const vh = innerHeight, max = document.documentElement.scrollHeight - vh;
    if (bar) bar.style.transform = `scaleX(${max > 0 ? clamp(scrollY / max, 0, 1) : 0})`;

    if (hero && !reduced) {
      const p = clamp(-hero.getBoundingClientRect().top / (vh * 0.9), 0, 1);
      hero.style.setProperty("--hp", p.toFixed(3));
      hero.style.setProperty("--hero-opacity", (1 - p * 0.55).toFixed(3));
    }

    // Letter-by-letter reading scrub: --p runs 0 → 1 while the paragraph crosses the viewport.
    for (const el of scrubs) {
      const r = el.getBoundingClientRect();
      if (!near(r, vh)) continue;
      const p = reduced ? 1 : clamp((vh * 0.86 - r.top) / (r.height + vh * 0.34), 0, 1);
      el.style.setProperty("--p", p.toFixed(4));
    }

    // Project visuals: -1 (entering below) → 0 (centered) → 1 (leaving above); drives parallax.
    if (!reduced) for (const el of projs) {
      const r = el.getBoundingClientRect();
      if (!near(r, vh)) continue;
      el.style.setProperty("--sy", clamp((r.top + r.height / 2 - vh / 2) / (vh / 2 + r.height / 2), -1, 1).toFixed(3));
    }

    if (line) {
      const r = line.parentElement.getBoundingClientRect(), p = clamp((vh * 0.7 - r.top) / r.height, 0, 1);
      line.style.transform = `scaleY(${reduced ? 1 : p.toFixed(3)})`;
    }
  };
  const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener("scroll", onScroll, { passive: true }); addEventListener("resize", onScroll);
  cleanup.push(() => { removeEventListener("scroll", onScroll); removeEventListener("resize", onScroll); });
  update();

  // Mobile menu.
  const toggle = $(".nav__toggle"), menu = $("#menu");
  if (toggle && menu) {
    const set = (open) => {
      toggle.setAttribute("aria-expanded", String(open)); menu.hidden = !open;
      root.classList.toggle("menu-open", open);
      requestAnimationFrame(() => menu.classList.toggle("is-open", open));
    };
    toggle.addEventListener("click", () => set(toggle.getAttribute("aria-expanded") !== "true"));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    addEventListener("keydown", (e) => { if (e.key === "Escape" && !menu.hidden) { set(false); toggle.focus(); } });
  }

  return { destroy() { cleanup.forEach((f) => f()); } };
}
