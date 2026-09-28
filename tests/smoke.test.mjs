import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

test("production configuration keeps API and asset boundaries explicit", async () => {
  const worker = await readFile("src/worker.js", "utf8");
  const config = await readFile("wrangler.jsonc", "utf8");
  assert.match(worker, /pathname\.startsWith\("\/api\/"\)/);
  assert.match(worker, /cache-control/);
  assert.match(config, /"DB"/);
  assert.match(config, /"MEDIA"/);
});

test("responsive image manifest contains the hero derivative", async () => {
  const manifest = JSON.parse(await readFile("src/constants/image-manifest.json", "utf8"));
  assert.ok(manifest["/images/hero-tech-lab.png"]?.srcSet);
});
