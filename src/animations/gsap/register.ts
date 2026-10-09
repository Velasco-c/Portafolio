import type { gsap as GsapInstance } from "gsap";

export type RegisteredGsap = typeof GsapInstance;

let registration: Promise<RegisteredGsap> | undefined;

/** Loads GSAP and ScrollTrigger on demand and registers the plugin once. */
export function registerGsap(): Promise<RegisteredGsap> {
  if (!registration) {
    registration = Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);

        return gsap;
      })
      .catch((error: unknown) => {
        registration = undefined;
        throw error;
      });
  }

  return registration;
}
