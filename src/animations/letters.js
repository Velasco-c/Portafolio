/**
 * Pointer-reactive letters: glyphs near the cursor lean away and swell slightly.
 * Uses the independent `rotate` / `scale` properties so it composes with the entrance
 * (`transform`) and the scroll scrub (`translate`). Fine pointers only; idle when the
 * cursor is far away or the headline is off-screen.
 */
import { $$, clamp, lerp, isFinePointer, prefersReducedMotion } from "../lib/dom.js";

export function initLetters(selector = "[data-letters]") {
  if (!isFinePointer() || prefersReducedMotion()) return { destroy() {} };
  const groups = $$(selector).map((host) => ({
    host, visible: false,
    chars: $$(".sc", host).map((node) => ({ node, rot: 0, sc: 1 })),
  })).filter((g) => g.chars.length);
  if (!groups.length) return { destroy() {} };

  let mx = -9999, my = -9999, raf = 0;
  const RADIUS = 240;

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) groups.find((g) => g.host === e.target).visible = e.isIntersecting;
  });
  groups.forEach((g) => io.observe(g.host));

  const tick = () => {
    raf = 0;
    let moving = false;
    for (const g of groups) {
      if (!g.visible) continue;
      // read first, write after (one layout pass per group)
      const rects = g.chars.map((c) => c.node.getBoundingClientRect());
      g.chars.forEach((c, i) => {
        const r = rects[i], cx = r.left + r.width / 2, cy = r.top + r.height / 2;
        const dx = mx - cx, dy = my - cy, dist = Math.hypot(dx, dy);
        const f = Math.pow(clamp(1 - dist / RADIUS, 0, 1), 1.6);
        const tr = -clamp(dx / RADIUS, -1, 1) * f * 16, ts = 1 + f * 0.1;
        c.rot = lerp(c.rot, tr, 0.16); c.sc = lerp(c.sc, ts, 0.16);
        if (Math.abs(c.rot - tr) > 0.02 || Math.abs(c.sc - ts) > 0.0005) moving = true;
        c.node.style.rotate = `${c.rot.toFixed(2)}deg`;
        c.node.style.scale = c.sc.toFixed(4);
      });
    }
    if (moving) raf = requestAnimationFrame(tick);
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  const onMove = (e) => { mx = e.clientX; my = e.clientY; kick(); };
  const onLeave = () => { mx = my = -9999; kick(); };
  addEventListener("pointermove", onMove, { passive: true });
  document.addEventListener("pointerleave", onLeave);
  addEventListener("scroll", kick, { passive: true });

  return {
    destroy() {
      removeEventListener("pointermove", onMove); document.removeEventListener("pointerleave", onLeave);
      removeEventListener("scroll", kick); io.disconnect(); cancelAnimationFrame(raf);
    },
  };
}
