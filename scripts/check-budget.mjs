import { readFileSync, statSync } from "node:fs";

const manifest = JSON.parse(readFileSync("dist/.vite/manifest.json", "utf8"));
const entry = Object.values(manifest).find(item => item.isEntry && item.file.endsWith(".js"));
if (!entry) throw new Error("No Vite entry found in build manifest");
const jsBytes = statSync(`dist/${entry.file}`).size;
const css = (entry.css || []).reduce((sum, file) => sum + statSync(`dist/${file}`).size, 0);
const limits = { js: 280 * 1024, css: 180 * 1024 };
console.log(`Bundle budget: JS ${(jsBytes / 1024).toFixed(1)} KB, CSS ${(css / 1024).toFixed(1)} KB`);
if (jsBytes > limits.js || css > limits.css) {
  throw new Error(`Bundle budget exceeded (JS <= ${limits.js / 1024} KB, CSS <= ${limits.css / 1024} KB)`);
}
