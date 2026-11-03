import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it } from "vitest";
import { ThemeSwitch } from "./theme-switch";

const labels = { mode: "Modo de visualización", light: "Claro", dark: "Oscuro" };

afterEach(() => {
  document.documentElement.removeAttribute("data-theme");
  window.localStorage.clear();
});

describe("ThemeSwitch", () => {
  it("offers Claro and Oscuro as a pressed-state group and saves the chosen theme", async () => {
    const user = userEvent.setup();
    document.documentElement.dataset.theme = "dark";
    render(<ThemeSwitch labels={labels} />);

    const group = screen.getByRole("group", { name: "Modo de visualización" });
    const light = within(group).getByRole("button", { name: "Claro" });
    const dark = within(group).getByRole("button", { name: "Oscuro" });
    expect(dark.getAttribute("aria-pressed")).toBe("true");
    expect(light.getAttribute("aria-pressed")).toBe("false");

    await user.click(light);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light"));
    expect(light.getAttribute("aria-pressed")).toBe("true");
    expect(dark.getAttribute("aria-pressed")).toBe("false");
    expect(window.localStorage.getItem("portfolio-theme")).toBe("light");
  });
});
