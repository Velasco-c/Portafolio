"use client";

import { useEffect, useRef, useState } from "react";
import { transitionTheme } from "../../animations/theme-transition/transition-theme";
import { setTheme, useTheme } from "../../design-system/theme/theme-store";
import { useNavPointerLight } from "../interactive/use-nav-pointer-light";
import styles from "./floating-nav.module.css";

const navigation = [
  { id: "work", index: 0 },
  { id: "about", index: 1 },
  { id: "skills", index: 2 },
  { id: "contact", index: 3 },
] as const;

function ThemeToggle() {
  const theme = useTheme();
  const isLight = theme === "light";

  function toggleTheme() {
    transitionTheme(() => setTheme(isLight ? "dark" : "light"));
  }

  return <div className={styles.themeControl}>
    <button
      className={styles.themeToggle}
      type="button"
      aria-label="Cambiar tema"
      aria-pressed={isLight}
      aria-describedby="current-theme"
      onClick={toggleTheme}
    >
      <span aria-hidden="true">{isLight ? "☼" : "◐"}</span>
    </button>
    <span className={styles.srOnly} id="current-theme" role="status">Tema actual: {isLight ? "claro" : "oscuro"}</span>
  </div>;
}

export function FloatingNav({ labels }: { labels: readonly string[] }) {
  const pointerLight = useNavPointerLight();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const closingFromLink = useRef(false);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen && !dialog.open) dialog.showModal();
    if (!menuOpen && dialog.open) dialog.close();
  }, [menuOpen]);

  function closeFromNavigation() {
    closingFromLink.current = true;
    setMenuOpen(false);
  }

  function handleDialogClose() {
    setMenuOpen(false);
    if (closingFromLink.current) {
      closingFromLink.current = false;
      return;
    }
    triggerRef.current?.focus();
  }

  return <header className={styles.header}>
    <nav className={`${styles.nav}${pointerLight ? ` ${styles.pointerLight}` : ""}`} aria-label="Navegación principal">
      <a className={styles.brand} href="#hero" aria-label="Inicio, Carlos Elias Tzoy Velasco">CT</a>
      <ul className={styles.desktopLinks}>
        {navigation.map(({ id, index }) => <li key={id}>
          <a href={`#${id}`}>{labels[index] ?? id.toUpperCase()}</a>
        </li>)}
      </ul>
      <div className={styles.controls}>
        <ThemeToggle />
        <button
          ref={triggerRef}
          className={styles.menuButton}
          type="button"
          aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation-dialog"
          onClick={() => setMenuOpen(true)}
        ><span aria-hidden="true">{menuOpen ? "×" : "☰"}</span></button>
      </div>
    </nav>
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      id="mobile-navigation-dialog"
      aria-label="Navegación móvil"
      onClose={handleDialogClose}
      onCancel={() => setMenuOpen(false)}
      onClick={(event) => { if (event.target === dialogRef.current) setMenuOpen(false); }}
    >
      <nav aria-label="Navegación móvil">
        <button className={styles.dialogClose} type="button" onClick={() => setMenuOpen(false)}>Cerrar menú</button>
        <ul className={styles.dialogLinks}>
          {navigation.map(({ id, index }) => <li key={id}>
            <a href={`#${id}`} onClick={closeFromNavigation}>{labels[index] ?? id.toUpperCase()}</a>
          </li>)}
        </ul>
      </nav>
    </dialog>
  </header>;
}
