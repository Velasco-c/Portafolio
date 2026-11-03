import type { Skill, SkillRelation } from "../domain/skills/skill";

export const skills = [
  { id: "html5", label: "HTML5", category: "web" },
  { id: "css3", label: "CSS3", category: "web" },
  { id: "javascript", label: "JavaScript", category: "web" },
  { id: "nodejs", label: "Node.js", category: "backend" },
  { id: "mysql", label: "MySQL", category: "database" },
  { id: "git", label: "Git", category: "dev-workflow" },
  { id: "github", label: "GitHub", category: "dev-workflow" },
  { id: "docker", label: "Docker", category: "dev-workflow" },
  { id: "vscode", label: "VS Code", category: "dev-workflow" },
  { id: "n8n", label: "n8n", category: "automation" },
  { id: "telegram-api", label: "Telegram API", category: "automation" },
  { id: "google-sheets", label: "Google Sheets", category: "automation" },
  { id: "webhooks", label: "Webhooks", category: "automation" },
  { id: "ai", label: "Inteligencia Artificial", category: "ai" },
] as const satisfies readonly Skill[];

export type SkillId = (typeof skills)[number]["id"];

// Relaciones propuestas en el modelo de contenido; aún no se presentan como conclusiones visuales.
export const skillRelations = [
  ["javascript", "html5"], ["javascript", "css3"], ["javascript", "nodejs"],
  ["javascript", "n8n"], ["javascript", "webhooks"],
  ["git", "github"], ["n8n", "telegram-api"], ["n8n", "google-sheets"],
  ["n8n", "webhooks"], ["n8n", "ai"],
] as const satisfies readonly SkillRelation<SkillId>[];
