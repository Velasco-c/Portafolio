import type { ExternalLink } from "../../../domain/common/models";
import styles from "./contact-section.module.css";

export function ContactSection({
  title,
  headline,
  cta,
  email,
  github,
  linkedin,
}: {
  title: string;
  headline: string;
  cta: string;
  email: string;
  github: ExternalLink;
  linkedin: ExternalLink;
}) {
  return <section className={styles.section} aria-labelledby="contact-heading" id="contact">
    <h2 id="contact-heading">{title}</h2>
    <div className={styles.content} data-motion-reveal>
      <h3 className={styles.headline} lang="en" aria-label={headline.replaceAll(" / ", " ")}>
        {headline.split(" / ").map((line) => <span key={line} aria-hidden="true">{line}</span>)}
      </h3>
      <a className={styles.cta} href={`mailto:${email}`} lang="en">{cta}<span aria-hidden="true">↗</span></a>
      <address className={styles.channels}>
        <a className={styles.email} href={`mailto:${email}`}>{email}</a>
        <ul>
          <li><a href={github.href} rel="noreferrer">{github.label}</a></li>
          <li><a href={linkedin.href} rel="noreferrer">{linkedin.label}</a></li>
        </ul>
      </address>
    </div>
  </section>;
}
