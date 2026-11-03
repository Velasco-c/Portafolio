"use client";

import { transitionTheme } from "../animations/theme-transition/transition-theme";
import { setTheme, useTheme, type Theme } from "../design-system/theme/theme-store";
import styles from "./theme-switch.module.css";

interface ThemeSwitchLabels {
  mode: string;
  light: string;
  dark: string;
}

const themes: readonly Theme[] = ["light", "dark"];

/** Two-option light/dark control. The choice is persisted by the theme store. */
export function ThemeSwitch({ labels }: { labels: ThemeSwitchLabels }) {
  const theme = useTheme();

  return <div className={styles.switch} role="group" aria-label={labels.mode}>
    {themes.map((option) => <button
      key={option}
      className={styles.option}
      data-value={option}
      type="button"
      aria-pressed={theme === option}
      onClick={() => {
        if (theme !== option) transitionTheme(() => setTheme(option));
      }}
    >
      {labels[option]}
    </button>)}
  </div>;
}
