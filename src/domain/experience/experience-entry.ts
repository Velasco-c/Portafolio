import type { Period } from "../common/models";

export interface ExperienceEntry {
  id: string;
  kind: "education" | "work" | "practice" | "certification";
  title: string;
  organization: string;
  period: Period;
  description?: string;
}
