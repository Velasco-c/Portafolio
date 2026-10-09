import { describe, expect, it } from "vitest";
import { getHomeContent } from "./get-home-content";
import type { ContentRepository } from "../ports/content-repository";
import type { Profile } from "../../domain/profile/profile";
import type { SiteCopy } from "../../domain/site/site";

const profile: Profile = {
  nameLines: ["A", "B", "C", "D"],
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

const copy: SiteCopy = {
  nav: [],
  sections: {
    hero: "Hero",
    work: "Work",
    about: "About",
    process: "Process",
    skills: "Skills",
    learning: "Learning",
    experience: "Experience",
    contact: "Contact",
  },
  learningLabel: "Learning",
  contactHeadline: "Contact",
  contactCta: "Get in touch",
  footerName: "Example Person",
  footerLegal: "© Example",
};

function createRepository(
  overrides: Partial<ContentRepository> = {},
): ContentRepository {
  return {
    getProfile: async () => profile,
    getProjects: async () => [],
    getSkills: async () => [],
    getSkillRelations: async () => [],
    getProcess: async () => [],
    getLearning: async () => [],
    getExperience: async () => [],
    getCopy: async () => copy,
    ...overrides,
  };
}

describe("getHomeContent", () => {
  it("returns ordered core sections and omits empty experience", async () => {
    const content = await getHomeContent(createRepository());

    expect(content.sections.map(({ id }) => id)).toEqual([
      "hero",
      "work",
      "about",
      "process",
      "skills",
      "learning",
      "contact",
    ]);
    expect(content.experience).toEqual([]);
    expect(content.sections.some(({ id }) => id === "experience")).toBe(false);
  });

  it("rejects invalid skill graph data before returning content", async () => {
    const repository = createRepository({
      getSkillRelations: async () => [["unknown", "javascript"]],
    });

    await expect(getHomeContent(repository)).rejects.toThrow(
      "Invalid skill graph: missing-skill(unknown:javascript)",
    );
  });
});
