"use client";

import { useEffect } from "react";

import { registerGsap } from "../gsap/register";
import { MOTION_OK } from "../media/conditions";

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    if (typeof window.matchMedia !== "function") return;

    const motionPreference = window.matchMedia(MOTION_OK);

    let disposed = false;
    let raf = 0;
    let generation = 0;
    let destroy: (() => void) | undefined;

    const stop = () => {
      // Invalidate pending asynchronous initialization.
      generation += 1;

      destroy?.();
      destroy = undefined;

      if (raf !== 0) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };

    const start = async () => {
      if (disposed || !motionPreference.matches || destroy) {
        return;
      }

      const currentGeneration = ++generation;

      try {
        const [, scrollTriggerModule, lenisModule] = await Promise.all([
          registerGsap(),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);

        // Avoid initializing after cleanup or a preference change.
        if (
          disposed ||
          !motionPreference.matches ||
          currentGeneration !== generation
        ) {
          return;
        }

        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        const Lenis = lenisModule.default;

        const lenis = new Lenis({
          lerp: 0.085,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.85,
        });

        const tick = (time: number) => {
          lenis.raf(time);
          raf = requestAnimationFrame(tick);
        };

        const handleScroll = () => {
          ScrollTrigger.update();
        };

        lenis.on("scroll", handleScroll);

        raf = requestAnimationFrame(tick);

        destroy = () => {
          cancelAnimationFrame(raf);
          raf = 0;

          lenis.off("scroll", handleScroll);
          lenis.destroy();
        };
      } catch {
        // Progressive enhancement:
        // native scrolling remains available if initialization fails.
      }
    };

    const handlePreferenceChange = () => {
      if (motionPreference.matches) {
        void start();
      } else {
        stop();
      }
    };

    motionPreference.addEventListener("change", handlePreferenceChange);

    void start();

    return () => {
      disposed = true;

      motionPreference.removeEventListener(
        "change",
        handlePreferenceChange,
      );

      stop();
    };
  }, []);

  return null;
}