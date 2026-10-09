import type { Locale } from "./config";

const en = {
  metadata: {
    title: "Carlos Velasco — Software Engineer",
    description: "Carlos Velasco — software engineering, creative development, systems and WebGL portfolio.",
  },
  accessibility: {
    skip: "Skip to content", home: "Carlos Velasco home", navigation: "Primary navigation",
    openProject: "open repository", backToTop: "Back to top", language: "Language",
    switchTo: "Switch language to Spanish", portrait: "Portrait placeholder for Carlos Elias Tzoy Velasco",
  },
  nav: { work: "Work", about: "About", capabilities: "Capabilities", contact: "Contact", talk: "Let's talk" },
  home: {
    portfolio: "Portfolio", engineer: "Software engineer · creative developer",
    heroTitle: "Purposeful digital", heroEmphasis: "engineering.",
    heroLead: "From thoughtful interfaces to production-ready APIs and interactive experiences, I turn ideas into software designed from the first interaction to the last detail.",
    selectedWork: "Explore selected work", readAbout: "Read about me", scroll: "Scroll to explore",
    manifesto: "Manifesto", belief: "What I believe about building software",
    manifestoTitle: "Good software should feel", manifestoEmphasis: "inevitable.",
    manifestoText: "The best technology disappears into the experience. It is fast when it needs to be fast, expressive when it needs to be expressive, and structured enough to keep growing long after the first release.",
    selected: "Selected work", projectsTitle: "Projects with", projectsEmphasis: "purpose.",
    projectsLead: "Selected academic and independent work spanning frontend systems, automation, and full-stack application design.",
    projectWords: ["SYSTEM", "COMMERCE", "AUTOMATION", "EXPERIENCE"], projectFallback: "PROJECT",
    allRepositories: "View all repositories", practice: "Areas of practice", waysTitle: "Four ways I", waysEmphasis: "build.",
    capabilities: "Capabilities", toolsTitle: "The tool finds meaning by shaping", toolsEmphasis: "the idea.",
    stackIntro: "My stack is intentionally broad: I can move from interface composition to backend boundaries, from animation timelines to data persistence.",
    coreSkills: "Core skills", process: "Process", processTitle: "From", processEmphasis: "question", processEnd: "to system.",
    processIntro: "I keep the process simple: understand the problem, define the system, make the interaction feel right, then ship and refine.",
    about: "About me", aboutTitle: "Engineer by training.", aboutEmphasis: "Curious by default.",
    aboutOne: "I'm {name}, a {title} based in {city}. I enjoy the intersection where engineering discipline meets visual thinking.",
    aboutTwo: "I care about clean boundaries, accessible interfaces, thoughtful motion and software that remains understandable after the excitement of the first release has passed.",
    based: "Based in", focus: "Focus", learning: "Currently learning", experience: "Experience", now: "now",
    marquee: "DESIGN · CODE · SYSTEMS · MOTION · WEBGL · DESIGN · CODE · SYSTEMS · MOTION · WEBGL ·",
    contact: "Contact", contactEyebrow: "Have a project, role, or idea?", contactTitle: "Let's make something",
    contactEmphasis: "worth remembering.", built: "Built with Next.js · Three.js · GSAP",
  },
  domains: [
    { title: "JavaScript & interfaces", text: "JavaScript, HTML and CSS shape responsive interfaces, with TypeScript and Figma supporting structure and visual consistency." },
    { title: "Backend & databases", text: "Node.js and Express power REST APIs, while MySQL organizes the data behind each application." },
    { title: "3D, scroll & motion", text: "Three.js and WebGL add depth to interfaces, with GSAP and Lenis coordinating motion and scroll." },
    { title: "Python & automation", text: "Python, n8n and webhooks connect services, automate repeated tasks and move data through useful workflows." },
  ],
  processDescriptions: [
    "Clarify goals, constraints, users and the real problem behind the brief.",
    "Shape the architecture, content model and visual language before implementation.",
    "Build the smallest coherent system, then iterate through interaction and feedback.",
    "Test, optimize, document and leave the project in a state that can keep evolving.",
    "Document decisions, setup and usage so the work can be maintained over time.",
    "Review and refine performance, UX, architecture and code quality iteratively.",
  ],
  categories: { web: "WEB", backend: "BACKEND", database: "DATABASE", "dev-workflow": "DEV WORKFLOW", automation: "AUTOMATION", ai: "AI" },
  skillExplorer: { technologies: "Technologies", related: "Related technologies", projects: "Associated projects", noRelations: "No confirmed relationships.", noProjects: "No associated projects." },
  project: { stack: "STACK", technologies: "Technologies for", repository: "View repository" },
  aboutFacts: { title: "Title", location: "Location", availability: "Availability" },
  processLabels: ["ANALYZE", "PLAN", "BUILD", "TEST", "DOCUMENT", "IMPROVE"],
  profile: { title: "Software Development Technician", availability: "Available for professional internships and junior opportunities", city: "Guatemala City", photoAlt: "Portrait placeholder for Carlos Elias Tzoy Velasco" },
  projects: [
    { summary: "Parking management system for users, vehicles, entries, exits, and payments", repository: "Campus Parking repository" },
    { summary: "Web store focused on interfaces, catalog, and navigation", repository: "CampusShop repository" },
    { summary: "Automated system for academic records, inquiries, and enrollment through a Telegram bot", repository: "TutorBot Académico repository" },
  ],
  learningTopics: ["Relational database design", "Automation with n8n", "Artificial intelligence"],
  copy: { nav: ["WORK", "ABOUT", "SKILLS", "CONTACT"], sections: { hero: "Introduction", work: "Work", about: "About", process: "How I work", skills: "Skills", learning: "Currently exploring", experience: "Experience", contact: "Contact" }, learningLabel: "CURRENTLY EXPLORING", contactHeadline: "LET'S / BUILD / SOMETHING.", contactCta: "GET IN TOUCH", footerName: "CARLOS ELIAS TZOY VELASCO", footerLegal: "© 2026 Carlos Elias Tzoy Velasco" },
} as const;

