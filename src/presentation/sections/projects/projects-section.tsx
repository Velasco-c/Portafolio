import type { Project } from "../../../domain/projects/project";
import styles from "./projects-section.module.css";

export function ProjectsSection({
  title,
  projects,
}: {
  title: string;
  projects: readonly Project[];
}) {
  return <section className={styles.section} aria-labelledby="work-heading" id="work">
    <h2 id="work-heading" data-motion-reveal>{title}</h2>
    <div className={styles.projects}>
      {projects.map((project, index) => <article className={styles.project} key={project.id} aria-labelledby={`project-${project.id}`} data-motion-reveal>
        <div className={styles.cover} aria-hidden="true">
          <span className={styles.coverIndex}>{String(index + 1).padStart(2, "0")}</span>
          <span className={styles.coverTitle}>{project.title}</span>
          <span className={styles.coverStack}>{project.stack.map(({ label }) => label).join(" · ")}</span>
          <span className={styles.coverOrbit} data-project-depth />
        </div>
        <div className={styles.details}>
          <p className={styles.index}>PROJECT / {String(index + 1).padStart(2, "0")}</p>
          <h3 id={`project-${project.id}`}>{project.title}</h3>
          <p className={styles.summary}>{project.summary}</p>
          <div className={styles.metadata}>
            <div>
              <h4>STACK</h4>
              <ul className={styles.stack} aria-label={`Tecnologías de ${project.title}`}>
                {project.stack.map(({ label, skillId }, stackIndex) => <li key={`${skillId ?? label}-${stackIndex}`}>{label}</li>)}
              </ul>
            </div>
            <a className={styles.repository} href={project.repository.href} aria-label={project.repository.label}>
              Ver repositorio <span aria-hidden="true">↗</span>
            </a>
          </div>
        </div>
      </article>)}
    </div>
  </section>;
}
