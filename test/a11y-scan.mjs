// L5 accessibility oracle — run axe-core (WCAG 2.2 AA rule set) against the REAL rendered app,
// both on the upload screen and on the full report (fixture loaded). Reports violations by impact.
import { chromium } from 'playwright';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const axePath = require.resolve('axe-core/axe.min.js');

const INDEX = process.argv[2];
const FIXTURE = process.argv[3];
const fileUrl = 'file:///' + INDEX.replace(/\\/g, '/').replace(/ /g, '%20');
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

async function scan(label) {
  await page.addScriptTag({ path: axePath });
  const res = await page.evaluate(async (tags) => await window.axe.run(document, { runOnly: tags }), TAGS);
  const byImpact = { critical: 0, serious: 0, moderate: 0, minor: 0 };
  const items = res.violations.map((v) => {
    byImpact[v.impact] = (byImpact[v.impact] || 0) + 1;
    return { id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length, example: v.nodes[0] && v.nodes[0].target };
  });
  return { label, total: res.violations.length, byImpact, passes: res.passes.length, violations: items };
}

try {
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForFunction(() => typeof window.XLSX !== 'undefined', { timeout: 30000 }).catch(() => {});
  const uploadScan = await scan('upload screen');

  let reportScan = null;
  if (FIXTURE) {
    const input = await page.$('input[type=file]');
    if (input) {
      await input.setInputFiles(FIXTURE);
      await page.waitForSelector('#kpiRow [data-count]', { timeout: 30000 }).catch(() => {});
      await page.waitForTimeout(1500);
      reportScan = await scan('full report');
    }
  }
  console.log(JSON.stringify({ uploadScan, reportScan }, null, 2));
} catch (e) {
  console.log(JSON.stringify({ fatal: String(e && e.message) }, null, 2));
  process.exitCode = 2;
} finally {
  await browser.close();
}
