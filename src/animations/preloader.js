/**
 * Cinematic preloader. Name lines rise out of masks, a hairline measures the beat,
 * then the curtain lifts to reveal the page. ~2s total, skippable with click/Esc/Enter.
 * Resolves `onReveal` when the page underneath should begin its own entrance.
 */
const EASE_OUT = "cubic-bezier(0.23, 1, 0.32, 1)";
const EASE_IN_OUT = "cubic-bezier(0.77, 0, 0.175, 1)";

export function runPreloader(root, nameLines, { reducedMotion = false, onReveal = () => {}, onDone = () => {} } = {}) {
  root.innerHTML = `
    <div class="pre__stage">
      <p class="pre__tag" aria-hidden="true">Portafolio</p>
      <p class="pre__name" role="img" aria-label="${nameLines.join(" ")}">
        ${nameLines.map((l) => `<span class="pre__line"><span>${l}</span></span>`).join("")}
      </p>
      <div class="pre__bar" aria-hidden="true"><i></i></div>
    </div>
    <div class="pre__edge" aria-hidden="true"></div>`;
  root.hidden = false;
  document.documentElement.classList.add("is-loading");

  const lines = [...root.querySelectorAll(".pre__line > span")];
  const tag = root.querySelector(".pre__tag"), bar = root.querySelector(".pre__bar i"), stage = root.querySelector(".pre__stage");
  let finished = false, skip = null;

  const finish = () => {
    if (finished) return; finished = true;
    root.hidden = true; root.innerHTML = "";
    document.documentElement.classList.remove("is-loading");
    removeEventListener("keydown", onKey); root.removeEventListener("pointerdown", onSkip);
    onDone();
  };
  const onSkip = () => skip?.();
  const onKey = (e) => { if (["Escape", "Enter", " "].includes(e.key)) skip?.(); };
  addEventListener("keydown", onKey); root.addEventListener("pointerdown", onSkip);

  if (reducedMotion) { // single quick fade, no movement
    onReveal();
    root.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 250, delay: 250, easing: "ease", fill: "forwards" }).finished.then(finish);
    return;
  }

  const fontsReady = Promise.race([document.fonts?.ready ?? Promise.resolve(), new Promise((r) => setTimeout(r, 1200))]);
  const anims = [];
  const A = (el, kf, opt) => { const a = el.animate(kf, { fill: "both", ...opt }); anims.push(a); return a; };

  A(tag, [{ opacity: 0 }, { opacity: 0.6 }], { duration: 600, delay: 100, easing: "ease-out" });
  lines.forEach((l, i) => A(l, [{ transform: "translateY(108%)" }, { transform: "translateY(0)" }], { duration: 850, delay: 150 + i * 110, easing: EASE_OUT }));
  const barAnim = A(bar, [{ transform: "scaleX(0)" }, { transform: "scaleX(1)" }], { duration: 1100, delay: 150, easing: "cubic-bezier(0.65, 0, 0.35, 1)" });

  let exiting = false;
  async function exit() {
    if (exiting) return; exiting = true;
    await fontsReady;
    anims.forEach((a) => { try { a.commitStyles?.(); } catch {} });
    lines.forEach((l, i) => l.animate([{ transform: "translateY(0)" }, { transform: "translateY(-108%)" }], { duration: 600, delay: i * 60, easing: EASE_IN_OUT, fill: "forwards" }));
    stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, delay: 450, fill: "forwards" });
    setTimeout(onReveal, 380);
    root.animate([{ transform: "translateY(0)" }, { transform: "translateY(-100%)" }], { duration: 900, delay: 380, easing: EASE_IN_OUT, fill: "forwards" }).finished.then(finish);
  }

  skip = () => { if (!exiting) { anims.forEach((a) => a.finish()); } exit(); };
  barAnim.finished.then(() => setTimeout(exit, 250)).catch(() => {});
}
