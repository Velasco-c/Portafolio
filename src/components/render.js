import { portfolio } from '../data/portfolio-data.js';

const icon = (name, size = 20) => `<i data-lucide="${name}" width="${size}" height="${size}" aria-hidden="true"></i>`;
const esc = (value) => String(value).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c]));
const external = (url) => `${esc(url)}" target="_blank" rel="noreferrer"`;

export function renderNavigation() {
  document.querySelector('#site-header').innerHTML = `
    <nav class="nav glass-panel" aria-label="Navegación principal">
      <a class="brand" href="#home" aria-label="Ir al inicio">
        <span class="brand-mark">CT</span><span class="brand-name">Carlos<span>.</span></span>
      </a>
      <div class="nav-links" id="primary-navigation">
        <a href="#about">Sobre mí</a>
        <a href="#stack">Stack</a>
        <a href="#projects">Proyectos</a>
        <a href="#process">Proceso</a>
        <a href="#learning">Aprendiendo</a>
        <a href="#contact">Contacto</a>
      </div>
      <a class="nav-github" href="${external(portfolio.profile.github)}" aria-label="GitHub de Carlos">${icon('github', 18)}</a>
      <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" aria-label="Abrir menú">${icon('menu', 21)}</button>
    </nav>`;
}

export function renderHero() {
  const p = portfolio.profile;
  document.querySelector('#home').innerHTML = `
    <div class="hero-layout">
      <div class="hero-copy reveal">
        <div class="eyebrow"><span class="status-dot"></span>${esc(portfolio.hero.eyebrow)}</div>
        <h1>${esc(portfolio.hero.headline[0])}<br><span>${esc(portfolio.hero.headline[1])}</span><br>${esc(portfolio.hero.headline[2])}</h1>
        <div class="hero-role">${esc(p.title)}</div>
        <p class="hero-description">${esc(portfolio.hero.description)}</p>
        <div class="hero-actions">
          <a class="button button-primary magnetic" href="#projects">Explorar proyectos ${icon('arrow-up-right', 17)}</a>
          <a class="button button-secondary magnetic" href="${external(p.github)}">GitHub ${icon('github', 17)}</a>
        </div>
        <div class="hero-meta">
          <span>${icon('map-pin', 14)} ${esc(p.location)}</span><span class="meta-separator"></span><span>${esc(p.availability)}</span>
        </div>
      </div>
      <div class="hero-stage reveal reveal-delay" aria-label="Resumen técnico de Carlos">
        <div class="hero-orbit orbit-a"></div><div class="hero-orbit orbit-b"></div>
        <div class="hero-card tilt-card glass-panel">
          <div class="hero-card-top"><span class="mono">/developer/profile</span><span class="live"><span></span> disponible</span></div>
          <div class="terminal-window">
            <div class="terminal-head"><span></span><span></span><span></span><small>carlos@portfolio</small></div>
            <div class="terminal-body">
              <div><span class="code-muted">const</span> developer = {</div>
              <div class="indent"><span class="code-key">name</span>: <span class="code-string">'Carlos Velasco'</span>,</div>
              <div class="indent"><span class="code-key">focus</span>: <span class="code-string">'Full Stack'</span>,</div>
              <div class="indent"><span class="code-key">backend</span>: <span class="code-string">'Node.js'</span>,</div>
              <div class="indent"><span class="code-key">database</span>: <span class="code-string">'MySQL'</span>,</div>
              <div class="indent"><span class="code-key">automation</span>: <span class="code-string">'n8n + IA'</span></div>
              <div>};</div>
              <div class="terminal-cursor">_</div>
            </div>
          </div>
          <div class="hero-tech-float float-one">${icon('braces', 16)} JavaScript</div>
          <div class="hero-tech-float float-two">${icon('database', 16)} MySQL</div>
          <div class="hero-tech-float float-three">${icon('server', 16)} Node.js</div>
        </div>
        <div class="stage-caption mono">01 / 08 — software engineering</div>
      </div>
    </div>
    <a class="scroll-cue mono" href="#stack" aria-label="Continuar al stack">SCROLL ${icon('arrow-down', 14)}</a>`;
}

