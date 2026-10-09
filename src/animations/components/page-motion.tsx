"use client";

import { useEffect } from "react";
import { registerGsap } from "../gsap/register";
import { MOTION_OK } from "../media/conditions";

/** Adds one-time, visual-only entrances while keeping server-rendered content visible. */
export function PageMotion() {
  useEffect(() => {
    if (typeof window.matchMedia !== "function") return;

    let disposed = false;
    let generation = 0;
    let revert: (() => void) | undefined;
    const motionPreference = window.matchMedia(MOTION_OK);

    const init = () => {
      if (disposed || !motionPreference.matches) return;
      const currentGeneration = ++generation;

      void Promise.all([registerGsap(), import("gsap/SplitText")])
        .then(([gsap, splitTextModule]) => {
          if (disposed || !motionPreference.matches || currentGeneration !== generation) return;

          const SplitText = splitTextModule.SplitText;
          gsap.registerPlugin(SplitText);

          const root = document.querySelector<HTMLElement>("#main");
          if (!root) return;

          const media = gsap.matchMedia();
          media.add(MOTION_OK, () => {
            const splitInstances: Array<{ revert: () => void }> = [];
            const context = gsap.context(() => {
              root.querySelectorAll<HTMLElement>("[data-motion-editorial]").forEach((element, index) => {
                const isProject = element.hasAttribute("data-motion-project");
                const chars: Element[] = [];

                element.querySelectorAll<HTMLElement>("h1, h2, h3").forEach((heading) => {
                  const split = new SplitText(heading, {
                    type: "chars",
                    charsClass: "editorialParticleChar",
                    aria: "auto",
                  });
                  splitInstances.push(split);
                  chars.push(...split.chars);
                });

                const direction = index % 2 === 0 ? -1 : 1;
                const timeline = gsap.timeline({
                  defaults: { overwrite: "auto" },
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
                        x: direction * 34,
                        y: 32,
                        rotationY: direction * 2.5,
                        scale: 0.975,
                        transformPerspective: 1000,
                        transformOrigin: "50% 80%",
                      }
                    : { autoAlpha: 0, y: 20 },
                  {
                    autoAlpha: 1,
                    x: 0,
                    y: 0,
                    rotationY: 0,
                    scale: 1,
                    duration: isProject ? 0.78 : 0.64,
                    delay: isProject ? (index % 2) * 0.06 : 0,
                    ease: "power3.out",
                  },
                );

                if (chars.length > 0) {
                  timeline.fromTo(
                    chars,
                    {
                      autoAlpha: 0,
                      x: () => gsap.utils.random(-12, 12),
                      y: () => gsap.utils.random(-16, 16),
                      rotationX: () => gsap.utils.random(-18, 18),
                      scale: 0.94,
                      transformOrigin: "50% 65%",
                    },
                    {
                      autoAlpha: 1,
                      x: 0,
                      y: 0,
                      rotationX: 0,
                      scale: 1,
                      duration: 0.68,
                      stagger: { each: 0.009, from: "random" },
                      ease: "power3.out",
                    },
                    0.04,
                  );
                }
              });
            }, root);

            return () => {
              context.revert();
              splitInstances.forEach((split) => split.revert());
            };
          });

          revert = () => media.revert();
        })
        .catch(() => {
          // Motion is progressive enhancement; server-rendered content stays visible.
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
      motionPreference.removeEventListener("change", handlePreferenceChange);
      revert?.();
    };
  }, []);

  return null;
}
