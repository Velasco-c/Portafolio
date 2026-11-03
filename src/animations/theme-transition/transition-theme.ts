import { prefersReducedMotion } from "../media/conditions";

type ViewTransitionDocument = Document & {
  startViewTransition?: (update: () => void) => { finished: Promise<void> };
};

/** Applies a theme update through View Transitions when supported. */
export function transitionTheme(updateTheme: () => void): void {
  if (typeof document === "undefined" || prefersReducedMotion()) {
    updateTheme();
    return;
  }

  const startViewTransition = (document as ViewTransitionDocument)
    .startViewTransition;

  if (typeof startViewTransition === "function") {
    startViewTransition.call(document, updateTheme);
    return;
  }

  updateTheme();
}
