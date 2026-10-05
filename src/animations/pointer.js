/**
 * Pointer-reactive layer: glass light/border following the cursor, tilt on [data-tilt],
 * magnetic [data-magnetic], contextual cursor and project-visual parallax.
 * Only transform / opacity / CSS custom properties are animated. Fine pointers only.
 */
import { $, $$, clamp, lerp, isFinePointer, prefersReducedMotion } from "../lib/dom.js";

export function initPointer() {
  const fine = isFinePointer(), reduced = prefersReducedMotion();
  const cleanup = [];
  const on = (t, ev, fn, o) => { t.addEventListener(ev, fn, o); cleanup.push(() => t.removeEventListener(ev, fn, o)); };
  if (!fine) return { destroy() {} };

  // ── glass light + border follows the pointer (delegated, rAF-batched) ──
  let raf = 0, ev = null, px = innerWidth / 2, py = innerHeight / 2;
  let targetX = px, targetY = py, fieldX = px, fieldY = py, targetVx = 0, targetVy = 0, energy = 0;
  const flush = () => {
    raf = 0;
    if (ev) {
      const nextX = ev.clientX, nextY = ev.clientY;
      targetVx = nextX - px; targetVy = nextY - py;
      targetX = nextX; targetY = nextY;
      energy = Math.min(1, Math.hypot(targetVx, targetVy) / 45);
      px = nextX; py = nextY;
      const t = ev.target.closest?.(".glass");
      if (t) {
        const r = t.getBoundingClientRect();
        t.style.setProperty("--gx", `${ev.clientX - r.left}px`); t.style.setProperty("--gy", `${ev.clientY - r.top}px`);
      }
      ev = null;
    }
    fieldX = lerp(fieldX, targetX, 0.28); fieldY = lerp(fieldY, targetY, 0.28);
    const root = document.documentElement;
    root.style.setProperty("--mouse-x", `${fieldX.toFixed(1)}px`);
    root.style.setProperty("--mouse-y", `${fieldY.toFixed(1)}px`);
    root.style.setProperty("--mouse-vx", `${targetVx.toFixed(1)}px`);
    root.style.setProperty("--mouse-vy", `${targetVy.toFixed(1)}px`);
    root.style.setProperty("--mouse-energy", energy.toFixed(3));
    targetVx *= 0.65; targetVy *= 0.65; energy *= 0.91;
    if (energy > 0.012 || Math.hypot(fieldX - targetX, fieldY - targetY) > 0.5) raf = requestAnimationFrame(flush);
  };
  on(document, "pointermove", (e) => { ev = e; if (!raf) raf = requestAnimationFrame(flush); }, { passive: true });

  // ── 3D tilt on the hero card ──
  $$("[data-tilt]").forEach((el) => {
    let tx = 0, ty = 0, cx = 0, cy = 0, id = 0;
    const loop = () => {
      cx = lerp(cx, tx, 0.12); cy = lerp(cy, ty, 0.12);
      el.style.setProperty("--rx", `${(-cy * 7).toFixed(2)}deg`); el.style.setProperty("--ry", `${(cx * 9).toFixed(2)}deg`);
      el.style.setProperty("--tx", `${(cx * 8).toFixed(1)}px`); el.style.setProperty("--ty", `${(cy * 8).toFixed(1)}px`);
      id = Math.abs(cx - tx) + Math.abs(cy - ty) > 0.001 ? requestAnimationFrame(loop) : 0;
    };
    const kick = () => { if (!id) id = requestAnimationFrame(loop); };
    on(el, "pointermove", (e) => {
      if (reduced) return;
      const r = el.getBoundingClientRect();
      tx = clamp((e.clientX - r.left) / r.width - 0.5, -0.5, 0.5) * 2; ty = clamp((e.clientY - r.top) / r.height - 0.5, -0.5, 0.5) * 2; kick();
    });
    on(el, "pointerleave", () => { tx = 0; ty = 0; kick(); });
    cleanup.push(() => cancelAnimationFrame(id));
  });

  // ── magnetic controls ──
  if (!reduced) $$("[data-magnetic]").forEach((el) => {
    on(el, "pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate3d(${((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1)}px, ${((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1)}px, 0)`;
    });
    on(el, "pointerleave", () => { el.style.transform = ""; });
  });

  // ── project visuals: layered parallax + click-through ──
  $$("[data-proj]").forEach((el) => {
    const inner = $(".proj__parallax", el);
    if (!reduced) {
      on(el, "pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3)); el.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
      });
      on(el, "pointerleave", () => { el.style.setProperty("--px", 0); el.style.setProperty("--py", 0); });
    }
    const href = el.dataset.href;
    if (href) { el.style.cursor = "pointer"; on(el, "click", () => window.open(href, "_blank", "noopener")); }
    void inner;
  });

  // ── contextual cursor ──
  const cur = $(".cursor");
  if (cur) {
    const label = $("span", cur);
    let x = innerWidth / 2, y = innerHeight / 2, cxp = x, cyp = y, shown = false, id = 0;
    const loop = () => {
      cxp = reduced ? x : lerp(cxp, x, 0.2); cyp = reduced ? y : lerp(cyp, y, 0.2);
      cur.style.transform = `translate3d(${cxp}px, ${cyp}px, 0)`;
      id = Math.hypot(cxp - x, cyp - y) > 0.25 ? requestAnimationFrame(loop) : 0;
    };
    on(document, "pointermove", (e) => {
      x = e.clientX; y = e.clientY;
      if (!shown) { shown = true; cxp = x; cyp = y; cur.classList.add("is-on"); }
      if (!id) id = requestAnimationFrame(loop);
      const t = e.target.closest?.("a, button, [data-cursor], [data-magnetic]");
      const text = t?.dataset?.cursor || "";
      cur.classList.toggle("is-link", !!t && !text); cur.classList.toggle("is-label", !!text);
      if (label.textContent !== text) label.textContent = text;
    }, { passive: true });
    on(document, "pointerleave", () => { shown = false; cur.classList.remove("is-on"); });
    cleanup.push(() => cancelAnimationFrame(id));
  }

  return { destroy() { cleanup.forEach((f) => f()); cancelAnimationFrame(raf); } };
}
