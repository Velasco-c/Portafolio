import type { Profile } from "../../../domain/profile/profile";
import styles from "./hero-section.module.css";
import { PortraitFrame } from "./portrait-frame";

export function HeroSection({ profile }: { profile: Profile }) {
  return <section className={styles.hero} id="hero" aria-labelledby="page-title">
    <div className={styles.copy}>
      <p className={styles.eyebrow}>Portafolio · 2026</p>
      <h1 className={styles.name} id="page-title" aria-label="Carlos Elias Tzoy Velasco">
        {profile.nameLines.map((line) => <span key={line}>{line}</span>)}
      </h1>
      <div className={styles.metadata}>
        <p className={styles.title}>{profile.title}</p>
        <p>{profile.location.city} · {profile.location.country}</p>
        <p className={styles.availability}>{profile.availability}</p>
      </div>
    </div>
    <PortraitFrame photo={profile.photo} />
  </section>;
}
