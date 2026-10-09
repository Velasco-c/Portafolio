"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import styles from "./three-background.module.css";

const SECTION_IDS = ["top", "work", "capabilities", "about", "contact"] as const;
type SectionId = (typeof SECTION_IDS)[number];

const MODES: Record<SectionId, { scale: number; opacity: number; z: number; color: string }> = {
  top: { scale: 1.12, opacity: 0.78, z: 6.6, color: "#3f5bff" },
  work: { scale: 0.86, opacity: 0.44, z: 8.2, color: "#6c74d8" },
  capabilities: { scale: 1.22, opacity: 0.58, z: 7.1, color: "#343434" },
  about: { scale: 0.76, opacity: 0.28, z: 9.4, color: "#77736c" },
  contact: { scale: 1.42, opacity: 0.24, z: 10.8, color: "#6c74d8" },
};

const damp = (a: number, b: number, lambda: number, dt: number) => THREE.MathUtils.lerp(a, b, 1 - Math.exp(-lambda * dt));

export function ThreeBackground() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.2 : 1.7));
    renderer.setClearColor(0, 0);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(44, 1, 0.1, 100);
    camera.position.z = 6.6;

    const root = new THREE.Group();
    root.position.x = 1.9;
    scene.add(root);

    // A soft spherical particle volume inspired by BlueYard's nebula language.
    const count = innerWidth < 700 ? 900 : 1900;
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    for (let i = 0; i < count; i += 1) {
      const radius = Math.pow(Math.random(), 0.58) * 2.8;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(THREE.MathUtils.randFloatSpread(2));
      positions[i * 3] = Math.sin(phi) * Math.cos(theta) * radius;
      positions[i * 3 + 1] = Math.cos(phi) * radius;
      positions[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;
      sizes[i] = THREE.MathUtils.randFloat(0.35, 1.55);
    }
    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    const particleMaterial = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      uniforms: { uColor: { value: new THREE.Color("#3f5bff") }, uOpacity: { value: 0.75 } },
      vertexShader: `attribute float aSize; varying float vSize; void main(){vSize=aSize; vec4 mv=modelViewMatrix*vec4(position,1.0); gl_PointSize=aSize*(90.0/-mv.z); gl_Position=projectionMatrix*mv;}`,
      fragmentShader: `uniform vec3 uColor; uniform float uOpacity; varying float vSize; void main(){vec2 p=gl_PointCoord-.5; float d=length(p); float glow=smoothstep(.5,0.0,d); if(glow<.01) discard; gl_FragColor=vec4(uColor,glow*uOpacity);}`,
    });
    const nebula = new THREE.Points(particleGeometry, particleMaterial);
    root.add(nebula);

    const globe = new THREE.Mesh(
      new THREE.IcosahedronGeometry(2.55, 4),
      new THREE.MeshBasicMaterial({ color: "#5a67a6", wireframe: true, transparent: true, opacity: 0.09 }),
    );
    root.add(globe);

    const ringGroup = new THREE.Group();
    root.add(ringGroup);
    for (let i = 0; i < 6; i += 1) {
      const ring = new THREE.Mesh(
        new THREE.TorusGeometry(2.25 + i * 0.16, 0.008, 6, 180),
        new THREE.MeshBasicMaterial({ color: i % 2 ? "#6674e5" : "#111111", transparent: true, opacity: 0.16 }),
      );
      ring.rotation.set(Math.random() * 1.5, Math.random() * 1.5, Math.random() * 1.5);
      ringGroup.add(ring);
    }

    const filaments = new THREE.Group();
    root.add(filaments);
    for (let j = 0; j < 9; j += 1) {
      const points: THREE.Vector3[] = [];
      for (let i = 0; i < 90; i += 1) {
        const t = i / 89;
        const angle = t * Math.PI * 4 + j * 0.7;
        const radius = 0.5 + t * 2.4;
        points.push(new THREE.Vector3(
          Math.cos(angle) * radius,
          Math.sin(angle * 1.7 + j) * 0.55,
          Math.sin(angle) * radius,
        ));
      }
      const curve = new THREE.CatmullRomCurve3(points);
      const line = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints(curve.getPoints(160)),
        new THREE.LineBasicMaterial({ color: "#6a75df", transparent: true, opacity: 0.08 }),
      );
      filaments.add(line);
    }

    const target = { x: 0, y: 0, scroll: 0, section: 0 };
    const current = { x: 0, y: 0, scroll: 0, section: 0 };
    let activeSection = 0;
    let raf = 0;
    let running = true;
    let time = 0;
    let last = performance.now();

    const updateSection = () => {
      const max = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
      target.scroll = THREE.MathUtils.clamp(scrollY / max, 0, 1);
    };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const index = SECTION_IDS.indexOf(entry.target.id as SectionId);
        if (index >= 0) activeSection = index;
      });
    }, { rootMargin: "-38% 0px -45% 0px" });
    SECTION_IDS.forEach((id) => { const el = document.getElementById(id); if (el) observer.observe(el); });

    const pointer = (event: PointerEvent) => {
      if (reduced.matches) return;
      target.x = (event.clientX / innerWidth - 0.5) * 2;
      target.y = (event.clientY / innerHeight - 0.5) * 2;
    };
    const resize = () => {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      root.position.x = innerWidth > 1100 ? 2.25 : innerWidth > 700 ? 1 : 0;
      renderer.setPixelRatio(Math.min(devicePixelRatio, innerWidth < 700 ? 1.15 : 1.7));
    };

    const render = (now: number) => {
      if (!running) return;
      const dt = Math.min((now - last) / 1000, 0.05); last = now;
      time += reduced.matches ? 0 : dt;
      target.section = activeSection;
      current.x = damp(current.x, target.x, 3.5, dt);
      current.y = damp(current.y, target.y, 3.5, dt);
      current.scroll = damp(current.scroll, target.scroll, 3, dt);
      current.section = damp(current.section, target.section, 4, dt);

      const mode = MODES[SECTION_IDS[Math.round(current.section)] ?? "top"];
      const motion = reduced.matches ? 0 : 1;
      root.rotation.y = time * 0.08 + current.x * 0.25 + current.scroll * 1.8;
      root.rotation.x = current.y * 0.15 + current.scroll * 0.35;
      root.rotation.z = Math.sin(time * 0.18) * 0.04;
      root.scale.setScalar(damp(root.scale.x, mode.scale, 3.2, dt));
      nebula.rotation.y = -time * 0.025 + current.x * 0.08;
      globe.rotation.y = time * 0.025;
      globe.rotation.x = Math.sin(time * 0.08) * 0.1;
      ringGroup.rotation.z = time * 0.025 + current.scroll;
      filaments.rotation.y = -time * 0.018;
      camera.position.z = damp(camera.position.z, mode.z + current.scroll * 2, 2.8, dt);
      camera.position.x = damp(camera.position.x, current.x * 0.32 * motion, 3, dt);
      camera.position.y = damp(camera.position.y, -current.y * 0.2 * motion, 3, dt);
      camera.lookAt(0, 0, 0);

      const color = new THREE.Color(mode.color);
      particleMaterial.uniforms.uColor.value.lerp(color, 0.06);
      particleMaterial.uniforms.uOpacity.value = mode.opacity;
      globe.material.opacity = mode.opacity * 0.12;
      canvas.style.opacity = String(mode.opacity);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };

    const visibility = () => { running = !document.hidden; last = performance.now(); if (running) raf = requestAnimationFrame(render); };
    addEventListener("pointermove", pointer, { passive: true });
    addEventListener("scroll", updateSection, { passive: true });
    addEventListener("resize", resize);
    document.addEventListener("visibilitychange", visibility);
    updateSection(); resize(); raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf); observer.disconnect();
      removeEventListener("pointermove", pointer); removeEventListener("scroll", updateSection); removeEventListener("resize", resize); document.removeEventListener("visibilitychange", visibility);
      particleGeometry.dispose(); particleMaterial.dispose(); globe.geometry.dispose(); (globe.material as THREE.Material).dispose();
      ringGroup.children.forEach((child) => { const mesh = child as THREE.Mesh; mesh.geometry.dispose(); (mesh.material as THREE.Material).dispose(); });
      filaments.children.forEach((child) => { const line = child as THREE.Line; line.geometry.dispose(); (line.material as THREE.Material).dispose(); });
      renderer.dispose();
    };
  }, []);

  return <canvas ref={ref} className={styles.canvas} aria-hidden="true" />;
}
