import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import type { ExperienceEntry } from "../domain/experience/experience-entry";
import type { LearningTopic } from "../domain/learning/learning-topic";
import type { ProcessStep } from "../domain/process/process-step";
import type { Profile } from "../domain/profile/profile";
import type { Project } from "../domain/projects/project";
import type { Skill, SkillContext, SkillRelation } from "../domain/skills/skill";
import type { SectionPlanItem, SiteCopy } from "../domain/site/site";
import type { Dictionary } from "../i18n/dictionaries";
import type { Locale } from "../i18n/config";
import { PageMotion } from "../animations/components/page-motion";
import { SmoothScroll } from "../animations/components/smooth-scroll";
import { ThreeBackground } from "../graphics/three/three-background";
import { LanguageSwitcher } from "./language-switcher";
import styles from "./home-page.module.css";

export interface HomeViewModel {
  profile: Profile;
  projects: readonly Project[];
  skills: readonly Skill[];
  relations: readonly SkillRelation[];
  process: readonly ProcessStep[];
  learning: readonly LearningTopic[];
  experience: readonly ExperienceEntry[];
  copy: SiteCopy;
  sections: readonly SectionPlanItem[];
  skillContexts: Readonly<Record<string, SkillContext>>;
}

const tech = [
  "TypeScript",
  "JavaScript",
  "Express",
  "Node.js",
  "MySQL",
  "REST APIs",
  "Postman",
  "Git",
  "Linux",
  "Docker",
  "Python",
  "GitHub",
  "n8n",
  "Figma",
] as const;

const domainTags = [
  ["JavaScript", "HTML5", "CSS3"],
  ["Node.js", "Express", "MySQL"],
  ["Three.js", "GSAP", "WebGL"],
  ["Python", "n8n", "Webhooks"],
] as const;

function Reveal({
  children,
  className = "",
  project = false,
}: {
  children: ReactNode;
  className?: string;
  project?: boolean;
}) {
  return (
    <div
      className={`${styles.editorialMotion}${className ? ` ${className}` : ""}`}
      data-motion-reveal
      data-motion-editorial
      data-motion-project={project ? "" : undefined}
    >
      {children}
    </div>
  );
}

function SectionLabel({
  number,
  children,
}: {
  number: string;
  children: ReactNode;
}) {
  return (
    <div
      className={`${styles.sectionLabel} ${styles.editorialMotion}`}
      data-motion-editorial
    >
      <span>{number}</span>
      <span>{children}</span>
    </div>
  );
}

function Arrow() {
  return (
    <span aria-hidden="true" className={styles.arrow}>
      ↗
    </span>
  );
}

