/** Key that stores the visitor's answer to the cookie notice. */
export const CONSENT_STORAGE_KEY = "portfolio-consent";

export type ConsentChoice = "accepted" | "declined";
const CONSENT_CHANGE_EVENT = "portfolio:consent-change";

/** Returns the saved answer, or null when the visitor has not chosen yet. */
export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;

  try {
    const value = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    return value === "accepted" || value === "declined" ? value : null;
  } catch {
    return null;
  }
}

/** Preferences are saved only after the visitor accepts the notice. */
export function canStorePreferences(): boolean {
  return readConsent() === "accepted";
}

export function saveConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, choice);
  } catch {
    // Storage is blocked: the notice will simply appear again on the next visit.
  }
  window.dispatchEvent(new Event(CONSENT_CHANGE_EVENT));
}

export function subscribeConsent(listener: () => void): () => void {
  window.addEventListener("storage", listener);
  window.addEventListener(CONSENT_CHANGE_EVENT, listener);
  return () => {
    window.removeEventListener("storage", listener);
    window.removeEventListener(CONSENT_CHANGE_EVENT, listener);
  };
}
