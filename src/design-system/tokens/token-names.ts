export const tokenNames = [
  "--color-bg", "--color-bg-raised", "--color-text", "--color-text-muted",
  "--color-text-subtle", "--color-border", "--color-focus", "--iris-cyan",
  "--iris-violet", "--iris-magenta", "--iris-amber", "--iris-mint",
  "--iris-edge", "--font-display", "--font-body", "--font-mono",
  "--text-display-xl", "--text-display-l", "--text-display-m", "--text-lead",
  "--text-body", "--text-small", "--text-meta", "--section-pad", "--page-gutter",
  "--radius-sm", "--radius-md", "--radius-lg", "--radius-xl", "--radius-full",
  "--shadow-1", "--shadow-2", "--shadow-3", "--shadow-4",
  "--motion-duration-instant", "--motion-duration-fast", "--motion-duration-normal",
  "--motion-duration-slow", "--motion-duration-cinematic", "--motion-ease-standard",
  "--motion-ease-enter", "--motion-ease-exit", "--motion-ease-emphasis",
] as const;

export type TokenName = (typeof tokenNames)[number];
