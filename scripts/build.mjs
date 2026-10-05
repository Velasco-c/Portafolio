// Zero-dependency "build": copies the deployable files into ./dist (static hosting ready).
import { cp, rm, mkdir } from "node:fs/promises";

await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("index.html", "dist/index.html");
await cp("src", "dist/src", { recursive: true });
await cp("public", "dist/public", { recursive: true });
console.log("Built → dist/ (deploy this folder to any static host)");
