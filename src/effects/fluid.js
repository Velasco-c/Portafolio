/**
 * GPU fluid simulation (WebGL2, Navier–Stokes on the GPU — semi-Lagrangian
 * advection, vorticity confinement, Jacobi pressure solve). The pointer injects
 * velocity and iridescent dye. Rendered as an atmospheric layer behind content.
 * Returns { destroy() } or null when WebGL2 float targets are unavailable.
 */
const VERT = `#version 300 es
precision highp float;
in vec2 aPos;
uniform vec2 texelSize;
out vec2 vUv; out vec2 vL; out vec2 vR; out vec2 vT; out vec2 vB;
void main(){
  vUv = aPos * 0.5 + 0.5;
  vL = vUv - vec2(texelSize.x, 0.0); vR = vUv + vec2(texelSize.x, 0.0);
  vT = vUv + vec2(0.0, texelSize.y); vB = vUv - vec2(0.0, texelSize.y);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const HEAD = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 vUv; in vec2 vL; in vec2 vR; in vec2 vT; in vec2 vB;
out vec4 o;
`;
const FRAG = {
  splat: HEAD + `
uniform sampler2D uTarget; uniform float aspect; uniform vec3 color; uniform vec2 point; uniform float radius;
void main(){
  vec2 p = vUv - point; p.x *= aspect;
  vec3 s = exp(-dot(p, p) / radius) * color;
  o = vec4(texture(uTarget, vUv).xyz + s, 1.0);
}`,
  advect: HEAD + `
uniform sampler2D uVelocity; uniform sampler2D uSource; uniform vec2 texelSize; uniform float dt; uniform float dissipation;
void main(){
  vec2 coord = vUv - dt * texture(uVelocity, vUv).xy * texelSize;
  o = texture(uSource, coord) / (1.0 + dissipation * dt);
}`,
  divergence: HEAD + `
uniform sampler2D uVelocity;
void main(){
  float L = texture(uVelocity, vL).x; float R = texture(uVelocity, vR).x;
  float T = texture(uVelocity, vT).y; float B = texture(uVelocity, vB).y;
  vec2 C = texture(uVelocity, vUv).xy;
  if (vL.x < 0.0) L = -C.x; if (vR.x > 1.0) R = -C.x;
  if (vT.y > 1.0) T = -C.y; if (vB.y < 0.0) B = -C.y;
  o = vec4(0.5 * (R - L + T - B), 0.0, 0.0, 1.0);
}`,
  curl: HEAD + `
uniform sampler2D uVelocity;
void main(){
  float L = texture(uVelocity, vL).y; float R = texture(uVelocity, vR).y;
  float T = texture(uVelocity, vT).x; float B = texture(uVelocity, vB).x;
  o = vec4(0.5 * (R - L - T + B), 0.0, 0.0, 1.0);
}`,
  vorticity: HEAD + `
uniform sampler2D uVelocity; uniform sampler2D uCurl; uniform float curl; uniform float dt;
void main(){
  float L = texture(uCurl, vL).x; float R = texture(uCurl, vR).x;
  float T = texture(uCurl, vT).x; float B = texture(uCurl, vB).x;
  float C = texture(uCurl, vUv).x;
  vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
  force /= length(force) + 0.0001; force *= curl * C; force.y *= -1.0;
  vec2 v = texture(uVelocity, vUv).xy + force * dt;
  o = vec4(clamp(v, -1000.0, 1000.0), 0.0, 1.0);
}`,
  pressure: HEAD + `
uniform sampler2D uPressure; uniform sampler2D uDivergence;
void main(){
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  float div = texture(uDivergence, vUv).x;
  o = vec4((L + R + B + T - div) * 0.25, 0.0, 0.0, 1.0);
}`,
  gradient: HEAD + `
uniform sampler2D uPressure; uniform sampler2D uVelocity;
void main(){
  float L = texture(uPressure, vL).x; float R = texture(uPressure, vR).x;
  float T = texture(uPressure, vT).x; float B = texture(uPressure, vB).x;
  vec2 v = texture(uVelocity, vUv).xy - vec2(R - L, T - B);
  o = vec4(v, 0.0, 1.0);
}`,
  clear: HEAD + `
uniform sampler2D uTexture; uniform float value;
void main(){ o = value * texture(uTexture, vUv); }`,
  // Tone-mapped dye stays premultiplied for clean blending over the page treatment.
  display: HEAD + `
uniform sampler2D uDye; uniform sampler2D uVelocity; uniform float strength; uniform float time;
void main(){
  vec2 vel = texture(uVelocity, vUv).xy;
  vec2 off = vel * 0.0001;
  vec3 c = vec3(texture(uDye, vUv + off).r, texture(uDye, vUv).g, texture(uDye, vUv - off).b);
  c = 1.0 - exp(-c * 2.1);
  float sheen = 0.5 + 0.5 * sin(time * 0.38 + length(vel) * 0.018 + vUv.x * 5.0);
  c *= 0.88 + 0.24 * sheen;
  c = max(c, 0.0) * strength;
  float a = clamp(max(c.r, max(c.g, c.b)), 0.0, 0.9);
  o = vec4(min(c, vec3(a)), a);
}`,
};

