import type { Skill } from "../domain/skills/skill";

export const skills = [
  { id: "html5", label: "HTML5" },
  { id: "css3", label: "CSS3" },
  { id: "javascript", label: "JavaScript" },
  { id: "nodejs", label: "Node.js" },
  { id: "mysql", label: "MySQL" },
  { id: "git", label: "Git" },
  { id: "github", label: "GitHub" },
  { id: "docker", label: "Docker" },
  { id: "vscode", label: "VS Code" },
  { id: "n8n", label: "n8n" },
  { id: "telegram-api", label: "Telegram API" },
  { id: "google-sheets", label: "Google Sheets" },
  { id: "webhooks", label: "Webhooks" },
  { id: "ai", label: "Inteligencia Artificial" },
] as const satisfies readonly Skill[];
