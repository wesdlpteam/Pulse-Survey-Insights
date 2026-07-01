// Render-and-eyeball helper: screenshot the real app (optionally with a fixture loaded).
import { chromium } from 'playwright';
const INDEX = process.argv[2], FIXTURE = process.argv[3], OUT = process.argv[4];
const url = 'file:///' + INDEX.replace(/\\/g, '/').replace(/ /g, '%20');
const b = await chromium.launch({ headless: true });
const p = await b.newPage({ viewport: { width: 1280, height: 900 }, deviceScaleFactor: 2 });
await p.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
await p.waitForFunction(() => typeof window.XLSX !== 'undefined', { timeout: 30000 }).catch(() => {});
await p.waitForTimeout(400);
if (FIXTURE && FIXTURE !== '-') {
  const i = await p.$('input[type=file]');
  if (i) { await i.setInputFiles(FIXTURE); await p.waitForSelector('#kpiRow [data-count]', { timeout: 30000 }).catch(() => {}); await p.waitForTimeout(2200); }
}
await p.evaluate(() => document.fonts && document.fonts.ready).catch(() => {});
await p.waitForTimeout(300);
await p.screenshot({ path: OUT, fullPage: true });
console.log('shot ->', OUT);
await b.close();
