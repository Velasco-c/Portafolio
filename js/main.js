/* =========================================================
   PORTAFOLIO — INTERACCIONES PRINCIPALES
   ========================================================= */

(() => {
    "use strict";

    /* =========================================================
       ELEMENTOS Y ESTADO
       ========================================================= */

    const root = document.documentElement;
    const body = document.body;

    const state = {
        effectsEnabled:
            localStorage.getItem("portfolio-effects") !== "off",

        reducedMotion: window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches,

        isTouchDevice: window.matchMedia(
            "(hover: none), (pointer: coarse)"
        ).matches,

        lastScrollY: window.scrollY
    };

    const SELECTORS = {
        navbar: ".navbar",

        menuToggle: ".navbar-toggle",
        menu: ".navbar-menu",
        navLinks: ".nav-link",

        sections: ".section[id]",

        reveal: "[data-reveal]",
        staggerGroup: "[data-stagger]",

        cards:
            ".technology-card, .skill-card, .learning-card",

        tilt: "[data-tilt]",
        magnetic: "[data-magnetic]",
        parallax: "[data-parallax]",
        imageTilt: "[data-image-tilt]",

        backTop: ".back-to-top",
        effectsToggle: ".effects-toggle",

        projectTrigger: "[data-project-open]",
        projectPanel: "[data-project-panel]",
        projectClose: "[data-project-close]",

        customCursor: ".custom-cursor",
        cursorDot: ".custom-cursor-dot",
        cursorRing: ".custom-cursor-ring",

        mail: "[data-mail]"
    };

    /* =========================================================
       UTILIDADES
       ========================================================= */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const clamp = (value, min, max) =>
        Math.min(Math.max(value, min), max);

    const effectsAllowed = () =>
        state.effectsEnabled &&
        !state.reducedMotion &&
        !state.isTouchDevice;

    /* =========================================================
       EFECTOS
       ========================================================= */

    function updateEffectsState() {
        body.classList.toggle(
            "effects-disabled",
            !state.effectsEnabled
        );

        root.dataset.effects = state.effectsEnabled
            ? "on"
            : "off";

        const toggle = $(SELECTORS.effectsToggle);

        if (!toggle) return;

        toggle.setAttribute(
            "aria-pressed",
            String(state.effectsEnabled)
        );

        const label = toggle.querySelector(
            ".effects-toggle-state"
        );

        if (label) {
            label.textContent = state.effectsEnabled
                ? "ON"
                : "OFF";
        }
    }

    function initializeEffects() {
        updateEffectsState();

        const toggle = $(SELECTORS.effectsToggle);

        if (!toggle) return;

        toggle.addEventListener("click", () => {
            state.effectsEnabled = !state.effectsEnabled;

            localStorage.setItem(
                "portfolio-effects",
                state.effectsEnabled ? "on" : "off"
            );

            updateEffectsState();
        });
    }

    /* =========================================================
       NAVBAR
       ========================================================= */

    function initializeNavbar() {
        const navbar = $(SELECTORS.navbar);

        if (!navbar) return;

        const update = () => {
            navbar.classList.toggle(
                "is-scrolled",
                window.scrollY > 30
            );
        };

        update();

        window.addEventListener("scroll", update, {
            passive: true
        });
    }

    /* =========================================================
       MENÚ MÓVIL
       ========================================================= */

    function initializeMobileMenu() {
        const navbar = $(SELECTORS.navbar);
        const toggle = $(SELECTORS.menuToggle);
        const menu = $(SELECTORS.menu);

        if (!navbar || !toggle || !menu) return;

        const closeMenu = () => {
            navbar.classList.remove("menu-open");
            menu.classList.remove("is-open");

            toggle.setAttribute(
                "aria-expanded",
                "false"
            );

            body.classList.remove("menu-open");
        };

        const openMenu = () => {
            navbar.classList.add("menu-open");
            menu.classList.add("is-open");

            toggle.setAttribute(
                "aria-expanded",
                "true"
            );

            body.classList.add("menu-open");
        };

        toggle.addEventListener("click", () => {
            const isOpen =
                menu.classList.contains("is-open");

            if (isOpen) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        $$(SELECTORS.navLinks).forEach(link => {
            link.addEventListener("click", closeMenu);
        });

        document.addEventListener("keydown", event => {
            if (event.key === "Escape") {
                closeMenu();
            }
        });

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                closeMenu();
            }
        });
    }

    /* =========================================================
       NAVEGACIÓN ACTIVA
       ========================================================= */

    function initializeActiveSection() {
        const links = $$(SELECTORS.navLinks);
        const sections = $$(SELECTORS.sections);

        if (!links.length || !sections.length) return;

        const linkMap = new Map();

        links.forEach(link => {
            const href = link.getAttribute("href");

            if (!href || !href.startsWith("#")) return;

            linkMap.set(
                href.substring(1),
                link
            );
        });

        const observer = new IntersectionObserver(
            entries => {
                entries.forEach(entry => {
                    if (!entry.isIntersecting) return;

                    links.forEach(link => {
                        link.classList.remove(
                            "is-active"
                        );

                        link.removeAttribute(
                            "aria-current"
                        );
                    });

                    const activeLink =
                        linkMap.get(entry.target.id);

                    if (!activeLink) return;

                    activeLink.classList.add(
                        "is-active"
                    );

                    activeLink.setAttribute(
                        "aria-current",
                        "page"
                    );
                });
            },
            {
                rootMargin:
                    "-35% 0px -55% 0px",
                threshold: 0
            }
        );

        sections.forEach(section =>
            observer.observe(section)
        );
    }

    /* =========================================================
       SCROLL PROGRESS
       ========================================================= */

    function initializeScrollProgress() {
        let progress =
            $(".scroll-progress");

        if (!progress) {
            progress =
                document.createElement("div");

            progress.className =
                "scroll-progress";

            progress.setAttribute(
                "aria-hidden",
                "true"
            );

            body.appendChild(progress);
        }

        const update = () => {
            const documentHeight =
                document.documentElement
                    .scrollHeight;

            const viewportHeight =
                window.innerHeight;

            const scrollableHeight =
                documentHeight -
                viewportHeight;

            const percentage =
                scrollableHeight > 0
                    ? (window.scrollY /
                          scrollableHeight) *
                      100
                    : 0;

            progress.style.setProperty(
                "--scroll-progress",
                `${clamp(
                    percentage,
                    0,
                    100
                )}%`
            );
        };

        update();

        window.addEventListener(
            "scroll",
            update,
            { passive: true }
        );

        window.addEventListener(
            "resize",
            update,
            { passive: true }
        );
    }

    /* =========================================================
       REVEAL
       ========================================================= */

    function initializeRevealAnimations() {
        const elements =
            $$(SELECTORS.reveal);

        if (!elements.length) return;

        if (state.reducedMotion) {
            elements.forEach(element => {
                element.classList.add(
                    "is-visible"
                );
            });

            return;
        }

        const observer =
            new IntersectionObserver(
                entries => {
                    entries.forEach(entry => {
                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }

                        entry.target.classList.add(
                            "is-visible"
                        );

                        observer.unobserve(
                            entry.target
                        );
                    });
                },
                {
                    threshold: 0.12,
                    rootMargin:
                        "0px 0px -60px"
                }
            );

        elements.forEach(element =>
            observer.observe(element)
        );
    }

    /* =========================================================
       STAGGER
       ========================================================= */

    function initializeStagger() {
        const groups =
            $$(SELECTORS.staggerGroup);

        groups.forEach(group => {
            [...group.children].forEach(
                (child, index) => {
                    child.style.setProperty(
                        "--stagger-delay",
                        `${index * 70}ms`
                    );
                }
            );
        });
    }

    /* =========================================================
       SPOTLIGHT DE TARJETAS
       ========================================================= */

    function initializeCardSpotlight() {
        if (!effectsAllowed()) return;

        const cards =
            $$(SELECTORS.cards);

        cards.forEach(card => {
            card.addEventListener(
                "pointermove",
                event => {
                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left;

                    const y =
                        event.clientY -
                        rect.top;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}px`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}px`
                    );
                },
                { passive: true }
            );
        });
    }

    /* =========================================================
       CURSOR
       ========================================================= */

    function initializeCursor() {
        if (!effectsAllowed()) return;

        const cursor =
            $(SELECTORS.customCursor);

        const dot =
            $(SELECTORS.cursorDot);

        const ring =
            $(SELECTORS.cursorRing);

        if (!cursor || !dot || !ring) return;

        let mouseX = -100;
        let mouseY = -100;

        let ringX = -100;
        let ringY = -100;

        const animate = () => {
            ringX +=
                (mouseX - ringX) * 0.15;

            ringY +=
                (mouseY - ringY) * 0.15;

            dot.style.transform =
                `translate3d(
                    ${mouseX}px,
                    ${mouseY}px,
                    0
                ) translate(-50%, -50%)`;

            ring.style.transform =
                `translate3d(
                    ${ringX}px,
                    ${ringY}px,
                    0
                ) translate(-50%, -50%)`;

            requestAnimationFrame(
                animate
            );
        };

        window.addEventListener(
            "pointermove",
            event => {
                mouseX = event.clientX;
                mouseY = event.clientY;
            },
            { passive: true }
        );

        const interactiveElements =
            $$(
                "a, button, input, textarea, select"
            );

        interactiveElements.forEach(
            element => {
                element.addEventListener(
                    "mouseenter",
                    () => {
                        body.classList.add(
                            "cursor-hover"
                        );
                    }
                );

                element.addEventListener(
                    "mouseleave",
                    () => {
                        body.classList.remove(
                            "cursor-hover"
                        );
                    }
                );
            }
        );

        document.addEventListener(
            "mouseleave",
            () => {
                cursor.style.opacity = "0";
            }
        );

        document.addEventListener(
            "mouseenter",
            () => {
                cursor.style.opacity = "1";
            }
        );

        animate();
    }

    /* =========================================================
       TILT
       ========================================================= */

    function initializeTilt() {
        if (!effectsAllowed()) return;

        const elements =
            $$(SELECTORS.tilt);

        elements.forEach(element => {
            let frame = null;

            let targetX = 0;
            let targetY = 0;

            let currentX = 0;
            let currentY = 0;

            const render = () => {
                frame = null;

                currentX +=
                    (targetX - currentX) *
                    0.15;

                currentY +=
                    (targetY - currentY) *
                    0.15;

                element.style.transform =
                    `perspective(1000px)
                     rotateX(${currentY}deg)
                     rotateY(${currentX}deg)
                     translateZ(0)`;

                if (
                    Math.abs(
                        targetX - currentX
                    ) > 0.01 ||
                    Math.abs(
                        targetY - currentY
                    ) > 0.01
                ) {
                    frame =
                        requestAnimationFrame(
                            render
                        );
                }
            };

            element.addEventListener(
                "pointermove",
                event => {
                    const rect =
                        element.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                            rect.width -
                        0.5;

                    const y =
                        (event.clientY -
                            rect.top) /
                            rect.height -
                        0.5;

                    targetX = clamp(
                        x * 6,
                        -6,
                        6
                    );

                    targetY = clamp(
                        y * -6,
                        -6,
                        6
                    );

                    if (!frame) {
                        frame =
                            requestAnimationFrame(
                                render
                            );
                    }
                },
                { passive: true }
            );

            element.addEventListener(
                "pointerleave",
                () => {
                    targetX = 0;
                    targetY = 0;

                    if (!frame) {
                        frame =
                            requestAnimationFrame(
                                render
                            );
                    }
                }
            );
        });
    }

    /* =========================================================
       BOTONES MAGNÉTICOS
       ========================================================= */

    function initializeMagneticButtons() {
        if (!effectsAllowed()) return;

        const buttons =
            $$("[data-magnetic]");

        buttons.forEach(button => {
            button.addEventListener(
                "pointermove",
                event => {
                    const rect =
                        button.getBoundingClientRect();

                    const x =
                        event.clientX -
                        rect.left -
                        rect.width / 2;

                    const y =
                        event.clientY -
                        rect.top -
                        rect.height / 2;

                    button.style.transform =
                        `translate3d(
                            ${x * 0.15}px,
                            ${y * 0.15}px,
                            0
                        )`;
                },
                { passive: true }
            );

            button.addEventListener(
                "pointerleave",
                () => {
                    button.style.transform = "";
                }
            );
        });
    }

    /* =========================================================
       PARALLAX
       ========================================================= */

    function initializeParallax() {
        if (!effectsAllowed()) return;

        const elements =
            $$(SELECTORS.parallax);

        if (!elements.length) return;

        let ticking = false;

        const update = () => {
            ticking = false;

            elements.forEach(element => {
                const speed =
                    Number(
                        element.dataset.parallax
                    ) || 0.04;

                const rect =
                    element.getBoundingClientRect();

                if (
                    rect.bottom < 0 ||
                    rect.top >
                        window.innerHeight
                ) {
                    return;
                }

                const center =
                    rect.top +
                    rect.height / 2;

                const distance =
                    center -
                    window.innerHeight / 2;

                element.style.setProperty(
                    "--parallax-y",
                    `${distance * speed * -1}px`
                );
            });
        };

        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;

                ticking = true;

                requestAnimationFrame(
                    update
                );
            },
            { passive: true }
        );

        update();
    }

    /* =========================================================
       IMÁGENES INTERACTIVAS
       ========================================================= */

    function initializeImageInteractions() {
        if (!effectsAllowed()) return;

        const images =
            $$(SELECTORS.imageTilt);

        images.forEach(image => {
            image.addEventListener(
                "pointermove",
                event => {
                    const rect =
                        image.getBoundingClientRect();

                    const x =
                        (event.clientX -
                            rect.left) /
                            rect.width -
                        0.5;

                    const y =
                        (event.clientY -
                            rect.top) /
                            rect.height -
                        0.5;

                    image.style.transform =
                        `scale(1.04)
                         translate(
                            ${x * 6}px,
                            ${y * 6}px
                         )`;
                },
                { passive: true }
            );

            image.addEventListener(
                "pointerleave",
                () => {
                    image.style.transform = "";
                }
            );
        });
    }

    /* =========================================================
       BOTÓN VOLVER ARRIBA
       ========================================================= */

    function initializeBackToTop() {
        const button =
            $(SELECTORS.backTop);

        if (!button) return;

        const update = () => {
            button.classList.toggle(
                "is-visible",
                window.scrollY >
                    window.innerHeight * 0.6
            );
        };

        update();

        window.addEventListener(
            "scroll",
            update,
            { passive: true }
        );

        button.addEventListener(
            "click",
            event => {
                event.preventDefault();

                window.scrollTo({
                    top: 0,
                    behavior:
                        state.reducedMotion
                            ? "auto"
                            : "smooth"
                });
            }
        );
    }

    /* =========================================================
       MAIL
       ========================================================= */

    function initializeMailLinks() {
        $$(
            SELECTORS.mail
        ).forEach(link => {
            const email =
                link.dataset.mail;

            if (!email) return;

            link.href =
                `mailto:${email}`;
        });
    }

    /* =========================================================
       PANELES DE PROYECTOS
       ========================================================= */

    function initializeProjectPanels() {
        const triggers =
            $$(SELECTORS.projectTrigger);

        const panels =
            $$(SELECTORS.projectPanel);

        if (
            !triggers.length ||
            !panels.length
        ) {
            return;
        }

        let activePanel = null;

        const closePanels = () => {
            panels.forEach(panel => {
                panel.classList.remove(
                    "is-open"
                );

                panel.setAttribute(
                    "aria-hidden",
                    "true"
                );
            });

            activePanel = null;

            body.classList.remove(
                "modal-open"
            );
        };

        triggers.forEach(trigger => {
            trigger.addEventListener(
                "click",
                () => {
                    const target =
                        trigger.dataset
                            .projectOpen;

                    const panel = $(
                        `[data-project-panel="${target}"]`
                    );

                    if (!panel) return;

                    closePanels();

                    panel.classList.add(
                        "is-open"
                    );

                    panel.setAttribute(
                        "aria-hidden",
                        "false"
                    );

                    activePanel = panel;

                    body.classList.add(
                        "modal-open"
                    );

                    const closeButton =
                        $(
                            SELECTORS.projectClose,
                            panel
                        );

                    closeButton?.focus();
                }
            );
        });

        $$(SELECTORS.projectClose)
            .forEach(button => {
                button.addEventListener(
                    "click",
                    closePanels
                );
            });

        document.addEventListener(
            "keydown",
            event => {
                if (
                    event.key === "Escape" &&
                    activePanel
                ) {
                    closePanels();
                }
            }
        );
    }

    /* =========================================================
       PREFERENCIA DE MOVIMIENTO
       ========================================================= */

    function initializeMotionPreference() {
        const mediaQuery =
            window.matchMedia(
                "(prefers-reduced-motion: reduce)"
            );

        const update = matches => {
            state.reducedMotion = matches;

            root.dataset.motion =
                matches
                    ? "reduced"
                    : "full";
        };

        update(mediaQuery.matches);

        mediaQuery.addEventListener(
            "change",
            event => {
                update(event.matches);
            }
        );
    }

    /* =========================================================
       SCROLL STATE
       ========================================================= */

    function initializeScrollState() {
        let ticking = false;

        const update = () => {
            ticking = false;

            const currentY =
                window.scrollY;

            body.classList.toggle(
                "scrolling-down",
                currentY >
                    state.lastScrollY &&
                    currentY > 80
            );

            body.classList.toggle(
                "scrolling-up",
                currentY <
                    state.lastScrollY
            );

            state.lastScrollY =
                currentY;
        };

        window.addEventListener(
            "scroll",
            () => {
                if (ticking) return;

                ticking = true;

                requestAnimationFrame(
                    update
                );
            },
            { passive: true }
        );
    }

    /* =========================================================
       INICIALIZACIÓN
       ========================================================= */

    function initializePortfolio() {
        initializeMotionPreference();
        initializeEffects();

        initializeNavbar();
        initializeMobileMenu();
        initializeActiveSection();

        initializeScrollProgress();
        initializeRevealAnimations();
        initializeStagger();

        initializeCardSpotlight();
        initializeCursor();

        initializeTilt();
        initializeMagneticButtons();
        initializeParallax();
        initializeImageInteractions();

        initializeBackToTop();
        initializeMailLinks();

        initializeProjectPanels();
        initializeScrollState();
    }

    /* =========================================================
       ARRANQUE
       ========================================================= */

    if (
        document.readyState ===
        "loading"
    ) {
        document.addEventListener(
            "DOMContentLoaded",
            initializePortfolio,
            { once: true }
        );
    } else {
        initializePortfolio();
    }
})();