const es = {
  ...en,
  metadata: {
    title: "Carlos Velasco — Desarrollador de Software",
    description: "Carlos Velasco — portafolio de desarrollo de software, desarrollo creativo, sistemas y WebGL.",
  },
  accessibility: {
    skip: "Saltar al contenido", home: "Inicio de Carlos Velasco", navigation: "Navegación principal",
    openProject: "abrir repositorio", backToTop: "Volver al inicio", language: "Idioma",
    switchTo: "Cambiar idioma a inglés", portrait: "Imagen provisional del retrato de Carlos Elias Tzoy Velasco",
  },
  nav: { work: "Proyectos", about: "Sobre mí", capabilities: "Habilidades", contact: "Contacto", talk: "Hablemos" },
  home: {
    portfolio: "Portafolio", engineer: "Desarrollador de software · desarrollador creativo",
    heroTitle: "Ingeniería digital", heroEmphasis: "con sentido.",
    heroLead: "Desde interfaces cuidadas hasta APIs listas para producción y experiencias interactivas, convierto ideas en software pensado desde la primera interacción hasta el último detalle.",
    selectedWork: "Explorar proyectos", readAbout: "Conóceme", scroll: "Desplázate para explorar",
    manifesto: "Manifiesto", belief: "Lo que creo sobre crear software",
    manifestoTitle: "El buen software debe sentirse", manifestoEmphasis: "inevitable.",
    manifestoText: "La mejor tecnología se integra en la experiencia. Es rápida cuando hace falta, expresiva cuando hace falta y está bien estructurada para seguir creciendo mucho después de su primer lanzamiento.",
    selected: "Proyectos seleccionados", projectsTitle: "Proyectos con", projectsEmphasis: "propósito.",
    projectsLead: "Una selección de proyectos académicos e independientes sobre sistemas frontend, automatización y diseño de aplicaciones full-stack.",
    projectWords: ["SISTEMA", "COMERCIO", "AUTOMATIZACIÓN", "EXPERIENCIA"], projectFallback: "PROYECTO",
    allRepositories: "Ver todos los repositorios", practice: "Áreas de especialización", waysTitle: "Cuatro formas de", waysEmphasis: "crear.",
    capabilities: "Habilidades", toolsTitle: "La herramienta cobra sentido al dar forma", toolsEmphasis: "a la idea.",
    stackIntro: "Mi stack es amplio a propósito: puedo pasar de componer interfaces a definir límites de backend, de animaciones a persistencia de datos.",
    coreSkills: "Habilidades principales", process: "Proceso", processTitle: "De la", processEmphasis: "pregunta", processEnd: "al sistema.",
    processIntro: "Mantengo un proceso sencillo: entender el problema, definir el sistema, cuidar la interacción y luego publicar y mejorar.",
    about: "Sobre mí", aboutTitle: "Ingeniero de formación.", aboutEmphasis: "Curioso por naturaleza.",
    aboutOne: "Soy {name}, con formación como {title} en {city}. Disfruto el punto donde la disciplina de ingeniería se encuentra con el pensamiento visual.",
    aboutTwo: "Me importan los límites claros, las interfaces accesibles, el movimiento intencional y el software que sigue siendo comprensible después de la emoción del primer lanzamiento.",
    based: "Ubicación", focus: "Enfoque", learning: "Aprendiendo", experience: "Experiencia", now: "actualidad",
    marquee: "DISEÑO · CÓDIGO · SISTEMAS · MOVIMIENTO · WEBGL · DISEÑO · CÓDIGO · SISTEMAS · MOVIMIENTO · WEBGL ·",
    contact: "Contacto", contactEyebrow: "¿Tienes un proyecto, puesto o idea?", contactTitle: "Creemos algo",
    contactEmphasis: "que valga recordar.", built: "Creado con Next.js · Three.js · GSAP",
  },
  domains: [
    { title: "JavaScript e interfaces", text: "JavaScript, HTML y CSS dan forma a interfaces responsivas, con TypeScript y Figma como apoyo para estructurarlas y mantener coherencia visual." },
    { title: "Backend y bases de datos", text: "Node.js y Express permiten crear APIs REST, mientras MySQL organiza los datos de cada aplicación." },
    { title: "3D, scroll y movimiento", text: "Three.js y WebGL añaden profundidad a las interfaces; GSAP y Lenis coordinan el movimiento y el scroll." },
    { title: "Python y automatización", text: "Python, n8n y los webhooks conectan servicios, automatizan tareas repetitivas y mueven datos en flujos útiles." },
  ],
  processDescriptions: [
    "Aclarar objetivos, restricciones, usuarios y el problema real detrás del encargo.",
    "Definir la arquitectura, el modelo de contenido y el lenguaje visual antes de implementar.",
    "Construir el sistema coherente más pequeño e iterar con interacción y comentarios.",
    "Probar, optimizar y documentar para dejar el proyecto listo para seguir evolucionando.",
    "Documentar decisiones, configuración y uso para facilitar el mantenimiento.",
    "Revisar y mejorar de forma iterativa el rendimiento, la experiencia, la arquitectura y el código.",
  ],
  categories: { web: "WEB", backend: "BACKEND", database: "BASES DE DATOS", "dev-workflow": "FLUJO DE DESARROLLO", automation: "AUTOMATIZACIÓN", ai: "IA" },
  skillExplorer: { technologies: "Tecnologías", related: "Tecnologías relacionadas", projects: "Proyectos asociados", noRelations: "No hay relaciones confirmadas.", noProjects: "No hay proyectos asociados." },
  project: { stack: "TECNOLOGÍAS", technologies: "Tecnologías de", repository: "Ver repositorio" },
  aboutFacts: { title: "Título", location: "Ubicación", availability: "Disponibilidad" },
  processLabels: ["ANALIZAR", "PLANIFICAR", "CONSTRUIR", "PROBAR", "DOCUMENTAR", "MEJORAR"],
  profile: { title: "Técnico en Desarrollo de Software", availability: "Disponible para prácticas profesionales y oportunidades junior", city: "Ciudad de Guatemala", photoAlt: "Imagen provisional del retrato de Carlos Elias Tzoy Velasco" },
  projects: [
    { summary: "Sistema de gestión de parqueo para usuarios, vehículos, entradas, salidas y pagos", repository: "Repositorio de Campus Parking" },
    { summary: "Tienda web enfocada en interfaces, catálogo y navegación", repository: "Repositorio de CampusShop" },
    { summary: "Sistema automatizado para registros, consultas y matrículas académicas mediante un bot de Telegram", repository: "Repositorio de TutorBot Académico" },
  ],
  learningTopics: ["Diseño de bases de datos relacionales", "Automatización con n8n", "Inteligencia artificial"],
  copy: { nav: ["PROYECTOS", "SOBRE MÍ", "HABILIDADES", "CONTACTO"], sections: { hero: "Presentación", work: "Proyectos", about: "Sobre mí", process: "Cómo trabajo", skills: "Habilidades", learning: "Explorando", experience: "Experiencia", contact: "Contacto" }, learningLabel: "EXPLORANDO ACTUALMENTE", contactHeadline: "VAMOS A / CREAR / ALGO.", contactCta: "HABLEMOS", footerName: "CARLOS ELIAS TZOY VELASCO", footerLegal: "© 2026 Carlos Elias Tzoy Velasco" },
};

type Widen<T> = T extends string ? string : T extends readonly (infer U)[] ? readonly Widen<U>[] : T extends object ? { [K in keyof T]: Widen<T[K]> } : T;
export type Dictionary = Widen<typeof en>;
const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
