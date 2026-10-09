import type { Project } from "../domain/projects/project";
import type { SkillId } from "./skills";

const stack = (items: readonly (readonly [string, SkillId?])[]) =>
  items.map(([label, skillId]) => skillId ? { label, skillId } : { label });

export const projects = [
  {
    id: "campus-parking",
    title: "Campus Parking",
    summary: "Sistema de gestión de parqueo para usuarios, vehículos, entradas, salidas y pagos",
    stack: stack([["HTML", "html5"], ["CSS", "css3"], ["JavaScript", "javascript"], ["LocalStorage"]]),
    repository: { label: "Repositorio de Campus Parking", href: "https://github.com/Velasco-c/Proyecto1_Javascript" },
  },
  {
    id: "campusshop",
    title: "CampusShop",
    summary: "Tienda web enfocada en interfaces, catálogo y navegación",
    stack: stack([["HTML5", "html5"], ["CSS3", "css3"]]),
    repository: { label: "Repositorio de CampusShop", href: "https://github.com/Velasco-c/CampusShop" },
  },
  {
    id: "tutorbot-academico",
    title: "TutorBot Académico",
    summary: "Sistema automatizado para registros, consultas y matrículas académicas mediante bot de Telegram",
    stack: stack([["n8n", "n8n"], ["Telegram API", "telegram-api"], ["Google Sheets", "google-sheets"], ["JavaScript", "javascript"], ["Webhooks", "webhooks"], ["IA", "ai"]]),
    repository: { label: "Repositorio de TutorBot Académico", href: "https://github.com/barriosevelyn488-web/Proyecto_TutorBot_evelyn-barrios_Carlos-Velasco" },
  },
] as const satisfies readonly Project[];
