// Renders og.png (1200x630) and apple-touch-icon.png (180x180) into src/.
// Usage: node scripts/render-assets.mjs   (needs the playwright package;
// set CHROME_PATH to use a system Chrome instead of a bundled browser)
import { chromium } from "playwright";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

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
await browser.close();
console.log("wrote src/og.png and src/apple-touch-icon.png");
