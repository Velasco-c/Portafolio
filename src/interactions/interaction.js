export function initInteractions() {
  initMenu();
  initSmoothScroll();
  initReveal();
  initSpotlight();
  initTilt();
  initMagnetic();
  initNavState();
  initHeader();
  initYear();
}

function initMenu() {
  const button = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('.nav-links');
  if (!button || !navigation) return;

  const close = () => {
    navigation.classList.remove('open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menú');
    button.innerHTML = '<i data-lucide="menu" width="21" height="21" aria-hidden="true"></i>';
    window.lucide?.createIcons();
  };

  button.addEventListener('click', () => {
    const open = button.getAttribute('aria-expanded') === 'true';
    if (open) close();
    else {
      navigation.classList.add('open');
      button.setAttribute('aria-expanded', 'true');
      button.setAttribute('aria-label', 'Cerrar menú');
      button.innerHTML = '<i data-lucide="x" width="21" height="21" aria-hidden="true"></i>';
      window.lucide?.createIcons();
    }
  });

  navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', close));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
}

function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((link) => link.addEventListener('click', (event) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
  }));
}

function initReveal() {
  const elements = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elements.forEach((element) => element.classList.add('visible'));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  }), { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
  elements.forEach((element) => observer.observe(element));
}

function initSpotlight() {
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const root = document.documentElement;
  let x = innerWidth / 2;
  let y = innerHeight / 2;
  let tx = x;
  let ty = y;
  let frame = 0;
  addEventListener('pointermove', (event) => {
    tx = event.clientX;
    ty = event.clientY;
    if (frame) return;
    frame = requestAnimationFrame(() => {
      x += (tx - x) * 0.14;
      y += (ty - y) * 0.14;
      root.style.setProperty('--mx', `${x}px`);
      root.style.setProperty('--my', `${y}px`);
      frame = 0;
    });
  }, { passive: true });
}

function initTilt() {
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.tilt-card').forEach((card) => {
    let frame = 0;
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        card.style.setProperty('--rx', `${-y * 4}deg`);
        card.style.setProperty('--ry', `${x * 5}deg`);
        card.style.setProperty('--px', `${(x + 0.5) * 100}%`);
        card.style.setProperty('--py', `${(y + 0.5) * 100}%`);
        card.classList.add('tilting');
      });
    }, { passive: true });
    card.addEventListener('pointerleave', () => {
      card.classList.remove('tilting');
      card.style.setProperty('--rx', '0deg');
      card.style.setProperty('--ry', '0deg');
      card.style.setProperty('--px', '50%');
      card.style.setProperty('--py', '50%');
    });
  });
}

function initMagnetic() {
  if (matchMedia('(pointer: coarse)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('.magnetic').forEach((element) => {
    element.addEventListener('pointermove', (event) => {
      const rect = element.getBoundingClientRect();
      const x = event.clientX - rect.left - rect.width / 2;
      const y = event.clientY - rect.top - rect.height / 2;
      element.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px)`;
    }, { passive: true });
    element.addEventListener('pointerleave', () => { element.style.transform = ''; });
  });
}

function initNavState() {
  const links = [...document.querySelectorAll('.nav-links a')];
  const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) links.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
  }), { rootMargin: '-35% 0px -55% 0px' });
  sections.forEach((section) => observer.observe(section));
}

function initHeader() {
  const header = document.querySelector('.nav');
  if (!header) return;
  const update = () => header.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', update, { passive: true });
  update();
}

function initYear() {
  document.querySelectorAll('[data-current-year]').forEach((element) => { element.textContent = new Date().getFullYear(); });
}