export function renderTech() {
  const makeTrack = (items, reverse = false) => `<div class="marquee ${reverse ? 'reverse' : ''}"><div class="marquee-track">${[...items, ...items].map((t, i) => `<div class="tech-chip tilt-card" data-tech-index="${i}">${icon(t.icon, 18)}<span>${esc(t.name)}</span><small>${esc(t.category)}</small></div>`).join('')}</div></div>`;
  document.querySelector('#stack').innerHTML = `
    <div class="section-intro reveal"><div class="section-kicker">02 / STACK</div><h2>Las herramientas detrás<br><span>de cada solución.</span></h2><p>Un ecosistema técnico que sigo fortaleciendo mediante proyectos y práctica constante.</p></div>
    <div class="tech-marquee-wrap reveal">${makeTrack(portfolio.technologies.slice(0, 6))}${makeTrack(portfolio.technologies.slice(6), true)}</div>
    <div class="stack-note reveal"><span>${icon('layers-3', 16)}</span><p>La herramienta es parte del proceso; los fundamentos y la capacidad de aprender son la base.</p></div>`;
}

export function renderAbout() {
  const imagePath = `${import.meta.env.BASE_URL}${portfolio.about.image}`;

  document.querySelector('#about').innerHTML = `
    <div class="section-intro about-intro reveal">
      <div class="about-heading">
        <div class="section-kicker">03 / SOBRE MÍ</div>

        <h2>${esc(portfolio.about.title)}</h2>

        <div class="about-photo">
          <img
            src="${esc(imagePath)}"
            alt="Fotografía personal de ${esc(portfolio.profile.shortName)}"
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>

      <div class="about-copy">
        <p>${esc(portfolio.about.paragraphs[0])}</p>
        <p>${esc(portfolio.about.paragraphs[1])}</p>
      </div>
    </div>

    <div class="bento-values">
      ${portfolio.about.values.map(
        ([n, title, text], i) => `
          <article class="value-card glass-panel tilt-card reveal ${i === 0 ? 'featured' : ''}">
            <span class="card-number mono">${n}</span>

            <div class="value-icon">
              ${icon(['sparkles', 'brain', 'layers-3', 'file-text'][i], 20)}
            </div>

            <h3>${esc(title)}</h3>
            <p>${esc(text)}</p>
          </article>
        `
      ).join('')}
    </div>

    <div class="competencies reveal">
      <div>
        <div class="section-kicker">04 / COMPETENCIAS</div>

        <h3>
          Lo que busco aportar<br>
          <span>a cada equipo.</span>
        </h3>
      </div>

      <div class="competency-list">
        ${portfolio.competencies.map(
          (item, i) => `
            <div class="competency">
              <span class="mono">0${i + 1}</span>
              <p>${esc(item)}</p>
              ${icon('arrow-up-right', 15)}
            </div>
          `
        ).join('')}
      </div>
    </div>
  `;
}

function projectVisual(type) {
  if (type === 'parking') return `<div class="mock parking-mock"><div class="mock-top"><span>Campus Parking</span><span class="mock-pill">Gestión</span></div><div class="parking-dashboard"><div class="dash-sidebar"><span></span><span></span><span></span><span></span></div><div class="dash-main"><div class="dash-heading"></div><div class="dash-cards"><span></span><span></span><span></span></div><div class="dash-chart"><i></i><i></i><i></i><i></i><i></i><i></i></div></div></div></div>`;
  if (type === 'shop') return `<div class="mock shop-mock"><div class="shop-nav"><span>CampusShop</span><span>${icon('shopping-bag', 15)}</span></div><div class="shop-product"><div class="product-art"></div><div><small>COLECCIÓN</small><strong>Essential</strong><span>Explorar catálogo ${icon('arrow-right', 13)}</span></div></div><div class="shop-dots"><i></i><i></i><i></i></div></div>`;
  return `<div class="mock bot-mock"><div class="bot-head"><span>${icon('bot', 17)}</span><div><strong>TutorBot</strong><small>Asistente académico</small></div><span class="bot-online"></span></div><div class="chat-bubble">Hola, ¿en qué puedo ayudarte?</div><div class="chat-bubble user">Quiero consultar una matrícula.</div><div class="bot-flow"><span>Webhook</span><i></i><span>n8n</span><i></i><span>IA</span></div></div>`;
}

