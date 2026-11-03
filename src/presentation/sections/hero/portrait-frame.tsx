"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Profile } from "../../../domain/profile/profile";
import styles from "./hero-section.module.css";

export function PortraitFrame({ photo }: { photo: Profile["photo"] }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!finePointer.matches || reducedMotion.matches) return;

    const move = (event: PointerEvent) => {
      const rect = element.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      element.style.setProperty("--portrait-rx", `${y * -7}deg`);
      element.style.setProperty("--portrait-ry", `${x * 9}deg`);
      element.style.setProperty("--portrait-glow-x", `${50 + x * 35}%`);
      element.style.setProperty("--portrait-glow-y", `${50 + y * 35}%`);
    };
    const leave = () => {
      element.style.setProperty("--portrait-rx", "0deg");
      element.style.setProperty("--portrait-ry", "0deg");
      element.style.setProperty("--portrait-glow-x", "50%");
      element.style.setProperty("--portrait-glow-y", "50%");
    };

    element.addEventListener("pointermove", move, { passive: true });
    element.addEventListener("pointerleave", leave, { passive: true });
    return () => {
      element.removeEventListener("pointermove", move);
      element.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div ref={ref} className={styles.portraitFrame}>
      <Image
        className={styles.portraitImage}
        src={photo.src}
        alt={photo.alt.replace(/^\[PENDIENTE\]\s*/, "")}
        width={500}
        height={500}
        sizes="(max-width: 767px) 144px, (max-width: 1023px) 32vw, 440px"
        priority
      />
    </div>
  );
}
