import { afterEach, describe, expect, it, vi } from "vitest";
import {
  clearTokenCache,
  readNumberToken,
  readStringToken,
} from "./token-reader";

afterEach(() => {
  clearTokenCache();
  document.documentElement.style.removeProperty("--motion-duration-fast");
  vi.restoreAllMocks();
});

describe("token reader", () => {
  it("reads and caches CSS tokens until the cache is invalidated", () => {
    document.documentElement.style.setProperty("--motion-duration-fast", "180ms");

    expect(readNumberToken("--motion-duration-fast")).toBe(180);
    document.documentElement.style.setProperty("--motion-duration-fast", "140ms");
    expect(readStringToken("--motion-duration-fast")).toBe("180ms");

    clearTokenCache();

    expect(readNumberToken("--motion-duration-fast")).toBe(140);
  });

  it("returns zero for a non-numeric value", () => {
    document.documentElement.style.setProperty("--motion-duration-fast", "ease");

    expect(readNumberToken("--motion-duration-fast")).toBe(0);
  });
});
