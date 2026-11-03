"use client";

import { useEffect } from "react";
import { registerGsap } from "../gsap/register";
import { MOTION_OK } from "../media/conditions";

/** Attribute set by the theme init script. Removing it releases the held editorial content. */
const HOLD_ATTRIBUTE = "data-motion";
/** Safety net: content is never held longer than this, even if GSAP fails to load. */
const HOLD_FAILSAFE_MS = 3000;

function releaseContent(): void {
  document.documentElement.removeAttribute(HOLD_ATTRIBUTE);
}

/** Adds one-time, visual-only entrances while keeping server-rendered content visible. */
export function PageMotion() {
  useEffect(() => {
    if (typeof window.matchMedia !== "function") {
      releaseContent();
      return;
    }

    let disposed = false;
    let generation = 0;
    let revert: (() => void) | undefined;
    const motionPreference = window.matchMedia(MOTION_OK);
    const failsafe = window.setTimeout(releaseContent, HOLD_FAILSAFE_MS);

    const init = () => {
      if (disposed || !motionPreference.matches) {
        releaseContent();
        return;
      }
      const currentGeneration = ++generation;

      void Promise.all([registerGsap(), import("gsap/SplitText"), import("gsap/ScrollTrigger")])
        .then(([gsap, splitTextModule, scrollTriggerModule]) => {
          if (disposed || !motionPreference.matches || currentGeneration !== generation) return;

          const SplitText = splitTextModule.SplitText;
          const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
          gsap.registerPlugin(SplitText);

          const root = document.querySelector<HTMLElement>("#main");
          if (!root) {
            releaseContent();
            return;
          }

          const media = gsap.matchMedia();
          media.add(MOTION_OK, () => {
            const splitInstances: Array<{ revert: () => void }> = [];
            const context = gsap.context(() => {
              root.querySelectorAll<HTMLElement>("[data-motion-editorial]").forEach((element, index) => {
                const isProject = element.hasAttribute("data-motion-project");
                const chars: Element[] = [];

                element.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((heading) => {
                  // Words are kept whole: splitting only into characters lets the browser break mid-word.
                  const split = new SplitText(heading, {
                    type: "words,chars",
                    wordsClass: "editorialParticleWord",
                    charsClass: "editorialParticleChar",
                    aria: "auto",
                  });
                  splitInstances.push(split);
                  chars.push(...split.chars);
                });

                // Alternating direction keeps neighbouring cards from moving in lockstep.
                const direction = index % 2 === 0 ? -1 : 1;
                const timeline = gsap.timeline({
                  defaults: { overwrite: "auto", force3D: true },
                  scrollTrigger: {
                    trigger: element,
                    start: "top 88%",
                    toggleActions: "play none none none",
                    once: true,
                  },
                });

                timeline.fromTo(
                  element,
                  isProject
                    ? {
                        autoAlpha: 0,
                        x: direction * 24,
                        y: 40,
                        rotationY: direction * 1.5,
                        scale: 0.98,
                        transformPerspective: 1200,
                        transformOrigin: "50% 80%",
                      }
                    : { autoAlpha: 0, y: 24 },
                  {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: isProject ? 1.15 : 0.95,
                    delay: isProject ? (index % 2) * 0.08 : 0,
                    ease: "power3.out",
                  },
                );

                if (chars.length > 0) {
                  // A steady, top-to-bottom rise reads smoother than randomised rotation.
                  timeline.fromTo(
                    chars,
                    { autoAlpha: 0, yPercent: 55 },
                    {
                      autoAlpha: 1,
                      yPercent: 0,
                      duration: 0.9,
                      stagger: { each: 0.012, from: "start" },
                      ease: "power3.out",
                    },
                    0.06,
                  );
                }
              });
            }, root);

            return () => {
              context.revert();
              splitInstances.forEach((split) => split.revert());
            };
          });

          // Start states are applied synchronously above, so releasing now causes no flash.
          releaseContent();
          revert = () => media.revert();

          // Trigger positions are measured before web fonts swap in; re-measure once they settle,
          // so entrances start at the right point instead of jumping during the first scroll.
          void document.fonts.ready.then(() => {
            if (!disposed) ScrollTrigger.refresh();
          });
        })
        .catch(() => {
          // Motion is progressive enhancement; server-rendered content stays visible.
          releaseContent();
        });
    };

    const handlePreferenceChange = () => {
      generation += 1;
      revert?.();
      revert = undefined;
      if (motionPreference.matches) init();
    };

    motionPreference.addEventListener("change", handlePreferenceChange);
    init();

    return () => {
      disposed = true;
      generation += 1;
      window.clearTimeout(failsafe);
      motionPreference.removeEventListener("change", handlePreferenceChange);
      revert?.();
      releaseContent();
    };
  }, []);

  return null;
}
