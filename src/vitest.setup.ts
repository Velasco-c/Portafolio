import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";
import { createElement } from "react";
import { vi } from "vitest";

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: vi.fn() }),
  redirect: (destination: string) => { throw new Error(`NEXT_REDIRECT;${destination}`); },
  notFound: () => { throw new Error("NEXT_HTTP_ERROR_FALLBACK;404"); },
}));
vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => createElement("a", { href, ...props }, children),
}));
vi.mock("@/graphics/three/three-background", () => ({ ThreeBackground: () => null }));
vi.mock("@/animations/components/smooth-scroll", () => ({ SmoothScroll: () => null }));
vi.mock("@/animations/components/page-motion", () => ({ PageMotion: () => null }));

// Con `globals: false`, Testing Library no registra su limpieza automática.
afterEach(() => {
  cleanup();
});
