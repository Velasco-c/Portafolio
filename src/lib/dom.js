// Small shared DOM helpers.
const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
export const esc = (s = "") => String(s).replace(/[&<>"']/g, (c) => ESC[c]);
export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
// Single source of truth for motion. `<html data-motion="full|reduced">` is resolved before first paint
// (see the inline script in index.html): the visitor's explicit choice wins, otherwise the OS setting.
export const prefersReducedMotion = () => {
  const m = document.documentElement.dataset.motion;
  return m ? m === "reduced" : matchMedia("(prefers-reduced-motion: reduce)").matches;
};
export const osPrefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const isFinePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
export const isSmallScreen = () => matchMedia("(max-width: 820px)").matches;
