import { esc } from "../lib/dom.js";

export function renderHero(c) {
  const p = c.profile;
  const lines = p.nameLines.map((l, i) => `<span class="line"><span data-split="hero" data-letters${i === 1 ? ' class="grad"' : ""} style="--i:${i}">${esc(l)}</span></span>`).join("");
  const avatar = p.photo
    ? `<img src="${esc(p.photo)}" alt="Retrato de ${esc(p.name)}" width="320" height="400" decoding="async" />`
    : `<div class="avatar__mono" aria-hidden="true">${esc(p.initials)}</div>`;
  return `
  <section class="hero" id="top" data-scene="hero" aria-label="Introducción">
    <div class="hero__veil" aria-hidden="true"></div>
    <div class="hero__meta" data-reveal style="--i:1">
      <span>Portafolio ${esc(c.meta.year)}</span>
      <span>${esc(p.role)}</span>
    </div>

    <div class="hero__card-wrap" data-reveal style="--i:3">
      <article class="hero__card glass" data-tilt data-cursor="">
        <div class="avatar">${avatar}<i class="avatar__sheen" aria-hidden="true"></i></div>
        <div class="hero__card-body">
          <p class="eyebrow">${esc(p.role)}</p>
          <h2>${esc(p.name)}</h2>
          <ul class="chips" aria-label="Tecnologías principales">${p.cardStack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul>
          <p class="hero__loc">${p.availability ? `<i class="dot" aria-hidden="true"></i>${esc(p.availability)} · ` : ""}${esc(p.location)}</p>
        </div>
      </article>
    </div>

    <h1 class="hero__name" aria-label="${esc(p.name)}">${lines}</h1>

    <div class="hero__foot">
      <p class="hero__tag" data-reveal style="--i:5">${esc(p.tagline)}</p>
      <a class="hero__scroll" href="#about" data-reveal style="--i:6"><span>${esc(c.labels.scroll)}</span><i aria-hidden="true"></i></a>
    </div>
  </section>`;
}
