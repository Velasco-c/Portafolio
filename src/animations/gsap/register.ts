import type { gsap as GsapInstance } from "gsap";

type RegisteredGsap = typeof GsapInstance;

let registration: Promise<RegisteredGsap> | undefined;

/** Loads GSAP and ScrollTrigger on demand and registers the plugin once. */
export function registerGsap(): Promise<RegisteredGsap> {
  if (!registration) {
    registration = Promise.all([import("gsap"), import("gsap/ScrollTrigger")])
      .then(([gsapModule, scrollTriggerModule]) => {
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;

        gsap.registerPlugin(ScrollTrigger);
        // Mobile browsers resize the viewport height while the address bar moves; ignoring that
        // avoids re-measuring every trigger mid-scroll, which is what makes scrolling stutter.
        ScrollTrigger.config({ ignoreMobileResize: true });

        return gsap;
      })
      .catch((error: unknown) => {
        registration = undefined;
        throw error;
      });
  }

  return registration;
}
