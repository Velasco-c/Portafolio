import type { Project } from "../../../domain/projects/project";
import type { Skill, SkillCategory, SkillContext } from "../../../domain/skills/skill";
import { SkillExplorer } from "./skill-explorer";

const categoryLabels: Record<SkillCategory, string> = {
  web: "WEB",
  backend: "BACKEND",
  database: "DATABASE",
  "dev-workflow": "DEV WORKFLOW",
  automation: "AUTOMATION",
  ai: "AI",
};

interface SkillCategoryGroup {
  category: SkillCategory;
  label: string;
  skills: Skill[];
}

function groupSkills(skills: readonly Skill[]): SkillCategoryGroup[] {
  const groups = new Map<SkillCategory, Skill[]>();
  for (const skill of skills) {
    groups.set(skill.category, [...(groups.get(skill.category) ?? []), skill]);
  }
  return [...groups].map(([category, categorySkills]) => ({
    category,
    label: categoryLabels[category],
    skills: categorySkills,
  }));
}

export function SkillsSection({
  skills,
  skillContexts,
  projects,
}: {
  skills: readonly Skill[];
  skillContexts: Readonly<Record<string, SkillContext>>;
  projects: readonly Pick<Project, "id" | "title">[];
}) {
  return <SkillExplorer
    groups={groupSkills(skills)}
    skillContexts={skillContexts}
    projects={projects}
  />;
}
