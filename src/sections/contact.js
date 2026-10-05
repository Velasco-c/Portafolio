import { esc } from "../lib/dom.js";

export function renderContact(c) {
  const k = c.contact;
  return `
  <section class="section contact" id="contact" data-scene="contact" aria-labelledby="contact-h">
    <header class="section__head" data-reveal>
      <span class="section__index">05</span>
      <h2 id="contact-h" class="section__label" data-scramble>${esc(c.labels.sections.contact)}</h2>
    </header>
    <p class="contact__heading" data-split="chars" data-letters>${esc(k.heading)}</p>
    <p class="contact__text" data-reveal style="--i:1">${esc(k.text)}</p>
    <a class="contact__mail grad" href="mailto:${esc(k.email)}" data-split="chars" style="--d:260ms" data-cursor="${esc(k.cta)}">${esc(k.email)}</a>
    <ul class="contact__social" data-reveal style="--i:3">
      ${c.social.map((s) => `<li><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer" data-magnetic data-roll>${esc(s.label)} ↗</a></li>`).join("")}
    </ul>
    <footer class="footer"><span>${esc(c.footer)}</span><span>© ${esc(c.meta.year)}</span></footer>
  </section>`;
}
