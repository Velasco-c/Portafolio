"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { forgetStoredTheme } from "../design-system/theme/theme-store";
import {
  readConsent,
  saveConsent,
  subscribeConsent,
  type ConsentChoice,
} from "../infrastructure/consent/consent";
import styles from "./cookie-notice.module.css";

interface CookieNoticeLabels {
  label: string;
  text: string;
  accept: string;
  decline: string;
}

/** "pending" is what the server and the first client render see, so the notice never flashes for returning visitors. */
type ConsentSnapshot = ConsentChoice | null | "pending";

const CLOSE_DURATION_MS = 280;
const OPEN_NOTICE_EVENT = "portfolio:open-cookie-notice";

/** Explains the local storage used for the theme and asks the visitor to accept it. */
export function CookieNotice({ labels }: { labels: CookieNoticeLabels }) {
  const consent = useSyncExternalStore<ConsentSnapshot>(
    subscribeConsent,
    readConsent,
    () => "pending",
  );
  // Reopened from the footer, even when an answer already exists.
  const [requested, setRequested] = useState(false);
  // True while the closing animation plays after a choice.
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    const open = () => {
      setClosing(false);
      setRequested(true);
    };
    window.addEventListener(OPEN_NOTICE_EVENT, open);
    return () => window.removeEventListener(OPEN_NOTICE_EVENT, open);
  }, []);

  useEffect(() => {
    if (!closing) return;
    const timer = window.setTimeout(() => {
      setClosing(false);
      setRequested(false);
    }, CLOSE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [closing]);

  const visible = consent === null || requested || closing;
  if (!visible) return null;

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    if (choice === "declined") forgetStoredTheme();
    setClosing(true);
  }

  return (
    <section
      className={styles.notice}
      data-state={closing ? "closing" : "visible"}
      aria-label={labels.label}
    >
      <p>{labels.text}</p>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={() => choose("declined")}>
          {labels.decline}
        </button>
        <button type="button" className={styles.accept} onClick={() => choose("accepted")}>
          {labels.accept}
        </button>
      </div>
    </section>
  );
}

/** Footer control that reopens the notice so the visitor can change their answer. */
export function CookiePreferencesButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      className={styles.preferences}
      onClick={() => window.dispatchEvent(new Event(OPEN_NOTICE_EVENT))}
    >
      {label}
    </button>
  );
}
