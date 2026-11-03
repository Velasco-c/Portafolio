import { afterEach, describe, expect, it, vi } from "vitest";
import { getTheme, setTheme, subscribe } from "./theme-store";

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
  Reflect.deleteProperty(window, "matchMedia");
  vi.restoreAllMocks();
});

describe("theme store", () => {
  it("persists explicit choices, updates the document and notifies subscribers", () => {
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    setTheme("light");

    expect(getTheme()).toBe("light");
    expect(document.documentElement.dataset.theme).toBe("light");
    expect(window.localStorage.getItem("portfolio-theme")).toBe("light");
    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
  });

  it("follows system preference changes when no explicit choice is stored", () => {
    let changeListener: ((event: MediaQueryListEvent) => void) | undefined;
    const mediaQuery = {
      matches: false,
      addEventListener: vi.fn((_type: string, listener: (event: MediaQueryListEvent) => void) => {
        changeListener = listener;
      }),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList;
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: vi.fn().mockReturnValue(mediaQuery),
    });
    const listener = vi.fn();
    const unsubscribe = subscribe(listener);

    changeListener?.({ matches: true } as MediaQueryListEvent);

    expect(document.documentElement.dataset.theme).toBe("light");
    expect(getTheme()).toBe("light");
    expect(listener).toHaveBeenCalledOnce();

    unsubscribe();
    expect(mediaQuery.removeEventListener).toHaveBeenCalledOnce();
  });
});
