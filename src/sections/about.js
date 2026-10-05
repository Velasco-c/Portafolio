import { esc } from "../lib/dom.js";

export function renderAbout(c) {
  const a = c.about;
  return `
  <section class="section about" id="about" data-scene="about" aria-labelledby="about-h">
    <header class="section__head" data-reveal>
      <span class="section__index">01</span>
      <h2 id="about-h" class="section__label" data-scramble>${esc(c.labels.sections.about)}</h2>
    </header>
    <div class="about__grid">
      <p class="about__lead" data-split="scrub">${esc(a.lead)}</p>
      <div class="about__side">
        <h3 class="about__title" data-split="chars">${esc(a.heading)}</h3>
        ${a.paragraphs.map((t, i) => `<p data-reveal style="--i:${i + 1}">${esc(t)}</p>`).join("")}
        <dl class="facts" data-reveal style="--i:3">
          ${a.facts.map((f) => `<div><dt>${esc(f.label)}</dt><dd>${esc(f.value)}</dd></div>`).join("")}
        </dl>
        ${a.resume ? `<a class="btn" href="${esc(a.resume)}" data-magnetic data-roll data-reveal style="--i:4">${esc(c.labels.resume)}</a>` : ""}
      </div>
    </div>
  </section>`;
}
