/** Media conditions shared by animation systems (06 §11, 04 §2). */
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
export const FINE_POINTER = "(hover: hover) and (pointer: fine)";
export const DESKTOP_LAYOUT = "(min-width: 1024px)";
export const TOUCH = "(hover: none), (pointer: coarse)";

export const ANIMATION_MEDIA = {
  motionOk: MOTION_OK,
  reducedMotion: REDUCED_MOTION,
  finePointer: FINE_POINTER,
  desktopLayout: DESKTOP_LAYOUT,
  touch: TOUCH,
} as const;

/** Returns false during SSR and in browsers that do not expose matchMedia. */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia(REDUCED_MOTION).matches
  );
}
