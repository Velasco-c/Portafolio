"use client";

import { useId, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import styles from "./home-page.module.css";

/**
 * Header navigation. Always visible on wide screens; on small screens it folds into a
 * toggle button and closes once a section is chosen or Escape is pressed.
 */
export function HeaderNav({ label, children }: { label: string; children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const menuId = useId();

  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  }

  function closeOnEscape(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") setOpen(false);
  }

  return (
    <div className={styles.menu} data-open={open ? "true" : undefined} onKeyDown={closeOnEscape}>
      <button
        type="button"
        className={styles.menuToggle}
        aria-label={label}
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((value) => !value)}
      />
      <nav id={menuId} className={styles.nav} aria-label={label} onClick={closeOnLink}>
        {children}
      </nav>
    </div>
  );
}
