import { SKILL_CATEGORIES, type Skill, type SkillRelation } from "./skill";

export interface SkillGraphIssue {
  code: "duplicate-id" | "invalid-id" | "invalid-category" | "missing-skill" | "self-relation" | "duplicate-relation" | "missing-stack-skill";
  detail: string;
}

export function validateSkillGraph(
  skills: readonly Skill[],
  relations: readonly SkillRelation[],
  projects: readonly { id: string; stack: readonly { skillId?: string }[] }[],
): SkillGraphIssue[] {
  const issues: SkillGraphIssue[] = [];
  const ids = new Set<string>();
  for (const skill of skills) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(skill.id)) issues.push({ code: "invalid-id", detail: skill.id });
    if (ids.has(skill.id)) issues.push({ code: "duplicate-id", detail: skill.id });
    ids.add(skill.id);
    if (!(SKILL_CATEGORIES as readonly string[]).includes(skill.category)) issues.push({ code: "invalid-category", detail: skill.id });
  }
  const edges = new Set<string>();
  for (const [left, right] of relations) {
    if (!ids.has(left) || !ids.has(right)) issues.push({ code: "missing-skill", detail: `${left}:${right}` });
    if (left === right) issues.push({ code: "self-relation", detail: left });
    const edge = [left, right].sort().join("\0");
    if (edges.has(edge)) issues.push({ code: "duplicate-relation", detail: `${left}:${right}` });
    edges.add(edge);
  }
  for (const project of projects) for (const item of project.stack) {
    if (item.skillId && !ids.has(item.skillId)) issues.push({ code: "missing-stack-skill", detail: `${project.id}:${item.skillId}` });
  }
  return issues;
}

export function buildAdjacency(relations: readonly SkillRelation[]): Map<string, Set<string>> {
  const adjacency = new Map<string, Set<string>>();
  for (const [left, right] of relations) {
    if (!adjacency.has(left)) adjacency.set(left, new Set());
    if (!adjacency.has(right)) adjacency.set(right, new Set());
    adjacency.get(left)?.add(right);
    adjacency.get(right)?.add(left);
  }
  return adjacency;
}

export function getRelatedSkills(relations: readonly SkillRelation[], id: string): string[] {
  return [...(buildAdjacency(relations).get(id) ?? [])];
}

export function groupByCategory(skills: readonly Skill[]): Map<Skill["category"], Skill[]> {
  const grouped = new Map<Skill["category"], Skill[]>();
  for (const skill of skills) grouped.set(skill.category, [...(grouped.get(skill.category) ?? []), skill]);
  return grouped;
}

export function getProjectsUsingSkill(
  projects: readonly { id: string; stack: readonly { skillId?: string }[] }[],
  skillId: string,
): string[] {
  return projects.filter(({ stack }) => stack.some((item) => item.skillId === skillId)).map(({ id }) => id);
}
