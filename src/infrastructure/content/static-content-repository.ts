import type { ContentRepository } from "../../application/ports/content-repository";
import { copy } from "../../data/copy";
import { experience } from "../../data/experience";
import { learning } from "../../data/learning";
import { process } from "../../data/process";
import { profile } from "../../data/profile";
import { projects } from "../../data/projects";
import { skills, skillRelations } from "../../data/skills";
import type { Locale } from "../../i18n/config";
import { getDictionary } from "../../i18n/dictionaries";

export class StaticContentRepository implements ContentRepository {
  constructor(private readonly locale: Locale = "es") {}
  private get translations() { return getDictionary(this.locale); }
  async getProfile() {
    const text = this.translations.profile;
    return { ...profile, title: text.title, availability: text.availability,
      location: { ...profile.location, city: text.city }, photo: { ...profile.photo, alt: text.photoAlt } };
  }
  async getProjects() {
    return projects.map((project, index) => ({ ...project,
      summary: this.translations.projects[index]?.summary ?? project.summary,
      repository: { ...project.repository, label: this.translations.projects[index]?.repository ?? project.repository.label },
    }));
  }
  async getSkills() {
    return skills.map((skill) => skill.id === "ai"
      ? { ...skill, label: this.locale === "es" ? "Inteligencia Artificial" : "Artificial Intelligence" }
      : skill);
  }
  async getSkillRelations() { return skillRelations; }
  async getProcess() {
    return process.map((step, index) => ({ ...step,
      label: this.locale === "es" ? this.translations.processLabels[index] : step.label,
      description: this.translations.processDescriptions[index] ?? step.description,
    }));
  }
  async getLearning() {
    return learning.map((topic, index) => ({ ...topic,
      label: this.locale === "es" ? topic.label : index === 0 ? topic.label : this.translations.learningTopics[index - 1] ?? topic.label,
    }));
  }
  async getExperience() { return experience; }
  async getCopy() {
    const translated = this.translations.copy;
    return { ...copy, ...translated, sections: { ...copy.sections, ...translated.sections } };
  }
}
