import { validateSkillGraph } from "../../domain/skills/graph";
import type { SectionPlanItem } from "../../domain/site/site";
import type { ContentRepository } from "../ports/content-repository";
import type { HomeContent } from "../models/home-content";
import { getSkillContext } from "./get-skill-context";

const CORE_SECTIONS: readonly SectionPlanItem[] = [
  { id: "hero", inNav: false },
  { id: "work", inNav: true },
  { id: "about", inNav: true },
  { id: "process", inNav: false },
  { id: "skills", inNav: true },
  { id: "learning", inNav: false },
  { id: "contact", inNav: true },
];

export async function getHomeContent(repository: ContentRepository): Promise<HomeContent> {
  const [profile, projects, skills, relations, process, learning, experience, copy] = await Promise.all([
    repository.getProfile(), repository.getProjects(), repository.getSkills(), repository.getSkillRelations(),
    repository.getProcess(), repository.getLearning(), repository.getExperience(), repository.getCopy(),
  ]);
  const issues = validateSkillGraph(skills, relations, projects);
  if (issues.length) throw new Error(`Invalid skill graph: ${issues.map(({ code, detail }) => `${code}(${detail})`).join(", ")}`);
  const sections = [...CORE_SECTIONS];
  if (experience.length) sections.splice(sections.length - 1, 0, { id: "experience", inNav: false });
  return { profile, projects, skills, relations, process, learning, experience, copy, sections,
    skillContexts: getSkillContext(skills, relations, projects) };
}
