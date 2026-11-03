import type { ExperienceEntry } from "../../domain/experience/experience-entry";
import type { LearningTopic } from "../../domain/learning/learning-topic";
import type { ProcessStep } from "../../domain/process/process-step";
import type { Profile } from "../../domain/profile/profile";
import type { Project } from "../../domain/projects/project";
import type { Skill } from "../../domain/skills/skill";

export interface HomeContent {
  profile: Profile;
  projects: readonly Project[];
  skills: readonly Skill[];
  process: readonly ProcessStep[];
  learning: readonly LearningTopic[];
  experience: readonly ExperienceEntry[];
}
