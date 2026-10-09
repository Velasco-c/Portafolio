import type { Profile } from "../../../domain/profile/profile";
import styles from "./about-facts.module.css";

type AboutFactsProps = Pick<Profile, "title" | "location" | "availability">;

export function AboutFacts({ title, location, availability }: AboutFactsProps) {
  return <dl className={styles.facts}>
    <div className={styles.fact}>
      <dt>Título</dt>
      <dd>{title}</dd>
    </div>
    <div className={styles.fact}>
      <dt>Ubicación</dt>
      <dd>{location.city} · {location.country}</dd>
    </div>
    <div className={`${styles.fact} ${styles.availability}`}>
      <dt>Disponibilidad</dt>
      <dd>{availability}</dd>
    </div>
  </dl>;
}
