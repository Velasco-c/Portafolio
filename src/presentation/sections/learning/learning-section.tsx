import type { LearningTopic } from "../../../domain/learning/learning-topic";
import styles from "./learning-section.module.css";

export function LearningSection({ topics, label }: {
  topics: readonly LearningTopic[];
  label: string;
}) {
  return <section className={styles.section} aria-labelledby="learning-heading" id="learning">
    <p className={styles.eyebrow} lang="en">{label}</p>
    <h2 id="learning-heading" lang="en" data-motion-reveal>Learning</h2>
    <ul className={styles.topics}>
      {topics.map(({ id, label: topic }, index) => <li key={id} data-motion-reveal>
        <span className={styles.index} aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
        <span>{topic}</span>
      </li>)}
    </ul>
  </section>;
}
