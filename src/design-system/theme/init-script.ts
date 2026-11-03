// Runs before first paint. It applies the saved theme only after the visitor accepts stored
// preferences, and marks the page as "pending" when motion is allowed so the editorial content
// stays hidden until GSAP sets its start state. This avoids a visible flash before the entrance.
// Keys must match CONSENT_STORAGE_KEY and STORAGE_KEY in the app modules.
export const themeInitScript = `(()=>{const root=document.documentElement;let saved=null;try{if(localStorage.getItem("portfolio-consent")==="accepted")saved=localStorage.getItem("portfolio-theme")}catch{}const systemPrefersLight=typeof matchMedia==="function"&&matchMedia("(prefers-color-scheme: light)").matches;root.dataset.theme=saved==="dark"||saved==="light"?saved:systemPrefersLight?"light":"dark";if(typeof matchMedia==="function"&&matchMedia("(prefers-reduced-motion: no-preference)").matches)root.dataset.motion="pending"})()`;
