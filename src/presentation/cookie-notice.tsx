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

type NoticeState = "hidden" | "visible" | "closing";

const CLOSE_DURATION_MS = 280;
const OPEN_NOTICE_EVENT = "portfolio:open-cookie-notice";

/** Explains the local storage used for the theme and asks the visitor to accept it. */
export function CookieNotice({ labels }: { labels: CookieNoticeLabels }) {
  const consent = useSyncExternalStore(subscribeConsent, readConsent, () => null);
  const [state, setState] = useState<NoticeState>("visible");
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => {
      setReopened(true);
      setState("visible");
    };
    window.addEventListener(OPEN_NOTICE_EVENT, open);
    return () => window.removeEventListener(OPEN_NOTICE_EVENT, open);
  }, []);

  useEffect(() => {
    if (state !== "closing") return;
    const timer = window.setTimeout(() => setState("hidden"), CLOSE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "hidden" || (consent !== null && !reopened && state !== "closing")) {
    return null;
  }

  function choose(choice: ConsentChoice) {
    saveConsent(choice);
    if (choice === "declined") forgetStoredTheme();
    setReopened(false);
    setState("closing");
  }

  return (
    <section className={styles.notice} data-state={state} aria-label={labels.label}>
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
