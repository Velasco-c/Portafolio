"use client";

/* eslint-disable @next/next/no-location-assign-relative-destination -- Language changes reload the root layout to avoid re-rendering its beforeInteractive script in React. */
import type { MouseEvent } from "react";
import type { Locale } from "../i18n/config";
import { sitePath } from "../infrastructure/site-path";
import styles from "./language-switcher.module.css";

export function LanguageSwitcher({ locale, label, switchLabel }: { locale: Locale; label: string; switchLabel: string }) {
  function preserveSection(event: MouseEvent<HTMLAnchorElement>, target: Locale) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    window.location.href = `${sitePath(`/${target}`)}${window.location.hash}`;
  }
  return <nav className={styles.switcher} aria-label={label}>
    <a href={sitePath("/es")} lang="es" aria-current={locale === "es" ? "page" : undefined} aria-label={locale === "en" ? switchLabel : "Español"} onClick={(event) => preserveSection(event, "es")}>ES</a>
    <span aria-hidden="true">/</span>
    <a href={sitePath("/en")} lang="en" aria-current={locale === "en" ? "page" : undefined} aria-label={locale === "es" ? switchLabel : "English"} onClick={(event) => preserveSection(event, "en")}>EN</a>
  </nav>;
}
