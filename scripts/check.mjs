// Syntax-checks every JS module and validates the shape of the content file.
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (p.endsWith(".js") || p.endsWith(".mjs")) out.push(p);
  }
  return out;
}

let failed = false;
for (const f of [...(await walk("src")), ...(await walk("scripts"))]) {
  const r = spawnSync(process.execPath, ["--check", f], { encoding: "utf8" });
  if (r.status !== 0) { failed = true; console.error(`✗ ${f}\n${r.stderr}`); }
}

const { portfolio: p } = await import("../src/content/portfolio.js");
const required = ["meta", "profile", "nav", "about", "experience", "technologies", "projects", "contact", "social"];
for (const k of required) if (!(k in p)) { failed = true; console.error(`✗ content: missing "${k}"`); }
if (!p.profile?.nameLines?.length) { failed = true; console.error("✗ content: profile.nameLines is empty"); }
if (p.marquee && !(p.marquee.a?.length || p.marquee.b?.length)) { failed = true; console.error("✗ content: marquee has no items"); }
if (!p.technologies?.length) { failed = true; console.error("✗ content: technologies is empty"); }

if (failed) process.exit(1);
console.log("✓ syntax OK · ✓ content shape OK");
