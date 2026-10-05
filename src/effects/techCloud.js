/**
 * Interactive 3D technology sphere. Content supplies each local SVG logo; the
 * Fibonacci points keep their perspective, depth sorting, steering and drag inertia.
 */
import { clamp } from "../lib/dom.js";

export function initTechCloud(canvas, items, { reducedMotion = false } = {}) {
  const ctx = canvas.getContext("2d");
  if (!ctx || !items.length) return null;

  let W = 0, H = 0, R = 0, dpr = 1;
  let selected = null, hovered = null, sorted = [];
  const n = items.length;
  const pts = items.map((it, i) => {
    const y = 1 - (i / Math.max(1, n - 1)) * 2;
    const r = Math.sqrt(1 - y * y), th = i * Math.PI * (3 - Math.sqrt(5));
    const point = { it, x: Math.cos(th) * r, y, z: Math.sin(th) * r, sx: 0, sy: 0, s: 1, hitR: 12 };
    if (it.icon) {
      point.image = new Image();
      point.image.onload = () => draw();
      point.image.src = it.icon;
    }
    return point;
  });

  let rotX = -0.25, rotY = 0.4, vx = 0, vy = reducedMotion ? 0 : 0.18;
  const ptr = { x: 0, y: 0, cx: 0, cy: 0, inside: false, down: false, dragged: false, lx: 0, ly: 0, sx: 0, sy: 0 };
  let raf = 0, active = false, last = 0;
  const FOV = 2.6;
  const family = () => getComputedStyle(canvas).getPropertyValue("--font-ui").trim() || "system-ui, sans-serif";
  const palette = () => document.documentElement.dataset.theme === "light"
    ? { ink: "#292b34", ring: "rgba(44,48,62,.13)", tooltip: "rgba(250,249,246,.96)", edge: "rgba(52,57,72,.18)", text: "#252734", iconFilter: "grayscale(1) brightness(.22)" }
    : { ink: "#f4f4f7", ring: "rgba(255,255,255,.12)", tooltip: "rgba(13,15,22,.94)", edge: "rgba(255,255,255,.18)", text: "#f4f4f7", iconFilter: "grayscale(1) brightness(0) invert(1)" };

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = canvas.clientWidth; H = canvas.clientHeight;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    R = Math.min(W, H) * (W < 520 ? 0.36 : 0.38);
    draw();
  }
  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  function project() {
    const cx = Math.cos(rotX), sx = Math.sin(rotX), cy = Math.cos(rotY), sy = Math.sin(rotY);
    for (const p of pts) {
      const x1 = p.x * cy + p.z * sy, z1 = -p.x * sy + p.z * cy;
      const y2 = p.y * cx - z1 * sx, z2 = p.y * sx + z1 * cx;
      const k = FOV / (FOV - z2);
      p.rz = z2; p.s = k; p.sx = W / 2 + x1 * R * k; p.sy = H / 2 + y2 * R * k;
    }
  }

  function drawIcon(p) {
    const depth = (p.rz + 1) / 2;
    const hot = p === selected, over = p === hovered;
    const base = W < 520 ? 23 : 30;
    const size = clamp(base * (0.76 + p.s * 0.2 + depth * 0.12) * (over ? 1.08 : 1) * (hot ? 1.12 : 1), 15, 42);
    p.hitR = Math.max(size * 0.75, 12);
    ctx.save();
    ctx.globalAlpha = hot ? 1 : 0.22 + depth * 0.7;
    ctx.translate(p.sx, p.sy);
    if (hot || over) {
      ctx.shadowColor = hot ? (p.it.color || "#8da6ff") : "rgba(170,190,255,.45)";
      ctx.shadowBlur = hot ? size * 0.42 : size * 0.22;
    }
    if (p.image?.complete && p.image.naturalWidth) {
      const darkMonochrome = !hot && palette().iconFilter;
      const lightLogoOnDark = hot && document.documentElement.dataset.theme === "dark" && ["Next.js", "GitHub"].includes(p.it.name);
      ctx.filter = darkMonochrome || (lightLogoOnDark ? "grayscale(1) brightness(0) invert(1)" : "none");
      ctx.drawImage(p.image, -size / 2, -size / 2, size, size);
      ctx.filter = "none";
    } else {
      ctx.beginPath(); ctx.arc(0, 0, size * 0.32, 0, Math.PI * 2);
      ctx.fillStyle = hot ? (p.it.color || palette().ink) : palette().ink;
      ctx.fill();
    }
    if (hot) {
      ctx.shadowBlur = 0; ctx.lineWidth = 1; ctx.strokeStyle = p.it.color || palette().edge;
      ctx.beginPath(); ctx.arc(0, 0, size * 0.65, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.restore();
  }

  function drawSelection(p) {
    if (!p) return;
    const text = p.it.name, fontSize = 12;
    ctx.save();
    ctx.font = `500 ${fontSize}px ${family()}`;
    const w = ctx.measureText(text).width + 30, h = 28, gap = p.hitR + 9;
    const left = clamp(p.sx < W * 0.64 ? p.sx + gap : p.sx - gap - w, 8, W - w - 8);
    const top = clamp(p.sy - h / 2, 8, H - h - 8);
    ctx.beginPath(); ctx.roundRect(left, top, w, h, h / 2);
    ctx.fillStyle = palette().tooltip; ctx.fill();
    ctx.lineWidth = 1; ctx.strokeStyle = p.it.color || palette().edge; ctx.stroke();
    ctx.beginPath(); ctx.arc(left + 11, top + h / 2, 2.5, 0, Math.PI * 2);
    ctx.fillStyle = p.it.color || palette().ink; ctx.fill();
    ctx.fillStyle = palette().text; ctx.textAlign = "left"; ctx.textBaseline = "middle";
    ctx.fillText(text, left + 19, top + h / 2 + 0.5);
    ctx.restore();
  }

  function draw() {
    if (!W) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    project();
    sorted = [...pts].sort((a, b) => a.rz - b.rz);
    ctx.save();
    ctx.strokeStyle = palette().ring;
    ctx.beginPath();
    ctx.ellipse(W / 2, H / 2, R * 1.05, R * 1.05 * Math.abs(Math.sin(rotX + 0.9)) * 0.35 + 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    for (const p of sorted) drawIcon(p);
    drawSelection(selected);
  }

  function pick() {
    hovered = null;
    if (!ptr.inside) return;
    for (let i = sorted.length - 1; i >= 0; i--) {
      const p = sorted[i];
      if (p.rz < -0.32) continue;
      if (Math.hypot(ptr.x - p.sx, ptr.y - p.sy) <= p.hitR) { hovered = p; break; }
    }
    canvas.style.cursor = hovered ? "pointer" : ptr.down ? "grabbing" : "grab";
  }

  function announceSelection(message = selected ? `Se seleccionó ${selected.it.name}` : "Se canceló la selección de tecnología") {
    const live = document.querySelector("#tech-selection");
    if (live) live.textContent = message;
  }

  function tick(now) {
    if (!active) return;
    raf = requestAnimationFrame(tick);
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    if (!reducedMotion) {
      if (ptr.inside && !ptr.down) {
        const tx = clamp(-ptr.cy / (H / 2), -1, 1) * 0.55, ty = clamp(ptr.cx / (W / 2), -1, 1) * 0.9;
        vx += (tx - vx) * Math.min(1, dt * 2.2); vy += (ty - vy) * Math.min(1, dt * 2.2);
      } else if (!ptr.down) {
        vx *= 1 - Math.min(1, dt * 1.5); vy += (0.18 - vy) * Math.min(1, dt * 1.2);
      }
      rotX += vx * dt; rotY += vy * dt; rotX = clamp(rotX, -1.2, 1.2);
    }
    pick(); draw();
  }

  const local = (e) => {
    const r = canvas.getBoundingClientRect();
    ptr.x = e.clientX - r.left; ptr.y = e.clientY - r.top;
    return r;
  };
  const onMove = (e) => {
    const r = local(e);
    ptr.inside = true;
    if (ptr.down) {
      const dx = e.clientX - ptr.lx, dy = e.clientY - ptr.ly;
      if (Math.hypot(e.clientX - ptr.sx, e.clientY - ptr.sy) > 5) ptr.dragged = true;
      if (ptr.dragged) {
        rotY += dx * 0.008; rotX = clamp(rotX - dy * 0.008, -1.2, 1.2);
        vy = dx * 0.4; vx = -dy * 0.4;
      }
      ptr.lx = e.clientX; ptr.ly = e.clientY;
    }
    ptr.cx = ptr.x - r.width / 2; ptr.cy = ptr.y - r.height / 2;
    pick();
    if (reducedMotion) draw();
  };
  const onDown = (e) => {
    if (ptr.down) return;
    local(e); ptr.inside = true; ptr.down = true; ptr.dragged = false;
    ptr.sx = ptr.lx = e.clientX; ptr.sy = ptr.ly = e.clientY;
    pick();
    canvas.setPointerCapture?.(e.pointerId);
  };
  const onUp = (e) => {
    if (!ptr.down) return;
    local(e);
    if (!ptr.dragged) {
      pick();
      selected = hovered === selected ? null : hovered;
      announceSelection();
      draw();
    }
    ptr.down = false;
    canvas.releasePointerCapture?.(e.pointerId);
  };
  const onCancel = (e) => { ptr.down = false; canvas.releasePointerCapture?.(e.pointerId); };
  const onLeave = () => {
    if (ptr.down) return;
    ptr.inside = false; hovered = null; canvas.style.cursor = "";
    if (reducedMotion) draw();
  };
  const onKey = (e) => {
    if (e.key === "Escape") {
      if (!selected) return;
      selected = null; announceSelection(); draw(); e.preventDefault(); return;
    }
    if (["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp", "Enter", " "].includes(e.key)) {
      const front = sorted.filter((p) => p.rz > -0.32);
      if (!front.length) return;
      const step = e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 1;
      const current = front.indexOf(selected);
      selected = e.key === "Enter" || e.key === " "
        ? (selected ? null : front.at(0))
        : front[(current + step + front.length) % front.length];
      announceSelection(); draw(); e.preventDefault();
    }
  };
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerdown", onDown);
  canvas.addEventListener("pointerup", onUp);
  canvas.addEventListener("pointercancel", onCancel);
  canvas.addEventListener("pointerleave", onLeave);
  canvas.addEventListener("keydown", onKey);
  canvas.style.touchAction = "pan-y";

  const io = new IntersectionObserver(([e]) => {
    if (e.isIntersecting && !reducedMotion) {
      if (!active) { active = true; last = performance.now(); raf = requestAnimationFrame(tick); }
    } else {
      active = false; cancelAnimationFrame(raf);
    }
    if (e.isIntersecting && reducedMotion) draw();
  }, { rootMargin: "100px" });
  io.observe(canvas);
  const themeObserver = new MutationObserver(draw);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  document.fonts?.ready.then(draw);

  return {
    destroy() {
      active = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); themeObserver.disconnect();
      canvas.removeEventListener("pointermove", onMove); canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointerup", onUp); canvas.removeEventListener("pointercancel", onCancel);
      canvas.removeEventListener("pointerleave", onLeave); canvas.removeEventListener("keydown", onKey);
    },
  };
}
