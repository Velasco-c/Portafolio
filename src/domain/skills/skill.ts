export const SKILL_CATEGORIES = [
  "web",
  "backend",
  "database",
  "dev-workflow",
  "automation",
  "ai",
] as const;

export type SkillCategory = (typeof SKILL_CATEGORIES)[number];
export interface Skill<Id extends string = string> {
  id: Id;
  label: string;
  category: SkillCategory;
}
export type SkillRelation<Id extends string = string> = readonly [Id, Id];
export interface SkillContext {
  related: string[];
  projectIds: string[];
}
