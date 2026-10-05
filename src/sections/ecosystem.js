import { esc } from "../lib/dom.js";

export function renderEcosystem(c) {
  const e = c.ecosystem;
  return `
  <section class="section ecosystem" id="ecosystem" data-scene="ecosystem" aria-labelledby="eco-h">
    <header class="section__head" data-reveal>
      <span class="section__index">03</span>
      <h2 id="eco-h" class="section__label" data-scramble>${esc(c.labels.sections.ecosystem)}</h2>
    </header>
    <div class="eco__grid">
      <div class="eco__copy">
        <p class="eco__title" data-split="chars">${esc(e.heading)}</p>
        <p class="eco__intro" data-reveal style="--i:1">${esc(e.intro)}</p>
      </div>
      <div class="eco__stage" data-reveal style="--i:2">
        <canvas id="tech-cloud" class="eco__canvas" role="group" tabindex="0" aria-label="Esfera tecnológica 3D interactiva. Usa las flechas para seleccionar una tecnología o pulsa un icono para ver su nombre."></canvas>
        <p id="tech-selection" class="sr-only" aria-live="polite"></p>
        <ul class="sr-only" aria-label="Tecnologías">${c.technologies.map((t) => `<li>${esc(t.name)}</li>`).join("")}</ul>
      </div>
    </div>
  </section>`;
}
