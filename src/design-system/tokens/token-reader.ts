import type { TokenName } from "./token-names";

const cache = new Map<string, string>();

export function readStringToken(name: TokenName): string {
  if (typeof window === "undefined") return "";
  const cached = cache.get(name);
  if (cached !== undefined) return cached;
  const value = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  cache.set(name, value);
  return value;
}

export function readNumberToken(name: TokenName): number {
  const value = readStringToken(name);
  const parsed = Number.parseFloat(value);
  if (!Number.isFinite(parsed)) return 0;
  return value.endsWith("ms") ? parsed : value.endsWith("s") ? parsed * 1000 : parsed;
}

export function readColorToken(name: TokenName): [number, number, number] | null {
  const value = readStringToken(name);
  if (!value || typeof document === "undefined") return null;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) return null;
  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const pixel = context.getImageData(0, 0, 1, 1).data;
  return [pixel[0] ?? 0, pixel[1] ?? 0, pixel[2] ?? 0];
}

export function clearTokenCache(): void {
  cache.clear();
}
