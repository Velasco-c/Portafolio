"use client";

import { useEffect, useRef } from "react";
import type { RefObject } from "react";
import type { RegisteredGsap } from "../gsap/register";
import { ANIMATION_MEDIA } from "../media/conditions";
import { registerGsap } from "../gsap/register";

type MediaConditions = Record<string, string>;
type Setup = (
  gsap: RegisteredGsap,
  conditions: Record<string, boolean | undefined>,
) => void;

export interface UseGsapContextOptions {
  /** Additional or replacement GSAP matchMedia conditions. */
  conditions?: MediaConditions;
}

/** Creates a scoped, media-aware GSAP context and reverts it on cleanup. */
export function useGsapContext<T extends HTMLElement>(
  scope: RefObject<T | null>,
  setup: Setup,
  options: UseGsapContextOptions = {},
): void {
  const setupRef = useRef(setup);
  const conditionsRef = useRef(options.conditions);

  useEffect(() => {
    setupRef.current = setup;
    conditionsRef.current = options.conditions;
  }, [setup, options.conditions]);

  useEffect(() => {
    let cancelled = false;
    let revert: (() => void) | undefined;

    void registerGsap().then((gsap) => {
      const scopeElement = scope.current;
      if (cancelled || !scopeElement) return;

      const media = gsap.matchMedia();
      const conditions = {
        motionOk: ANIMATION_MEDIA.motionOk,
        reducedMotion: ANIMATION_MEDIA.reducedMotion,
        ...conditionsRef.current,
      };

      media.add(conditions, (context) => {
        const scoped = gsap.context(() => {
          setupRef.current(gsap, context.conditions ?? {});
        }, scopeElement);

        revert = () => scoped.revert();
        return () => scoped.revert();
      });

      const revertMedia = () => media.revert();
      revert = revertMedia;
    });

    return () => {
      cancelled = true;
      revert?.();
    };
  }, [scope]);
}
