"use client";

import { useState } from "react";
import type { Project } from "../../../domain/projects/project";
import type { Skill, SkillCategory, SkillContext } from "../../../domain/skills/skill";
import styles from "./skill-explorer.module.css";

interface SkillCategoryGroup {
  category: SkillCategory;
  label: string;
  skills: readonly Skill[];
}

export function SkillExplorer({
  groups,
  skillContexts,
  projects,
}: {
  groups: readonly SkillCategoryGroup[];
  skillContexts: Readonly<Record<string, SkillContext>>;
  projects: readonly Pick<Project, "id" | "title">[];
}) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const allSkills = groups.flatMap(({ skills }) => skills);
  const skillById = new Map(allSkills.map((skill) => [skill.id, skill]));
  const selected = selectedId ? skillById.get(selectedId) : undefined;
  const context = selected ? skillContexts[selected.id] : undefined;
  const relatedSkills = context?.related
    .map((id) => skillById.get(id))
    .filter((skill): skill is Skill => Boolean(skill)) ?? [];
  const projectIds = new Set(context?.projectIds ?? []);
  const relatedProjects = projects.filter(({ id }) => projectIds.has(id));

  return <div className={styles.explorer}>
    <div className={styles.groups} data-skill-groups>
      {groups.map((group) => <div className={styles.group} data-skill-category={group.category} key={group.category}>
        <h3>{group.label}</h3>
        <ul aria-label={`Tecnologías ${group.label}`}>
          {group.skills.map((skill) => <li key={skill.id}>
            <button
              className={styles.skillButton}
              type="button"
              data-skill-id={skill.id}
              aria-pressed={selectedId === skill.id}
              onClick={() => setSelectedId(skill.id)}
            >{skill.label}</button>
          </li>)}
        </ul>
      </div>)}
    </div>

    {selected && context ? <section
      className={styles.context}
      aria-live="polite"
      aria-atomic="true"
      aria-labelledby="skill-context-heading"
    >
      <h3 id="skill-context-heading">{selected.label}</h3>
      <div className={styles.contextDetails}>
        <div>
          <h4>Tecnologías relacionadas</h4>
          {relatedSkills.length ? <ul>{relatedSkills.map((skill) => <li key={skill.id}>{skill.label}</li>)}</ul> : <p>No hay relaciones confirmadas.</p>}
        </div>
        <div>
          <h4>Proyectos asociados</h4>
          {relatedProjects.length ? <ul>{relatedProjects.map((project) => <li key={project.id}>{project.title}</li>)}</ul> : <p>No hay proyectos asociados.</p>}
        </div>
      </div>
    </section> : null}
  </div>;
}
