import { esc } from "../lib/dom.js";

export function renderNav(c) {
  const links = c.nav.map((n) => `<a href="#${esc(n.id)}" data-nav="${esc(n.id)}" data-roll>${esc(n.label)}</a>`).join("");
  return `
    <a class="skip" href="#main">${esc(c.labels.skip)}</a>
    <div class="nav__bar glass">
      <a class="nav__brand" href="#top" aria-label="${esc(c.profile.name)} — inicio"><span>${esc(c.profile.initials)}</span></a>
      <nav class="nav__links" aria-label="Navegación principal">${links}</nav>
      <div class="nav__actions">
        <button class="motion-toggle" type="button" aria-pressed="false" data-magnetic><i aria-hidden="true"></i><span>FX</span></button>
        <button class="theme-toggle" type="button" aria-label="${esc(c.labels.themeLight)}" aria-pressed="false" title="${esc(c.labels.themeLight)}" data-magnetic>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v2m0 14v2M3 12h2m14 0h2M5.64 5.64l1.42 1.42m9.88 9.88 1.42 1.42m0-12.72-1.42 1.42m-9.88 9.88-1.42 1.42M12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10Z"/></svg>
        </button>
        <button class="nav__toggle" type="button" aria-expanded="false" aria-controls="menu" data-magnetic>${esc(c.labels.menu)}</button>
      </div>
    </div>
    <div class="menu" id="menu" hidden>
      <nav aria-label="Navegación móvil">${c.nav.map((n, i) => `<a href="#${esc(n.id)}" style="--i:${i}"><small>0${i + 1}</small>${esc(n.label)}</a>`).join("")}</nav>
    </div>
    <div class="progress" aria-hidden="true"><i></i></div>`;
}
