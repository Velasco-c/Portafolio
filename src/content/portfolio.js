export const portfolio = {
  meta: {
    title: "Carlos Elias Tzoy Velasco — Técnico en Desarrollo de Software",
    description: "Portafolio de Carlos Elias Tzoy Velasco, Técnico en Desarrollo de Software.",
    year: "2026",
  },

  profile: {
    name: "Carlos Elias Tzoy Velasco",
    nameLines: ["Carlos Elias", "Tzoy", "Velasco"],
    initials: "CETV",
    role: "Técnico en Desarrollo de Software",
    tagline:
      "Desarrollo soluciones escalables, mantenibles y bien documentadas con buenas prácticas de ingeniería de software.",
    location: "Ciudad de Guatemala, Guatemala",
    availability: "Disponible para prácticas profesionales y oportunidades Junior",
    photo: "./public/images/foto_personal.png",
    cardStack: ["JavaScript", "Node.js", "MySQL", "Git"],
  },

  nav: [
    { id: "about", label: "Perfil" },
    { id: "experience", label: "Formación" },
    { id: "ecosystem", label: "Tecnologías" },
    { id: "projects", label: "Proyectos" },
    { id: "contact", label: "Contacto" },
  ],

  labels: {
    scroll: "Desplazarse",
    menu: "Menú",
    close: "Cerrar",
    skip: "Ir al contenido",
    themeLight: "Cambiar al tema claro",
    themeDark: "Cambiar al tema oscuro",
    motionOff: "Reducir animaciones",
    motionOn: "Activar animaciones",
    motionNotice:
      "Tu sistema solicita reducir el movimiento, por lo que las animaciones están simplificadas.",
    motionEnable: "Activar animaciones",
    dismiss: "Descartar",
    resume: "Descargar currículum",
    viewProject: "Ver",
    role: "Rol",
    year: "Año",
    stack: "Tecnologías",
    live: "Sitio web",
    code: "Código",
    sections: {
      about: "Perfil",
      experience: "Formación y práctica",
      ecosystem: "Ecosistema tecnológico",
      projects: "Proyectos destacados",
      contact: "Contacto",
    },
  },

  about: {
    heading: "Desarrollo de software con propósito.",
    lead:
      "Soy Perito en Desarrollo de Software y actualmente continúo especializándome como Técnico en Desarrollo de Software, fortaleciendo mis conocimientos en desarrollo web, desarrollo backend, bases de datos relacionales, integración de APIs, automatización de procesos e inteligencia artificial aplicada al desarrollo de software.",

    paragraphs: [
      "Mi formación técnica, junto con la práctica constante mediante proyectos académicos y personales, me permite aplicar estos conocimientos en situaciones reales y continuar desarrollando mis habilidades de ingeniería de software.",
      "Me apasiona comprender el funcionamiento de las tecnologías desde sus fundamentos para diseñar y desarrollar soluciones escalables, mantenibles y bien documentadas.",
      "Actualmente trabajo con JavaScript, Node.js, HTML, CSS, MySQL y Git.",
      "Mi enfoque: aprendizaje continuo, resolución de problemas y calidad en el desarrollo.",
    ],

    facts: [
      { label: "Enfoque", value: "Desarrollo web y de software" },
      { label: "Ubicación", value: "Ciudad de Guatemala, Guatemala" },
      { label: "Idiomas", value: "Español" },
    ],

    resume: "",
  },

  experience: [
    {
      company: "Formación técnica",
      role: "Técnico en Desarrollo de Software",
      period: "En curso",
      summary:
        "Formación en desarrollo web, backend, bases de datos e integración de APIs.",
      highlights: [
        "Buenas prácticas de ingeniería de software",
        "Desarrollo de proyectos académicos",
      ],
    },
    {
      company: "Proyectos académicos",
      role: "Práctica de desarrollo",
      period: "Actual",
      summary: "Aplicación de conocimientos en proyectos reales.",
      highlights: [
        "JavaScript y Node.js",
        "Bases de datos MySQL",
      ],
    },
  ],

  technologies: [
    { name: "HTML", color: "#e34f26", icon: "./public/icons/html5.svg" },
    { name: "CSS", color: "#663399", icon: "./public/icons/css.svg" },
    { name: "JavaScript", color: "#f7df1e", icon: "./public/icons/javascript.svg" },
    { name: "Node.js", color: "#68a063", icon: "./public/icons/nodedotjs.svg" },
    { name: "MySQL", color: "#4479a1", icon: "./public/icons/mysql.svg" },
    { name: "Git", color: "#f05032", icon: "./public/icons/git.svg" },
  ],

  marquee: {
    a: ["Desarrollo de software", "Desarrollo web", "Bases de datos"],
    b: ["Disponible para oportunidades", "Contáctame"],
  },

  ecosystem: {
    heading: "Tecnologías para crear soluciones.",
    intro:
      "Actualmente practico con JavaScript y MySQL. Arrastra para explorar la esfera tecnológica.",
  },

  projects: [
    {
      title: "Distribuidora de Gaseosas del Valle S.A.",
      description: "Sistema de gestión de base de datos para una distribuidora de bebidas, con modelado relacional, consultas SQL, funciones, triggers y auditoría.",
      role: "Diseño de base de datos / SQL",
      year: "2026",
      stack: ["MySQL", "SQL", "InnoDB", "Triggers", "Stored Procedures"],
      links: {
        live: "",
        repo: "https://github.com/Velasco-c/distribuidora_gaseosas",
      },
      image: "./public/projects/distribuidora-gaseosas.png",
      hue: 205,
  },
  {
      title: "FitCore Management System",
      description: "Sistema de gestión CLI desarrollado en Node.js con arquitectura modular y MySQL para administrar clientes, planes de entrenamiento, nutrición, progreso, contratos y finanzas.",
      role: "Backend / Arquitectura de software",
      year: "2026",
      stack: ["Node.js", "JavaScript", "MySQL", "CLI", "Arquitectura modular"],
      links: {
        live: "",
        repo: "https://github.com/Velasco-c/FitCore-Management-System"
      },
      image: "./public/projects/fitcore-management-system.png",
      hue: 205
    },
    {
      title: "CampusShop",
      description: "Tienda de ropa estática desarrollada con HTML y CSS, enfocada en diseño de interfaz, estructura de páginas y experiencia de usuario.",
      role: "Frontend / UI Design",
      year: "2026",
      stack: ["HTML", "CSS"],
      links: {
        live: "",
        repo: "https://github.com/Velasco-c/CampusShop"
      },
      image: "./public/projects/campusshop.png",
      hue: 205
    },
    {
      title: "Node.js Backend Patterns",
      description: "Repositorio de aprendizaje backend con Node.js enfocado en POO, principios SOLID, arquitectura modular, persistencia de datos y MySQL.",
      role: "Backend / Arquitectura de software",
      year: "2026",
      stack: ["Node.js", "JavaScript", "MySQL", "OOP", "SOLID", "CLI"],
      links: {
        live: "",
        repo: "https://github.com/Velasco-c/nodejs-backend-patterns"
      },
      image: "./public/projects/nodejs-backend-patterns.png",
      hue: 205
    },
  ],

  contact: {
    heading: "Construyamos soluciones tecnológicas.",
    text: "Busco desarrollarme profesionalmente en desarrollo de software.",
    email: "carlos.velasco.est@gmail.com",
    cta: "Escríbeme",
  },

  social: [
    { label: "GitHub", url: "https://github.com/Velasco-c" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/carlos-tzoy-velasco/" },
  ],

  footer: "Diseñado y desarrollado por Carlos Elias Tzoy Velasco.",
};
