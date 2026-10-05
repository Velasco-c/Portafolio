import { esc } from "../lib/dom.js";

export function renderProjects(c) {
  const L = c.labels;
  const rows = c.projects.map((p, i) => {
    const visual = p.image
      ? `<img class="proj__img" src="${esc(p.image)}" alt="Vista previa de ${esc(p.title)}" loading="lazy" decoding="async" />`
      : `<div class="proj__art" aria-hidden="true"><i></i><i></i><i></i><b>${String(i + 1).padStart(2, "0")}</b></div>`;
    const links = [
      p.links?.live ? `<a href="${esc(p.links.live)}" target="_blank" rel="noopener noreferrer" data-magnetic data-roll>${esc(L.live)} ↗</a>` : "",
      p.links?.repo ? `<a href="${esc(p.links.repo)}" target="_blank" rel="noopener noreferrer" data-magnetic data-roll>${esc(L.code)} ↗</a>` : "",
    ].join("");
    const primary = p.links?.live || p.links?.repo || "";
    return `
    <article class="proj" style="--hue:${Number(p.hue) || 210}">
      <div class="proj__visual glass" data-reveal data-proj data-cursor="${primary ? esc(L.viewProject) : ""}" ${primary ? `data-href="${esc(primary)}"` : ""}>
        <div class="proj__parallax">${visual}</div>
      </div>
      <div class="proj__info">
        <p class="proj__index" data-reveal style="--i:1">${String(i + 1).padStart(2, "0")} / ${String(c.projects.length).padStart(2, "0")}</p>
        <h3 class="proj__title" data-split="chars">${esc(p.title)}</h3>
        <p class="proj__desc" data-reveal style="--i:3">${esc(p.description)}</p>
        <dl class="proj__meta" data-reveal style="--i:4">
          <div><dt>${esc(L.role)}</dt><dd>${esc(p.role)}</dd></div>
          <div><dt>${esc(L.year)}</dt><dd>${esc(p.year)}</dd></div>
        </dl>
        <ul class="chips" aria-label="${esc(L.stack)}" data-reveal style="--i:5">${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
        <div class="proj__links" data-reveal style="--i:6">${links}</div>
      </div>
    </article>`;
  }).join("");
  return `
  <section class="section projects" id="projects" data-scene="projects" aria-labelledby="proj-h">
    <header class="section__head" data-reveal>
      <span class="section__index">04</span>
      <h2 id="proj-h" class="section__label" data-scramble>${esc(L.sections.projects)}</h2>
    </header>
    <div class="proj__list">${rows}</div>
  </section>`;
}
