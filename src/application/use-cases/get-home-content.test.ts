import { describe, expect, it } from "vitest";
import { getHomeContent } from "./get-home-content";
import type { ContentRepository } from "../ports/content-repository";
import type { Profile } from "../../domain/profile/profile";

const profile: Profile = {
  fullName: "Example Person",
  title: "Developer",
  location: { city: "City", country: "Country" },
  availability: "Available",
  email: "example@example.com",
  links: {
    github: { label: "GitHub", href: "https://example.com" },
    linkedin: { label: "LinkedIn", href: "https://example.com" },
  },
  photo: { src: "/profile.webp", alt: "Example Person" },
};

function createRepository(overrides: Partial<ContentRepository> = {}): ContentRepository {
  return {
    getProfile: async () => profile,
    getProjects: async () => [],
    getSkills: async () => [],
    getProcess: async () => [],
    getLearning: async () => [],
    getExperience: async () => [],
    ...overrides,
  };
}

describe("getHomeContent", () => {
  it("returns every collection the home page renders", async () => {
    const skills = [{ id: "git", label: "Git" }];
    const content = await getHomeContent(createRepository({ getSkills: async () => skills }));

    expect(content.profile).toBe(profile);
    expect(content.skills).toEqual(skills);
    expect(content.projects).toEqual([]);
    expect(content.experience).toEqual([]);
  });

  it("propagates repository failures instead of returning partial content", async () => {
    const repository = createRepository({
      getProjects: async () => {
        throw new Error("unavailable");
      },
    });

    await expect(getHomeContent(repository)).rejects.toThrow("unavailable");
  });
});