export function renderProjects() {
  document.querySelector('#projects').innerHTML = `
    <div class="section-intro split reveal"><div><div class="section-kicker">05 / PROYECTOS</div><h2>Ideas convertidas<br><span>en sistemas.</span></h2></div><p>Proyectos académicos y personales donde aplico desarrollo web, lógica, persistencia, automatización y buenas prácticas.</p></div>
    <div class="projects-grid">${portfolio.projects.map((p, i) => `<article class="project-card glass-panel tilt-card reveal project-${i + 1}"><div class="project-visual">${projectVisual(p.visual)}<span class="project-index mono">${p.number}</span></div><div class="project-content"><div class="project-type">${esc(p.type)}</div><h3>${esc(p.name)}</h3><p>${esc(p.description)}</p><div class="project-bottom"><div class="stack-tags">${p.stack.map(s => `<span>${esc(s)}</span>`).join('')}</div><a class="icon-link" href="${external(p.github)}" aria-label="Ver ${esc(p.name)} en GitHub">${icon('arrow-up-right', 18)}</a></div></div></article>`).join('')}</div>`;
}

export function renderProcess() {
  document.querySelector('#process').innerHTML = `
    <div class="section-intro reveal"><div class="section-kicker">06 / PROCESO</div><h2>Cómo convierto un<br><span>problema en una solución.</span></h2></div>
    <div class="process-list">${portfolio.process.map(([n, title, text]) => `<article class="process-item reveal"><span class="process-number mono">${n}</span><div class="process-line"><span></span></div><div class="process-copy"><h3>${esc(title)}</h3><p>${esc(text)}</p></div><span class="process-arrow">${icon('arrow-up-right', 18)}</span></article>`).join('')}</div>`;
}

export function renderLearning() {
  document.querySelector('#learning').innerHTML = `
    <div class="learning-layout"><div class="section-intro reveal"><div class="section-kicker">07 / APRENDIENDO</div><h2>Siempre hay otra<br><span>capa que entender.</span></h2><p>Actualmente concentro mi práctica en estas áreas.</p></div><div class="learning-stack">${portfolio.learning.map(([n, title, text]) => `<article class="learning-card glass-panel reveal"><span class="learning-number mono">${n}</span><div><span class="learning-status">ENFOQUE ACTUAL</span><h3>${esc(title)}</h3><p>${esc(text)}</p></div>${icon('arrow-up-right', 18)}</article>`).join('')}</div></div>`;
}

export function renderGithub() {
  document.querySelector('#github').innerHTML = `
    <div class="github-panel glass-panel reveal"><div class="github-copy"><div class="section-kicker">08 / GITHUB</div><h2>El código habla<br><span>por sí mismo.</span></h2><p>${esc(portfolio.githubIntro)}</p><a class="button button-primary magnetic" href="${external(portfolio.profile.github)}">Explorar GitHub ${icon('arrow-up-right', 17)}</a></div><div class="github-art"><div class="github-grid"></div><div class="github-logo">${icon('github', 86)}</div><span class="orbit-label label-a">repositorios</span><span class="orbit-label label-b">aprendizaje</span><span class="orbit-label label-c">proyectos</span></div></div>`;
}

export function renderContact() {
  const p = portfolio.profile;
  document.querySelector('#contact').innerHTML = `
    <div class="contact-panel reveal"><div class="contact-kicker mono">09 / CONTACTO</div><h2>Construyamos algo<br><span>que valga la pena.</span></h2><p>${esc(portfolio.objective)}</p><div class="contact-actions"><a class="button button-primary magnetic" href="mailto:${esc(p.email)}">${icon('mail', 17)} ${esc(p.email)}</a><a class="button button-secondary magnetic" href="${external(p.linkedin)}">LinkedIn ${icon('arrow-up-right', 17)}</a></div><div class="contact-links"><a href="${external(p.github)}">${icon('github', 16)} GitHub</a><a href="mailto:${esc(p.email)}">${icon('mail', 16)} Email</a><a href="${external(p.linkedin)}">${icon('linkedin', 16)} LinkedIn</a></div></div>`;
}

export function renderFooter() {
  const p = portfolio.profile;
  document.querySelector('#site-footer').innerHTML = `<div class="footer-inner"><span>© ${new Date().getFullYear()} ${esc(p.name)}</span><span class="footer-line"></span><span>${esc(p.title)}</span><a href="#home" aria-label="Volver al inicio">${icon('arrow-up', 16)}</a></div>`;
}
