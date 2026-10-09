import type { ExperienceEntry } from "../../domain/experience/experience-entry";
import type { LearningTopic } from "../../domain/learning/learning-topic";
import type { ProcessStep } from "../../domain/process/process-step";
import type { Profile } from "../../domain/profile/profile";
import type { Project } from "../../domain/projects/project";
import type { SiteCopy } from "../../domain/site/site";
import type { Skill, SkillRelation } from "../../domain/skills/skill";

export interface ContentRepository {
  getProfile(): Promise<Profile>;
  getProjects(): Promise<readonly Project[]>;
  getSkills(): Promise<readonly Skill[]>;
  getSkillRelations(): Promise<readonly SkillRelation[]>;
  getProcess(): Promise<readonly ProcessStep[]>;
  getLearning(): Promise<readonly LearningTopic[]>;
  getExperience(): Promise<readonly ExperienceEntry[]>;
  getCopy(): Promise<SiteCopy>;
}
