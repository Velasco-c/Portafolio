import type { HomeContent } from "../models/home-content";
import type { ContentRepository } from "../ports/content-repository";

export async function getHomeContent(repository: ContentRepository): Promise<HomeContent> {
  const [profile, projects, skills, process, learning, experience] = await Promise.all([
    repository.getProfile(),
    repository.getProjects(),
    repository.getSkills(),
    repository.getProcess(),
    repository.getLearning(),
    repository.getExperience(),
  ]);

  return { profile, projects, skills, process, learning, experience };
}
