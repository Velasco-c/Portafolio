"use client";

import { useEffect } from "react";

import { registerGsap } from "../gsap/register";
import { MOTION_OK } from "../media/conditions";

const ANCHOR_DURATION_S = 1.1;

/** Ease-out curve for in-page jumps: quick start, long soft landing. */
const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

/** Reads the offset the CSS already uses for anchors, so sections land below the fixed header. */
function anchorOffset(): number {
  const padding = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop);
  return Number.isFinite(padding) ? -padding : 0;
}

export function SmoothScroll() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (typeof window.matchMedia !== "function") return;

    const motionPreference = window.matchMedia(MOTION_OK);

    let disposed = false;
    let generation = 0;
    let destroy: (() => void) | undefined;

    const stop = () => {
      // Invalidate pending asynchronous initialization.
      generation += 1;
      destroy?.();
      destroy = undefined;
    };

    const start = async () => {
      if (disposed || !motionPreference.matches || destroy) return;

      const currentGeneration = ++generation;

      try {
        const [gsap, scrollTriggerModule, lenisModule] = await Promise.all([
          registerGsap(),
          import("gsap/ScrollTrigger"),
          import("lenis"),
        ]);

        // Avoid initializing after cleanup or a preference change.
        if (disposed || !motionPreference.matches || currentGeneration !== generation) return;

        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        const Lenis = lenisModule.default;

        const lenis = new Lenis({
          lerp: 0.09,
          smoothWheel: true,
          syncTouch: false,
          wheelMultiplier: 0.9,
        });

        // One clock for everything: GSAP's ticker drives Lenis, so scroll and tweens stay in step.
        const handleScroll = () => ScrollTrigger.update();
        const tick = (time: number) => lenis.raf(time * 1000);

        lenis.on("scroll", handleScroll);
        gsap.ticker.lagSmoothing(0);
        gsap.ticker.add(tick);

        const handleAnchorClick = (event: MouseEvent) => {
          if (event.defaultPrevented || event.button !== 0) return;
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
          if (!(event.target instanceof Element)) return;

          const link = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
          const hash = link?.getAttribute("href") ?? "";
          if (!link || hash.length < 2) return;

          const target = document.getElementById(hash.slice(1));
          if (!target) return;

          event.preventDefault();
          lenis.scrollTo(target, {
            offset: anchorOffset(),
            duration: ANCHOR_DURATION_S,
            easing: easeOutQuart,
          });
          window.history.pushState(null, "", hash);
        };

        document.addEventListener("click", handleAnchorClick);

        destroy = () => {
          document.removeEventListener("click", handleAnchorClick);
          gsap.ticker.remove(tick);
          gsap.ticker.lagSmoothing(500, 33);
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
      motionPreference.removeEventListener("change", handlePreferenceChange);
      stop();
    };
  }, []);

  return null;
}
