import { esc } from "../lib/dom.js";

/** Decorative keyword band. `dir`: "left" | "right". Hidden from assistive tech. */
export function renderMarquee(items = [], dir = "left") {
  if (!items.length) return "";
  const row = items.map((t) => `<span class="mq__item">${esc(t)}</span><i class="mq__dot" aria-hidden="true">✦</i>`).join("");
  return `
  <div class="mq" data-marquee data-dir="${dir}" aria-hidden="true">
    <div class="mq__track"><div class="mq__set">${row}</div></div>
  </div>`;
}
