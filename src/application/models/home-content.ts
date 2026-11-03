import type { ExperienceEntry } from "../../domain/experience/experience-entry";
import type { LearningTopic } from "../../domain/learning/learning-topic";
import type { ProcessStep } from "../../domain/process/process-step";
import type { Profile } from "../../domain/profile/profile";
import type { Project } from "../../domain/projects/project";
import type { SectionPlanItem, SiteCopy } from "../../domain/site/site";
import type { Skill, SkillRelation, SkillContext } from "../../domain/skills/skill";

export interface HomeContent {
  profile: Profile;
  projects: readonly Project[];
  skills: readonly Skill[];
  relations: readonly SkillRelation[];
  process: readonly ProcessStep[];
  learning: readonly LearningTopic[];
  experience: readonly ExperienceEntry[];
  copy: SiteCopy;
  sections: readonly SectionPlanItem[];
  skillContexts: Readonly<Record<string, SkillContext>>;
}
