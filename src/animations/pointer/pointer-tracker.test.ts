import { afterEach, describe, expect, it, vi } from "vitest";
import { subscribePointerTarget } from "./pointer-tracker";

describe("pointer tracker", () => {
  afterEach(() => vi.restoreAllMocks());

  it("shares one passive listener, emits client coordinates, and removes the listener after the last unsubscribe", () => {
    const add = vi.spyOn(window, "addEventListener");
    const remove = vi.spyOn(window, "removeEventListener");
    const first = vi.fn();
    const second = vi.fn();
    const unsubscribeFirst = subscribePointerTarget(first);
    const unsubscribeSecond = subscribePointerTarget(second);

    expect(add.mock.calls.filter(([type]) => type === "pointermove")).toHaveLength(1);
    actPointerMove(28, 64);
    expect(first).toHaveBeenCalledWith({ x: 28, y: 64 });
    expect(second).toHaveBeenCalledWith({ x: 28, y: 64 });

    unsubscribeFirst();
    expect(remove).not.toHaveBeenCalledWith("pointermove", expect.any(Function));
    unsubscribeSecond();
    expect(remove).toHaveBeenCalledWith("pointermove", expect.any(Function));
  });
});

function actPointerMove(clientX: number, clientY: number) {
  window.dispatchEvent(Object.assign(new Event("pointermove"), { clientX, clientY }));
}
