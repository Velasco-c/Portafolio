import { getProjectsUsingSkill, getRelatedSkills } from "../../domain/skills/graph";
import type { Project } from "../../domain/projects/project";
import type { Skill, SkillContext, SkillRelation } from "../../domain/skills/skill";

export function getSkillContext(
  skills: readonly Skill[],
  relations: readonly SkillRelation[],
  projects: readonly Project[],
): Record<string, SkillContext> {
  return Object.fromEntries(skills.map(({ id }) => [id, {
    related: getRelatedSkills(relations, id),
    projectIds: getProjectsUsingSkill(projects, id),
  }]));
}
