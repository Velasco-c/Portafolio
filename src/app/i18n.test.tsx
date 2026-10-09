import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import LocalePage from "./(localized)/[locale]/page";
import RootPage from "./(default)/page";
import { Document } from "./document";
import { getLocaleMetadata } from "../i18n/metadata";
import { isLocale } from "../i18n/config";

describe("locale routes", () => {
  it("renders Spanish and English through the same page with matching language labels", async () => {
    for (const locale of ["es", "en"] as const) {
      const page = await LocalePage({ params: Promise.resolve({ locale }) });
      const documentElement = Document({ children: page, lang: locale });
      expect(documentElement.props.lang).toBe(locale);
      const { unmount } = render(page);
      expect(screen.getByRole("navigation", { name: locale === "es" ? "Navegación principal" : "Primary navigation" })).toBeTruthy();
      expect(screen.getByRole("heading", { level: 1 }).textContent).toContain(locale === "es" ? "Creo sistemas digitales" : "I build digital systems");
      const nav = screen.getByRole("navigation", { name: locale === "es" ? "Navegación principal" : "Primary navigation" });
      expect(within(nav).getByRole("link", { name: locale === "es" ? "Proyectos" : "Work" }).getAttribute("href")).toBe("#work");
      expect(document.getElementById("contact")).toBeTruthy();
      unmount();
    }
  });

  it("redirects the unprefixed page to Spanish", () => {
    expect(RootPage).toThrowError(/NEXT_REDIRECT/);
  });

  it("rejects unsupported locales", async () => {
    expect(isLocale("fr")).toBe(false);
    await expect(LocalePage({ params: Promise.resolve({ locale: "fr" }) })).rejects.toThrow(/NEXT_HTTP_ERROR_FALLBACK;404/);
  });

  it("provides locale-specific metadata with canonical and alternate URLs", () => {
    const spanish = getLocaleMetadata("es");
    const english = getLocaleMetadata("en");
    expect(spanish.title).toContain("Desarrollador de Software");
    expect(english.title).toContain("Software Engineer");
    expect(spanish.description).not.toBe(english.description);
    expect(spanish.alternates).toEqual({ canonical: "/es", languages: { es: "/es", en: "/en" } });
  });
});
