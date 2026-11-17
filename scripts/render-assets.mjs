// Renders og.png (1200x630), apple-touch-icon.png (180x180) and
// favicon-32.png (32x32) into src/. After capture, PNG extra chunks
// are stripped so only IHDR/IDAT/IEND remain.
// Usage: node scripts/render-assets.mjs   (needs the playwright package;
// set CHROME_PATH to use a system Chrome instead of a bundled browser)
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";
import { spawnSync } from "node:child_process";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto(pathToFileURL(path.join(root, "scripts/og/og.html")).href);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: path.join(root, "src/og.png") });

await page.setViewportSize({ width: 180, height: 180 });
await page.setContent(`<style>html,body{margin:0;background:#1a1814}</style><img src="${pathToFileURL(path.join(root, "src/favicon.svg")).href}" width="180" height="180" style="display:block">`);
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(root, "src/apple-touch-icon.png") });

await page.setViewportSize({ width: 32, height: 32 });
await page.setContent(`<style>html,body{margin:0;background:#1a1814}</style><img src="${pathToFileURL(path.join(root, "src/favicon.svg")).href}" width="32" height="32" style="display:block">`);
await page.waitForTimeout(200);
await page.screenshot({ path: path.join(root, "src/favicon-32.png") });
await browser.close();

const stripPy = `
import struct, sys
from pathlib import Path
KEEP = {b"IHDR", b"IDAT", b"IEND"}
for p in sys.argv[1:]:
    data = Path(p).read_bytes()
    assert data[:8] == b"\\x89PNG\\r\\n\\x1a\\n", p
    out = bytearray(data[:8])
    off = 8
    while off + 8 <= len(data):
        length = struct.unpack(">I", data[off:off+4])[0]
        typ = data[off+4:off+8]
        chunk = data[off:off+12+length]
        if typ in KEEP:
            out.extend(chunk)
        off += 12 + length
        if typ == b"IEND":
            break
    Path(p).write_bytes(out)
`;
const strip = spawnSync("python3", [
  "-c", stripPy,
  path.join(root, "src/og.png"),
  path.join(root, "src/apple-touch-icon.png"),
  path.join(root, "src/favicon-32.png"),
], { encoding: "utf8" });
if (strip.status !== 0) {
  console.error(strip.stderr || strip.stdout);
  process.exit(strip.status || 1);
}
console.log("wrote src/og.png, src/apple-touch-icon.png and src/favicon-32.png");
