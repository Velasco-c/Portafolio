import type { SiteCopy } from "../domain/site/site";

export const copy = {
  nav: ["WORK", "ABOUT", "SKILLS", "CONTACT"],
  sections: {
    hero: "Presentación",
    work: "Work",
    about: "About",
    process: "Cómo trabajo",
    skills: "Skills",
    learning: "Currently exploring",
    experience: "Experience",
    contact: "Contact",
  },
  learningLabel: "CURRENTLY EXPLORING",
  contactHeadline: "LET'S / BUILD / SOMETHING.",
  contactCta: "GET IN TOUCH",
  footerName: "CARLOS ELIAS TZOY VELASCO",
  footerLegal: "© 2026 Carlos Elias Tzoy Velasco",
} as const satisfies SiteCopy;
