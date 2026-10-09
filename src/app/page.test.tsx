import { createElement } from "react";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { loadHomeContent } from "@/app/composition";
import { HomePage } from "@/presentation/home-page";
import { getDictionary } from "@/i18n/dictionaries";
import type { Locale } from "@/i18n/config";

describe("portfolio home", () => {
  it("renders the complete editorial navigation and main landmarks", async () => {
    const locale: Locale = "en";
    const content = await loadHomeContent(locale);
    render(createElement(HomePage, { content, locale, messages: getDictionary(locale) }));

    expect(screen.getByRole("main")).toBeTruthy();
    const { heroTitle, heroEmphasis } = getDictionary(locale).home;
    expect(screen.getByRole("heading", { level: 1 }).textContent).toBe(`${heroTitle} ${heroEmphasis}`);
    const nav = screen.getByRole("navigation", { name: "Primary navigation" });
    for (const id of ["work", "about", "capabilities", "contact"]) {
      expect(document.getElementById(id)).toBeTruthy();
      expect(within(nav).getByRole("link", { name: new RegExp(id, "i") }).getAttribute("href")).toBe(`#${id}`);
    }
  });

  it("keeps portfolio content connected to the composed data", async () => {
    const locale: Locale = "en";
    const content = await loadHomeContent(locale);
    render(createElement(HomePage, { content, locale, messages: getDictionary(locale) }));

    const work = document.getElementById("work")!;
    for (const project of content.projects.slice(0, 4)) {
      expect(work.textContent).toContain(project.title);
      expect(work.textContent).toContain(project.summary);
      expect(work.querySelector(`a[href="${project.repository.href}"]`)).toBeTruthy();
    }

    const about = document.getElementById("about")!;
    expect(about.textContent).toContain(content.profile.title);
    expect(about.textContent).toContain(content.profile.location.city);
    expect(about.textContent).toContain(content.profile.availability);
  });

  it("renders the contact links and profile portrait", async () => {
    const locale: Locale = "en";
    const content = await loadHomeContent(locale);
    render(createElement(HomePage, { content, locale, messages: getDictionary(locale) }));

    const heroImage = screen.getByRole("img", { name: content.profile.photo.alt });
    expect(heroImage.getAttribute("src")).toBe(content.profile.photo.src);

    const contact = document.getElementById("contact")!;
    expect(contact.textContent).toContain(content.profile.email);
    expect(contact.querySelector(`a[href="mailto:${content.profile.email}"]`)).toBeTruthy();
    expect(contact.querySelector(`a[href="${content.profile.links.github.href}"]`)).toBeTruthy();
    expect(contact.querySelector(`a[href="${content.profile.links.linkedin.href}"]`)).toBeTruthy();
  });

  it("renders all six process steps without pending placeholders", async () => {
    const locale: Locale = "en";
    const content = await loadHomeContent(locale);
    render(createElement(HomePage, { content, locale, messages: getDictionary(locale) }));

    const processLabels = content.process.map(({ label }) => label);
    const process = screen.getByText("Process").closest("section")!;
    for (const label of processLabels) expect(process.textContent).toContain(label);
    expect(process.innerHTML).not.toContain("[PENDIENTE]");
  });
});