function ProjectArtwork({
  projectId,
  locale,
}: {
  projectId: string;
  locale: Locale;
}) {
  const isSpanish = locale === "es";

  if (projectId === "campus-parking") {
    const metrics = [
      { label: isSpanish ? "Vehículos" : "Vehicles", value: "128" },
      { label: isSpanish ? "Disponibles" : "Available", value: "24" },
      { label: isSpanish ? "Pagos" : "Payments", value: "$840" },
    ];

    return (
      <div className={`${styles.previewFrame} ${styles.parkingFrame}`} aria-hidden="true">
        <aside className={styles.previewRail}>
          <span>CP</span>
          <i />
          <i />
          <i />
          <i />
        </aside>
        <div className={styles.parkingPanel}>
          <div className={styles.previewTopbar}>
            <strong>Campus Parking</strong>
            <span>{isSpanish ? "EN VIVO" : "LIVE"} <i /></span>
          </div>
          <div className={styles.previewBody}>
            <p className={styles.previewEyebrow}>{isSpanish ? "Resumen de hoy" : "Today overview"}</p>
            <div className={styles.parkingMetrics}>
              {metrics.map((metric) => (
                <div className={styles.parkingMetric} key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                </div>
              ))}
            </div>
            <div className={styles.parkingMap}>
              <div className={styles.parkingMapHeading}>
                <strong>{isSpanish ? "Espacios" : "Parking spaces"}</strong>
                <span>{isSpanish ? "PLANTA A" : "FLOOR A"}</span>
              </div>
              <div className={styles.parkingSpots}>
                {["A01", "A02", "A03", "B01", "B02", "B03"].map((spot, index) => (
                  <span
                    className={index === 1 || index === 4 ? styles.spotOccupied : styles.spotAvailable}
                    key={spot}
                  >
                    {spot}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (projectId === "campusshop") {
    const products = [
      { id: "campusshop-item-1", artClass: styles.productArtOne, price: 24 },
      { id: "campusshop-item-2", artClass: styles.productArtTwo, price: 38 },
      { id: "campusshop-item-3", artClass: styles.productArtThree, price: 18 },
    ];

    return (
      <div className={`${styles.previewFrame} ${styles.shopFrame}`} aria-hidden="true">
        <div className={styles.shopTopbar}>
          <strong>CampusShop</strong>
          <span>{isSpanish ? "Buscar productos" : "Search products"}</span>
          <i>♡</i>
        </div>
        <div className={styles.shopBody}>
          <div className={styles.shopHeading}>
            <span>{isSpanish ? "SELECCIÓN DEL CAMPUS" : "CAMPUS SELECTION"}</span>
            <strong>{isSpanish ? "Explora la colección" : "Explore the collection"}</strong>
          </div>
          <div className={styles.shopProducts}>
            {products.map((product, index) => (
              <div className={styles.shopProduct} key={product.id}>
                <div className={`${styles.productArtwork} ${product.artClass}`} />
                <span>{isSpanish ? `Artículo 0${index + 1}` : `Item 0${index + 1}`}</span>
                <strong>${product.price}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (projectId === "tutorbot-academico") {
    return (
      <div className={`${styles.previewFrame} ${styles.botFrame}`} aria-hidden="true">
        <div className={styles.botScreen}>
          <div className={styles.botStatus}><span /> 9:41 <i>•••</i></div>
          <div className={styles.botHeader}>
            <span>TB</span>
            <div><strong>TutorBot</strong><small>{isSpanish ? "asistente académico" : "academic assistant"}</small></div>
            <i>⋮</i>
          </div>
          <div className={styles.botMessages}>
            <p className={styles.botReceived}>
              {isSpanish ? "Hola, ¿puedo consultar mis notas?" : "Hi, can I check my grades?"}
              <small>9:41</small>
            </p>
            <p className={styles.botSent}>
              {isSpanish ? "¡Claro! Estas son tus notas:" : "Sure! Here are your grades:"}
              <small>9:41 ✓✓</small>
            </p>
            <div className={styles.botGrades}>
              <span>{isSpanish ? "Programación" : "Programming"}<strong>92</strong></span>
              <span>{isSpanish ? "Bases de datos" : "Databases"}<strong>88</strong></span>
            </div>
            <div className={styles.botQuickReply}>
              {isSpanish ? "Consultar notas" : "Check grades"} <span>›</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

export function HomePage({
  content,
  messages,
  locale,
}: {
  content: HomeViewModel;
  messages: Dictionary;
  locale: Locale;
}) {
  const { profile, projects, skills, process, learning, experience } = content;
  const t = messages.home;
  const firstProjects = projects.slice(0, 4);

  return (
    <>
      <ThreeBackground />
      <SmoothScroll />
      <PageMotion />

      <a className={styles.skipLink} href="#main">
        {messages.accessibility.skip}
      </a>

      <header className={styles.header}>
        <a
          className={styles.brand}
          href="#top"
          aria-label={messages.accessibility.home}
        >
          <span>Velasco-c</span>
        </a>

        <nav
          className={styles.nav}
          aria-label={messages.accessibility.navigation}
        >
          <a href="#work">{messages.nav.work}</a>
          <a href="#about">{messages.nav.about}</a>
          <a href="#capabilities">{messages.nav.capabilities}</a>
          <a href="#contact">{messages.nav.contact}</a>
        </nav>

        <div className={styles.headerCta}>
          <a href={`mailto:${profile.email}`}>
            {messages.nav.talk} <Arrow />
          </a>

          <LanguageSwitcher
            locale={locale}
            label={messages.accessibility.language}
            switchLabel={messages.accessibility.switchTo}
          />
        </div>
      </header>

      <main id="main">
        <section id="top" className={styles.hero}>
          <div className={styles.heroMeta}>
            <span>{t.portfolio} / 2026</span>
            <span>
              {profile.location.city}, {profile.location.country}
            </span>
          </div>

          <div className={styles.heroGrid}>
            <div className={styles.heroCopy}>
              <Reveal>
                <p className={styles.eyebrow}>{t.engineer}</p>
              </Reveal>

              <Reveal>
                <h1>
                  {t.heroTitle} <em>{t.heroEmphasis}</em>
                </h1>
              </Reveal>

              <Reveal>
                <p className={styles.heroLead}>{t.heroLead}</p>
              </Reveal>

              <Reveal className={styles.heroActions}>
                <a className={styles.primaryButton} href="#work">
                  {t.selectedWork} <Arrow />
                </a>

                <a className={styles.textButton} href="#about">
                  {t.readAbout} <Arrow />
                </a>
              </Reveal>
            </div>

            <Reveal className={styles.heroPortraitWrap}>
              <div className={styles.heroPortrait}>
                <Image
                  src={profile.photo.src}
                  alt={profile.photo.alt}
                  width={800}
                  height={1000}
                  sizes="(max-width: 600px) 70vw, (max-width: 900px) 58vw, 34vw"
                  priority
                />
              </div>

              <span className={styles.portraitCaption}>
                01 / CARLOS VELASCO
              </span>
            </Reveal>
          </div>

          <div className={styles.heroFooter}>
            <span>{t.scroll}</span>
            <span className={styles.scrollLine} aria-hidden="true" />
            <span>01—07</span>
          </div>
        </section>

        <section className={styles.manifesto}>
          <div className={styles.sectionInner}>
            <SectionLabel number="01">{t.manifesto}</SectionLabel>

            <Reveal className={styles.manifestoContent}>
              <p className={styles.kicker}>{t.belief}</p>
              <h2>
                {t.manifestoTitle} <i>{t.manifestoEmphasis}</i>
              </h2>
              <p className={styles.manifestoText}>{t.manifestoText}</p>
            </Reveal>
          </div>
        </section>

        <section id="work" className={styles.workSection}>
          <div className={styles.sectionInner}>
            <SectionLabel number="02">{t.selected}</SectionLabel>

            <div className={styles.sectionHeadingRow}>
              <Reveal>
                <h2>
                  {t.projectsTitle} <i>{t.projectsEmphasis}</i>
                </h2>
              </Reveal>

              <Reveal>
                <p>{t.projectsLead}</p>
              </Reveal>
            </div>

            <div className={styles.projectGrid}>
              {firstProjects.map((project, index) => (
                <Reveal
                  key={project.id}
                  className={styles.projectCard}
                  project
                >
                  <a
                    href={project.repository.href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`${project.title}, ${messages.accessibility.openProject}`}
                  >
                    <div
                      className={`${styles.projectVisual} ${
                        styles[
                          `visual${index + 1}` as keyof typeof styles
                        ] ?? ""
                      }`}
                    >
                      <ProjectArtwork projectId={project.id} locale={locale} />
                      <span className={styles.projectNumber}>
                        0{index + 1}
                      </span>

                      <span className={styles.projectVisualWord}>
                        {t.projectWords[index] ?? t.projectFallback}
                      </span>

                    </div>

                    <div className={styles.projectInfo}>
                      <div>
                        <span className={styles.projectType}>
                          {project.stack
                            .map((item) => item.label)
                            .slice(0, 3)
                            .join(" · ")}
                        </span>

                        <h3>{project.title}</h3>
                      </div>

                      <Arrow />
                      <p>{project.summary}</p>
                    </div>
                  </a>
                </Reveal>
              ))}
            </div>

            <Reveal className={styles.allProjects}>
              <a
                href={profile.links.github.href}
                target="_blank"
                rel="noreferrer"
              >
                {t.allRepositories} <Arrow />
              </a>
            </Reveal>
          </div>
        </section>

        <section className={styles.domainsSection}>
          <div className={styles.sectionInner}>
            <SectionLabel number="03">{t.practice}</SectionLabel>

            <Reveal>
              <h2 className={styles.massiveHeading}>
                {t.waysTitle} <i>{t.waysEmphasis}</i>
              </h2>
            </Reveal>

            <div className={styles.domainList}>
              {messages.domains.map((domain, index) => (
                <Reveal key={domain.title} className={styles.domainRow}>
                  <span className={styles.domainIndex}>
                    0{index + 1}
                  </span>

                  <h3>{domain.title}</h3>
                  <p>{domain.text}</p>

                  <div className={styles.domainTags}>
                    {(domainTags[index] ?? []).map((tag) => (
                      <span key={tag}>{tag}</span>
                    ))}
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section
          id="capabilities"
          className={styles.capabilitiesSection}
        >
          <div className={styles.sectionInner}>
            <SectionLabel number="04">{t.capabilities}</SectionLabel>

            <div className={styles.capabilityGrid}>
              <Reveal>
                <h2>
                  {t.toolsTitle} <i>{t.toolsEmphasis}</i>
                </h2>
                <p>{t.stackIntro}</p>
              </Reveal>

              <Reveal className={styles.skillColumn}>
                <p className={styles.kicker}>{t.coreSkills}</p>

                {skills.slice(0, 6).map((skill, index) => (
                  <div className={styles.skillRow} key={skill.id}>
                    <span>{String(index + 1).padStart(2, "0")}</span>
                    <strong>{skill.label}</strong>
                    <span aria-hidden="true">●</span>
                  </div>
                ))}
              </Reveal>
            </div>

            <Reveal className={styles.techCloud}>
              {tech.map((item, index) => (
                <span
                  key={item}
                  style={{ "--i": index } as CSSProperties}
                >
                  {item}
                </span>
              ))}
            </Reveal>
          </div>
        </section>

        <section className={styles.processSection}>
          <div className={styles.sectionInner}>
            <SectionLabel number="05">{t.process}</SectionLabel>

            <div className={styles.sectionHeadingRow}>
              <Reveal>
                <h2>
                  {t.processTitle} <i>{t.processEmphasis}</i>{" "}
                  {t.processEnd}
                </h2>
              </Reveal>

              <Reveal>
                <p>{t.processIntro}</p>
              </Reveal>
            </div>

            <div className={styles.processList}>
              {process.map((step, index) => (
                <Reveal
                  className={styles.processRow}
                  key={step.key}
                >
                  <span>0{index + 1}</span>

                  <h3>
                    {messages.processLabels[index] ?? step.label}
                  </h3>

                  <p>
                    {messages.processDescriptions[index] ??
                      (locale === "es"
                        ? "Definir, construir, probar y mejorar."
                        : "Define, build, test, and improve.")}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className={styles.aboutSection}>
          <div className={styles.sectionInner}>
            <SectionLabel number="06">{t.about}</SectionLabel>

            <div className={styles.aboutGrid}>
              <Reveal>
                <h2>
                  {t.aboutTitle} <i>{t.aboutEmphasis}</i>
                </h2>
              </Reveal>

              <Reveal className={styles.aboutCopy}>
                <p>
                  {t.aboutOne
                    .replace("{name}", profile.fullName)
                    .replace("{title}", profile.title)
                    .replace("{city}", profile.location.city)}
                </p>

                <p>{t.aboutTwo}</p>
                <p>{profile.availability}</p>
              </Reveal>
            </div>

            <div className={styles.aboutFacts}>
              <Reveal>
                <span>{t.based}</span>
                <strong>{profile.location.city}</strong>
              </Reveal>

              <Reveal>
                <span>{t.focus}</span>
                <strong>Frontend · Backend · 3D</strong>
              </Reveal>

              <Reveal>
                <span>{t.learning}</span>
                <strong>
                  {learning
                    .slice(0, 2)
                    .map((item) => item.label)
                    .join(" · ") ||
                    (locale === "es"
                      ? "Sistemas y WebGL"
                      : "Systems & WebGL")}
                </strong>
              </Reveal>

              <Reveal>
                <span>{t.experience}</span>
                <strong>
                  {experience[0]?.period?.start ?? "2024"} — {t.now}
                </strong>
              </Reveal>
            </div>
          </div>
        </section>

        <section className={styles.nowSection}>
          <div className={styles.marquee} aria-hidden="true">
            <span>{t.marquee}</span>
          </div>
        </section>

        <section id="contact" className={styles.contactSection}>
          <div className={styles.sectionInner}>
            <SectionLabel number="07">{t.contact}</SectionLabel>

            <Reveal>
              <p className={styles.contactEyebrow}>
                {t.contactEyebrow}
              </p>

              <h2>
                {t.contactTitle} <i>{t.contactEmphasis}</i>
              </h2>
            </Reveal>

            <Reveal className={styles.contactActions}>
              <a
                className={styles.contactMail}
                href={`mailto:${profile.email}`}
              >
                {profile.email} <Arrow />
              </a>

              <a
                className={styles.contactSecondary}
                href={profile.links.github.href}
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>

              <a
                className={styles.contactSecondary}
                href={profile.links.linkedin.href}
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div>
          <span>© {new Date().getFullYear()} Velasco-c</span>
          <span>{t.built}</span>
        </div>

        <a href="#top">
          {messages.accessibility.backToTop} ↑
        </a>
      </footer>
    </>
  );
}
