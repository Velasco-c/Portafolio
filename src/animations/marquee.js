/**
 * Scroll-velocity marquee: base drift + extra speed and a slight skew while scrolling.
 * Runs only while the band is on screen. Reduced motion: the band is static.
 */
import { $, $$, clamp, lerp, prefersReducedMotion } from "../lib/dom.js";

export function initMarquee() {
  const bands = $$("[data-marquee]");
  if (!bands.length || prefersReducedMotion()) return { destroy() {} };

  const state = bands.map((band) => {
    const track = $(".mq__track", band), first = $(".mq__set", track);
    const dir = band.dataset.dir === "right" ? 1 : -1;
    const s = { band, track, first, dir, w: 0, x: 0, visible: false };
    const measure = () => {
      // make sure one set is wider than the viewport so the loop never shows a gap
      while (first.offsetWidth && first.offsetWidth < innerWidth) first.innerHTML += first.innerHTML;
      if (track.children.length < 2) track.append(first.cloneNode(true));
      else track.lastElementChild.innerHTML = first.innerHTML;
      s.w = first.offsetWidth;
      s.x = dir < 0 ? 0 : -s.w;
    };
    measure();
    s.measure = measure;
    return s;
  });

  const io = new IntersectionObserver((entries) => {
    for (const e of entries) state.find((s) => s.band === e.target).visible = e.isIntersecting;
  });
  state.forEach((s) => io.observe(s.band));

  let lastY = scrollY, vel = 0, raf = 0, last = performance.now();
  const loop = (now) => {
    const dt = Math.min(48, now - last) / 16.67; last = now;
    const dy = scrollY - lastY; lastY = scrollY;
    vel = lerp(vel, dy, 0.12);
    for (const s of state) {
      if (!s.visible || !s.w) continue;
      const speed = s.dir * (0.55 + Math.abs(vel) * 0.55) * (vel < -0.5 ? -1 : 1);
      s.x += speed * dt * 1.4;
      if (s.x <= -s.w) s.x += s.w;
      if (s.x >= 0) s.x -= s.w;
      s.track.style.transform = `translate3d(${s.x.toFixed(2)}px,0,0) skewX(${clamp(-vel * 0.35, -9, 9).toFixed(2)}deg)`;
    }
    raf = requestAnimationFrame(loop);
  };
  raf = requestAnimationFrame(loop);

  let rt = 0;
  const onResize = () => { clearTimeout(rt); rt = setTimeout(() => state.forEach((s) => s.measure()), 150); };
  addEventListener("resize", onResize);
  document.fonts?.ready.then(() => state.forEach((s) => s.measure()));

  return { destroy() { cancelAnimationFrame(raf); io.disconnect(); removeEventListener("resize", onResize); } };
}