function hsl(h, s, l) {
  const k = (n) => (n + h / 30) % 12, a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return [f(0), f(8), f(4)];
}

export function initFluid(canvas, { lowPower = false } = {}) {
  const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false, powerPreference: "high-performance" });
  if (!gl || !gl.getExtension("EXT_color_buffer_float")) return null;

  const CFG = {
    simRes: lowPower ? 96 : 144,
    dyeRes: lowPower ? 384 : 768,
    velDissipation: 0.22, dyeDissipation: 0.85, pressure: 0.8, iterations: lowPower ? 14 : 22,
    curl: 29, splatRadius: 0.095, splatForce: 7000,
  };

  const compile = (type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      const message = gl.getShaderInfoLog(s);
      gl.deleteShader(s);
      throw new Error(message);
    }
    return s;
  };
  const vs = compile(gl.VERTEX_SHADER, VERT);
  const programs = {};
  const shaders = [vs];
  try {
    for (const [name, src] of Object.entries(FRAG)) {
      const fs = compile(gl.FRAGMENT_SHADER, src); shaders.push(fs);
      const prog = gl.createProgram();
      gl.attachShader(prog, vs); gl.attachShader(prog, fs);
      gl.bindAttribLocation(prog, 0, "aPos");
      gl.linkProgram(prog);
      if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));
      const uniforms = {};
      const n = gl.getProgramParameter(prog, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < n; i++) { const u = gl.getActiveUniform(prog, i); uniforms[u.name] = gl.getUniformLocation(prog, u.name); }
      programs[name] = { prog, uniforms };
    }
  } catch {
    Object.values(programs).forEach((p) => gl.deleteProgram(p.prog));
    shaders.forEach((s) => gl.deleteShader(s));
    return null;
  }

  // Fullscreen quad
  const vao = gl.createVertexArray(); gl.bindVertexArray(vao);
  const vbo = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  const resources = []; // textures + framebuffers for cleanup
  const makeFBO = (w, h) => {
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
    const fbo = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    resources.push(tex, fbo);
    return { tex, fbo, w, h, texel: [1 / w, 1 / h] };
  };
  const makeDouble = (w, h) => {
    const d = { read: makeFBO(w, h), write: makeFBO(w, h), swap() { [this.read, this.write] = [this.write, this.read]; } };
    return d;
  };
  const free = () => { for (const r of resources) { r instanceof WebGLTexture ? gl.deleteTexture(r) : gl.deleteFramebuffer(r); } resources.length = 0; };

  let velocity, dye, pressure, divergence, curl;
  const sizeFor = (res) => {
    const a = gl.drawingBufferWidth / gl.drawingBufferHeight;
    return a >= 1 ? [Math.round(res * a), res] : [res, Math.round(res / a)];
  };
  const build = () => {
    free();
    const [sw, sh] = sizeFor(CFG.simRes), [dw, dh] = sizeFor(CFG.dyeRes);
    velocity = makeDouble(sw, sh); dye = makeDouble(dw, dh); pressure = makeDouble(sw, sh);
    divergence = makeFBO(sw, sh); curl = makeFBO(sw, sh);
  };

  const use = (name) => { gl.useProgram(programs[name].prog); return programs[name].uniforms; };
  const bindTex = (unit, tex) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); return unit; };
  const blit = (target) => {
    if (target) { gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.w, target.h); }
    else { gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight); }
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  function splat(x, y, dx, dy, color, radiusScale = 1, dyeScale = 1) {
    const aspect = canvas.width / canvas.height;
    let u = use("splat");
    gl.uniform1i(u.uTarget, bindTex(0, velocity.read.tex));
    gl.uniform1f(u.aspect, aspect); gl.uniform2f(u.point, x, y);
    gl.uniform3f(u.color, dx, dy, 0);
    gl.uniform1f(u.radius, (CFG.splatRadius * radiusScale / 100) * (aspect > 1 ? aspect : 1));
    gl.uniform2fv(u.texelSize, velocity.read.texel);
    blit(velocity.write); velocity.swap();
    gl.uniform1i(u.uTarget, bindTex(0, dye.read.tex));
    gl.uniform3f(u.color, color[0] * dyeScale, color[1] * dyeScale, color[2] * dyeScale);
    gl.uniform2fv(u.texelSize, dye.read.texel);
    blit(dye.write); dye.swap();
  }

  function step(dt) {
    gl.disable(gl.BLEND);
    let u = use("curl");
    gl.uniform2fv(u.texelSize, velocity.read.texel); gl.uniform1i(u.uVelocity, bindTex(0, velocity.read.tex)); blit(curl);

    u = use("vorticity");
    gl.uniform2fv(u.texelSize, velocity.read.texel);
    gl.uniform1i(u.uVelocity, bindTex(0, velocity.read.tex)); gl.uniform1i(u.uCurl, bindTex(1, curl.tex));
    gl.uniform1f(u.curl, CFG.curl); gl.uniform1f(u.dt, dt); blit(velocity.write); velocity.swap();

    u = use("divergence");
    gl.uniform2fv(u.texelSize, velocity.read.texel); gl.uniform1i(u.uVelocity, bindTex(0, velocity.read.tex)); blit(divergence);

    u = use("clear");
    gl.uniform2fv(u.texelSize, velocity.read.texel);
    gl.uniform1i(u.uTexture, bindTex(0, pressure.read.tex)); gl.uniform1f(u.value, CFG.pressure); blit(pressure.write); pressure.swap();

    u = use("pressure");
    gl.uniform2fv(u.texelSize, velocity.read.texel); gl.uniform1i(u.uDivergence, bindTex(0, divergence.tex));
    for (let i = 0; i < CFG.iterations; i++) { gl.uniform1i(u.uPressure, bindTex(1, pressure.read.tex)); blit(pressure.write); pressure.swap(); }

    u = use("gradient");
    gl.uniform2fv(u.texelSize, velocity.read.texel);
    gl.uniform1i(u.uPressure, bindTex(0, pressure.read.tex)); gl.uniform1i(u.uVelocity, bindTex(1, velocity.read.tex));
    blit(velocity.write); velocity.swap();

    u = use("advect");
    gl.uniform2fv(u.texelSize, velocity.read.texel);
    gl.uniform1i(u.uVelocity, bindTex(0, velocity.read.tex)); gl.uniform1i(u.uSource, bindTex(0, velocity.read.tex));
    gl.uniform1f(u.dt, dt); gl.uniform1f(u.dissipation, CFG.velDissipation); blit(velocity.write); velocity.swap();

    gl.uniform2fv(u.texelSize, dye.read.texel);
    gl.uniform1i(u.uVelocity, bindTex(0, velocity.read.tex)); gl.uniform1i(u.uSource, bindTex(1, dye.read.tex));
    gl.uniform1f(u.dissipation, CFG.dyeDissipation); blit(dye.write); dye.swap();
  }

  function render(t) {
    const u = use("display");
    gl.uniform2f(u.texelSize, 1 / canvas.width, 1 / canvas.height);
    gl.uniform1i(u.uDye, bindTex(0, dye.read.tex)); gl.uniform1i(u.uVelocity, bindTex(1, velocity.read.tex));
    gl.uniform1f(u.strength, themeStrength); gl.uniform1f(u.time, t);
    blit(null);
  }

  // ── sizing ────────────────────────────────────────────────
  const dprCap = lowPower ? 1 : 1.5;
  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
    const w = Math.max(2, Math.floor(canvas.clientWidth * dpr)), h = Math.max(2, Math.floor(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; build(); }
  }

  // ── pointer input ─────────────────────────────────────────
  let hueShift = 0, themeStrength = 0.86;
  const syncTheme = () => {
    const light = document.documentElement.dataset.theme === "light";
    themeStrength = light ? 0.68 : 1.08;
  };
  syncTheme();
  const themeObserver = new MutationObserver(syncTheme);
  themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  const ptr = { x: 0.5, y: 0.5, simX: 0.5, simY: 0.5, trail: [] };
  const colorFor = (speed) => {
    hueShift = (hueShift + 7 + Math.min(15, speed * 0.12)) % 360;
    const h = (188 + hueShift) % 360;
    const light = document.documentElement.dataset.theme === "light";
    const c = hsl(h, light ? 0.78 : 0.94, light ? 0.52 : 0.56);
    const k = 0.34 + Math.min(0.68, speed / 155);
    return [c[0] * k, c[1] * k, c[2] * k];
  };
  const onMove = (e) => {
    const r = canvas.getBoundingClientRect();
    const events = e.type === "pointermove" ? (e.getCoalescedEvents?.() ?? [e]) : [e];
    for (const sample of events) {
      const x = Math.max(0, Math.min(1, (sample.clientX - r.left) / r.width));
      const y = Math.max(0, Math.min(1, 1 - (sample.clientY - r.top) / r.height));
      const prev = ptr.trail.at(-1) ?? { x: ptr.x, y: ptr.y };
      const speed = Math.hypot((x - prev.x) * canvas.width, (y - prev.y) * canvas.height);
      ptr.trail.push({ x, y, speed });
      ptr.x = x; ptr.y = y;
    }
    if (ptr.trail.length > 120) ptr.trail.splice(0, ptr.trail.length - 120);
    lastInput = performance.now(); sleeping = false;
    if (!raf && running && visible && !lost) { last = lastInput; lastFrame = 0; raf = requestAnimationFrame(frame); }
  };
  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerdown", onMove, { passive: true });

  // ── loop ──────────────────────────────────────────────────
  let raf = 0, last = performance.now(), lastFrame = 0, lastInput = performance.now() - 12001;
  let running = true, visible = !document.hidden, lost = false, sleeping = false;
  const clearState = () => {
    for (const target of [velocity.read, velocity.write, dye.read, dye.write, pressure.read, pressure.write, divergence, curl]) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo); gl.viewport(0, 0, target.w, target.h);
      gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
  };
  function frame(now) {
    if (!running || !visible || lost) return;
    raf = 0;
    if (now - lastInput > 12000 && !ptr.trail.length) { clearState(); sleeping = true; return; }
    const frameInterval = lowPower ? 1000 / 30 : 1000 / 50;
    if (now - lastFrame < frameInterval) { raf = requestAnimationFrame(frame); return; }
    lastFrame = now;
    const dt = Math.min((now - last) / 1000, 0.033); last = now;
    resize();
    let budget = lowPower ? 10 : 24;
    while (ptr.trail.length && budget > 0) {
      const target = ptr.trail.shift();
      const dx = target.x - ptr.simX, dy = target.y - ptr.simY;
      const distance = Math.hypot(dx * canvas.width, dy * canvas.height);
      const steps = Math.max(1, Math.ceil(distance / 34));
      const count = Math.min(steps, budget);
      for (let i = 1; i <= count; i++) {
        const t = i / steps, speed = target.speed || distance / steps;
        const radius = Math.max(0.68, Math.min(1.4, 0.68 + speed / 175));
        const dye = Math.max(0.72, Math.min(1.32, 0.72 + speed / 185));
        splat(ptr.simX + dx * t, ptr.simY + dy * t, dx / steps * CFG.splatForce, dy / steps * CFG.splatForce, colorFor(speed), radius, dye);
      }
      ptr.simX += dx * (count / steps); ptr.simY += dy * (count / steps);
      budget -= count;
      if (count < steps) { ptr.trail.unshift(target); break; }
    }
    step(dt);
    render(now / 1000);
    raf = requestAnimationFrame(frame);
  }

  const onVis = () => {
    visible = !document.hidden; last = performance.now(); lastFrame = 0;
    if (visible && !lost && !raf && !sleeping) raf = requestAnimationFrame(frame);
    else if (!visible) { cancelAnimationFrame(raf); raf = 0; }
  };
  document.addEventListener("visibilitychange", onVis);
  const onLost = (e) => { e.preventDefault(); lost = true; canvas.dispatchEvent(new CustomEvent("fluid:lost")); };
  canvas.addEventListener("webglcontextlost", onLost);

  resize();
  // Start clear: color enters only when the user moves or touches the page.
  raf = requestAnimationFrame(frame);

  return {
    destroy() {
      if (!running) return; running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove); window.removeEventListener("pointerdown", onMove);
      document.removeEventListener("visibilitychange", onVis);
      themeObserver.disconnect();
      canvas.removeEventListener("webglcontextlost", onLost);
      free();
      Object.values(programs).forEach((p) => gl.deleteProgram(p.prog));
      shaders.forEach((s) => gl.deleteShader(s));
      gl.deleteBuffer(vbo); gl.deleteVertexArray(vao);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    },
  };
}
