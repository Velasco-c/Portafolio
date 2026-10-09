export interface PointerPosition {
  readonly x: number;
  readonly y: number;
}

type PointerListener = (position: PointerPosition) => void;

let target: PointerPosition = { x: 0, y: 0 };
const listeners = new Set<PointerListener>();

function handlePointerMove(event: PointerEvent): void {
  target = { x: event.clientX, y: event.clientY };
  for (const listener of listeners) listener(target);
}

/** Reads the most recently observed client-space pointer position. */
export function getPointerTarget(): PointerPosition {
  return target;
}

/** Subscribes to pointer targets, sharing one passive window listener. */
export function subscribePointerTarget(listener: PointerListener): () => void {
  if (typeof window === "undefined") return () => undefined;

  listeners.add(listener);
  if (listeners.size === 1) {
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
  }

  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.removeEventListener("pointermove", handlePointerMove);
    }
  };
}
