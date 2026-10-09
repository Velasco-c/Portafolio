"use client";

import { useEffect, useState } from "react";
import { FINE_POINTER, MOTION_OK } from "../../animations/media/conditions";
import { subscribePointerTarget } from "../../animations/pointer/pointer-tracker";

const X_PROPERTY = "--nav-pointer-x";
const Y_PROPERTY = "--nav-pointer-y";

/** Enables viewport-coordinate tracking only while both media capabilities allow it. */
export function useNavPointerLight(): boolean {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    const finePointer = window.matchMedia(FINE_POINTER);
    const motionOk = window.matchMedia(MOTION_OK);
    if (
      typeof finePointer.addEventListener !== "function" ||
      typeof finePointer.removeEventListener !== "function" ||
      typeof motionOk.addEventListener !== "function" ||
      typeof motionOk.removeEventListener !== "function"
    ) return;

    const update = () => setEnabled(finePointer.matches && motionOk.matches);
    finePointer.addEventListener("change", update);
    motionOk.addEventListener("change", update);
    update();

    return () => {
      finePointer.removeEventListener("change", update);
      motionOk.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    if (!enabled) {
      root.style.removeProperty(X_PROPERTY);
      root.style.removeProperty(Y_PROPERTY);
      return;
    }

    const unsubscribe = subscribePointerTarget(({ x, y }) => {
      root.style.setProperty(X_PROPERTY, `${x}px`);
      root.style.setProperty(Y_PROPERTY, `${y}px`);
    });

    return () => {
      unsubscribe();
      root.style.removeProperty(X_PROPERTY);
      root.style.removeProperty(Y_PROPERTY);
    };
  }, [enabled]);

  return enabled;
}
