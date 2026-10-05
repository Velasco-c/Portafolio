import { esc } from "../lib/dom.js";

export function renderExperience(c) {
  const items = c.experience.map((e, i) => `
    <li class="xp__item" data-reveal style="--i:${i}">
      <span class="xp__period">${esc(e.period)}</span>
      <div class="xp__body glass" data-cursor="">
        <h3>${esc(e.role)} <em>@ ${esc(e.company)}</em></h3>
        <p>${esc(e.summary)}</p>
        ${e.highlights?.length ? `<ul>${e.highlights.map((h) => `<li>${esc(h)}</li>`).join("")}</ul>` : ""}
      </div>
    </li>`).join("");
  return `
  <section class="section experience" id="experience" data-scene="experience" aria-labelledby="xp-h">
    <header class="section__head" data-reveal>
      <span class="section__index">02</span>
      <h2 id="xp-h" class="section__label" data-scramble>${esc(c.labels.sections.experience)}</h2>
    </header>
    <div class="xp">
      <div class="xp__rail" aria-hidden="true"><i data-timeline></i></div>
      <ol class="xp__list">${items}</ol>
    </div>
  </section>`;
}
