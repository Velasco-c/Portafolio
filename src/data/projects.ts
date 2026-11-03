import type { Project } from "../domain/projects/project";
const stack = (labels: readonly string[]) => labels.map((label) => ({ label }));

export const projects = [
  {
    id: "campus-parking",
    title: "Campus Parking",
    summary: "Sistema de gestión de parqueo para usuarios, vehículos, entradas, salidas y pagos",
    stack: stack(["HTML", "CSS", "JavaScript", "LocalStorage"]),
    repository: { label: "Repositorio de Campus Parking", href: "https://github.com/Velasco-c/Proyecto1_Javascript" },
  },
  {
    id: "campusshop",
    title: "CampusShop",
    summary: "Tienda web enfocada en interfaces, catálogo y navegación",
    stack: stack(["HTML5", "CSS3"]),
    repository: { label: "Repositorio de CampusShop", href: "https://github.com/Velasco-c/CampusShop" },
  },
  {
    id: "tutorbot-academico",
    title: "TutorBot Académico",
    summary: "Sistema automatizado para registros, consultas y matrículas académicas mediante bot de Telegram",
    stack: stack(["n8n", "Telegram API", "Google Sheets", "JavaScript", "Webhooks", "IA"]),
    repository: { label: "Repositorio de TutorBot Académico", href: "https://github.com/barriosevelyn488-web/Proyecto_TutorBot_evelyn-barrios_Carlos-Velasco" },
  },
] as const satisfies readonly Project[];
