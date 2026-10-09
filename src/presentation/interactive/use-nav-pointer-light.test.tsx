import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useNavPointerLight } from "./use-nav-pointer-light";

type ChangeListener = (event: MediaQueryListEvent) => void;

function installMediaQueries(fine: boolean, motion: boolean) {
  const values = new Map([
    ["(hover: hover) and (pointer: fine)", fine],
    ["(prefers-reduced-motion: no-preference)", motion],
  ]);
  const listeners = new Map<string, Set<ChangeListener>>();
  const matchMedia = vi.fn((query: string) => ({
    media: query,
    get matches() { return values.get(query) ?? false; },
    onchange: null,
    addEventListener: (_type: string, listener: ChangeListener) => {
      const queryListeners = listeners.get(query) ?? new Set<ChangeListener>();
      queryListeners.add(listener);
      listeners.set(query, queryListeners);
    },
    removeEventListener: (_type: string, listener: ChangeListener) => listeners.get(query)?.delete(listener),
    addListener: () => undefined,
    removeListener: () => undefined,
    dispatchEvent: () => true,
  } as unknown as MediaQueryList));
  vi.stubGlobal("matchMedia", matchMedia);
  return {
    set(query: string, value: boolean) {
      values.set(query, value);
      act(() => listeners.get(query)?.forEach((listener) => listener({ matches: value } as MediaQueryListEvent)));
    },
    listeners,
  };
}

describe("useNavPointerLight", () => {
  afterEach(() => {
    document.documentElement.style.removeProperty("--nav-pointer-x");
    document.documentElement.style.removeProperty("--nav-pointer-y");
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("subscribes only with fine pointer and no reduced motion, and cleans both gates on change and unmount", () => {
    const media = installMediaQueries(false, true);
    const nativeAdd = vi.spyOn(window, "addEventListener");
    const { result, unmount } = renderHook(() => useNavPointerLight());

    expect(result.current).toBe(false);
    expect(nativeAdd).not.toHaveBeenCalledWith("pointermove", expect.any(Function), { passive: true });
    expect(media.listeners.get("(hover: hover) and (pointer: fine)")?.size).toBe(1);
    expect(media.listeners.get("(prefers-reduced-motion: no-preference)")?.size).toBe(1);

    media.set("(hover: hover) and (pointer: fine)", true);
    expect(result.current).toBe(true);
    expect(nativeAdd).toHaveBeenCalledWith("pointermove", expect.any(Function), { passive: true });

    const nativeRemove = vi.spyOn(window, "removeEventListener");
    media.set("(prefers-reduced-motion: no-preference)", false);
    expect(result.current).toBe(false);
    expect(document.documentElement.style.getPropertyValue("--nav-pointer-x")).toBe("");
    expect(nativeRemove).toHaveBeenCalledWith("pointermove", expect.any(Function));

    unmount();
    expect(media.listeners.get("(hover: hover) and (pointer: fine)")?.size).toBe(0);
    expect(media.listeners.get("(prefers-reduced-motion: no-preference)")?.size).toBe(0);
  });

  it("writes client-space coordinates and removes pointer subscription when coarse/reduced motion is active", () => {
    const media = installMediaQueries(true, true);
    const nativeAdd = vi.spyOn(window, "addEventListener");
    const { result, unmount } = renderHook(() => useNavPointerLight());

    expect(result.current).toBe(true);
    expect(nativeAdd).toHaveBeenCalledWith("pointermove", expect.any(Function), { passive: true });
    act(() => window.dispatchEvent(Object.assign(new Event("pointermove"), { clientX: 37, clientY: 82 })));
    expect(document.documentElement.style.getPropertyValue("--nav-pointer-x")).toBe("37px");
    expect(document.documentElement.style.getPropertyValue("--nav-pointer-y")).toBe("82px");

    media.set("(hover: hover) and (pointer: fine)", false);
    expect(result.current).toBe(false);
    expect(document.documentElement.style.getPropertyValue("--nav-pointer-x")).toBe("");
    expect(document.documentElement.style.getPropertyValue("--nav-pointer-y")).toBe("");
    unmount();
  });

  it("degrades to static when matchMedia is unavailable", () => {
    vi.stubGlobal("matchMedia", undefined);
    const { result } = renderHook(() => useNavPointerLight());
    expect(result.current).toBe(false);
  });
});
