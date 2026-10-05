/**
 * Text motion: per-letter reveal, scroll-scrubbed letters, scramble labels and hover "roll".
 *
 *   data-split="chars"   letters rise out of a mask when the element enters the viewport
 *   data-split="scrub"   letters light up with scroll progress (scroll.js writes --p)
 *   data-split="hero"    letters rise after the preloader (CSS keys off html.is-ready)
 *   data-scramble        mono label decodes from random glyphs
 *   data-roll            letters roll upward on hover / focus
 *
 * Splitting only happens when motion is enabled. In reduced mode the text stays as plain
 * text, so nothing can be left hidden. Every split keeps a screen-reader copy of the text.
 */
import { $$, clamp, prefersReducedMotion } from "../lib/dom.js";

const el = (tag, cls, text) => {
  const n = document.createElement(tag);
  if (cls) n.className = cls;
  if (text != null) n.textContent = text;
  return n;
};

/** Replace the element's text with word > char spans (+ an sr-only copy). */
function splitChars(node) {
  if (node.dataset.splitDone) return;
  const text = node.textContent.replace(/\s+/g, " ").trim();
  if (!text) return;
  const words = text.split(" ");
  const total = [...text.replace(/ /g, "")].length;
  const visual = el("span");
  visual.setAttribute("aria-hidden", "true");
  let ci = 0;
  words.forEach((w, wi) => {
    const sw = el("span", "sw");
    for (const ch of w) {
      const sc = el("span", "sc", ch);
      sc.style.setProperty("--ci", ci++);
      sw.append(sc);
    }
    visual.append(sw);
    if (wi < words.length - 1) visual.append(document.createTextNode(" "));
  });
  node.replaceChildren(el("span", "sr-only", text), visual);
  node.style.setProperty("--cn", total);
  // Keep the whole cascade around 0.7s regardless of text length.
  node.style.setProperty("--step", `${clamp(700 / total, 12, 34).toFixed(1)}ms`);
  node.dataset.splitDone = "1";
}

/** Decode-style scramble for short mono labels. */
function scramble(node) {
  const finalText = node.textContent;
  if (!finalText.trim()) return;
  node.setAttribute("aria-label", finalText);
  const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/<>_—";
  const total = 22;
  let frame = 0;
  const tick = () => {
    const settled = Math.floor((frame / total) * finalText.length);
    node.textContent = [...finalText].map((c, i) => (c === " " || i < settled ? c : glyphs[(Math.random() * glyphs.length) | 0])).join("");
    if (++frame <= total) setTimeout(tick, 32);
    else node.textContent = finalText;
  };
  tick();
}

/** Letters that roll upward on hover (two stacked rows, per-letter delay). */
function buildRoll(node) {
  if (node.dataset.rollDone) return;
  const text = node.textContent.trim();
  if (!text) return;
  const wrap = el("span", "ro");
  wrap.setAttribute("aria-hidden", "true");
  [...text].forEach((ch, i) => {
    const rc = el("span", "rc", ch);
    rc.dataset.c = ch;
    rc.style.setProperty("--ci", i);
    wrap.append(rc);
  });
  node.replaceChildren(el("span", "sr-only", text), wrap);
  node.dataset.rollDone = "1";
}

export function initText() {
  if (prefersReducedMotion()) return { destroy() {} };
  const root = document.documentElement;

  const splitTargets = $$("[data-split]");
  splitTargets.forEach(splitChars);

  // Rolling labels: nav links, buttons, social links. Their text lives inside the element itself.
  $$("[data-roll]").forEach(buildRoll);

  // Trigger entrance for "chars" splits and scramble labels when they enter the viewport.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      const t = e.target;
      t.classList.add("is-in");
      if (t.hasAttribute("data-scramble")) scramble(t);
      io.unobserve(t);
    }
  }, { threshold: 0.25, rootMargin: "0px 0px -8% 0px" });
  splitTargets.filter((t) => t.dataset.split === "chars").forEach((t) => io.observe(t));
  $$("[data-scramble]").forEach((t) => io.observe(t));

  // The hero letters wait for the preloader (html.is-ready), handled in CSS.
  void root;
  return { destroy() { io.disconnect(); } };
}
