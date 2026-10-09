import type { LearningTopic } from "../domain/learning/learning-topic";

export const learning = [
  { id: "mysql", label: "MySQL" },
  { id: "relational-databases", label: "Diseño de bases de datos relacionales" },
  { id: "n8n", label: "Automatización con n8n" },
  { id: "ai", label: "Inteligencia artificial" },
  { id: "javascript", label: "JavaScript" },
] as const satisfies readonly LearningTopic[];
