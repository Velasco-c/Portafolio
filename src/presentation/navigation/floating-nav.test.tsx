import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { FloatingNav } from "./floating-nav";

const labels = ["WORK", "ABOUT", "SKILLS", "CONTACT"];

function mockDialogMethods() {
  Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
    configurable: true,
    value(this: HTMLDialogElement) { this.setAttribute("open", ""); },
  });
  Object.defineProperty(HTMLDialogElement.prototype, "close", {
    configurable: true,
    value(this: HTMLDialogElement) {
      this.removeAttribute("open");
      this.dispatchEvent(new Event("close"));
    },
  });
}

describe("FloatingNav", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    document.documentElement.dataset.theme = "dark";
    window.localStorage.clear();
  });

  it("abre el diálogo móvil, cierra con Escape y devuelve el foco al activador", async () => {
    const user = userEvent.setup();
    mockDialogMethods();
    render(<FloatingNav labels={labels} />);

    const trigger = screen.getByRole("button", { name: "Abrir menú" });
    await user.click(trigger);
    const dialog = screen.getByRole("dialog", { name: "Navegación móvil" });
    expect(dialog.hasAttribute("open")).toBe(true);

    fireEvent(dialog, new Event("cancel", { bubbles: false, cancelable: true }));
    await waitFor(() => expect(dialog.hasAttribute("open")).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(trigger));

    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    const closeButton = within(screen.getByRole("dialog", { name: "Navegación móvil" }))
      .getByRole("button", { name: "Cerrar menú" });
    await user.click(closeButton);
    await waitFor(() => expect(dialog.hasAttribute("open")).toBe(false));
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: "Abrir menú" })));
  });

  it("al elegir un enlace cierra sin robar el foco de navegación", async () => {
    const user = userEvent.setup();
    mockDialogMethods();
    render(<FloatingNav labels={labels} />);
    await user.click(screen.getByRole("button", { name: "Abrir menú" }));
    const dialog = screen.getByRole("dialog", { name: "Navegación móvil" });
    const mobileNav = within(dialog).getByRole("navigation", { name: "Navegación móvil" });
    const workLink = within(mobileNav).getByRole("link", { name: "WORK" });
    await user.click(workLink);
    await waitFor(() => expect(dialog.hasAttribute("open")).toBe(false));
    expect(workLink.getAttribute("href")).toBe("#work");
    expect(document.activeElement).not.toBe(screen.getByRole("button", { name: "Abrir menú" }));
  });

  it("cambia y persiste el tema con estado accesible", async () => {
    const user = userEvent.setup();
    document.documentElement.dataset.theme = "dark";
    render(<FloatingNav labels={labels} />);
    const toggle = screen.getByRole("button", { name: "Cambiar tema" });
    expect(toggle.getAttribute("aria-pressed")).toBe("false");
    expect(screen.getByRole("status").textContent).toBe("Tema actual: oscuro");

    await user.click(toggle);
    await waitFor(() => expect(document.documentElement.dataset.theme).toBe("light"));
    expect(toggle.getAttribute("aria-pressed")).toBe("true");
    expect(window.localStorage.getItem("portfolio-theme")).toBe("light");
    expect(screen.getByRole("status").textContent).toBe("Tema actual: claro");
  });
});
