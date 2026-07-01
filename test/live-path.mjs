// Oracle #2 — the TRUE live path (Law 5): open the real index.html in real Chromium, upload the
// fixture through the real file input, let the real SheetJS (CDN) + real render run, then scrape
// the rendered KPIs + the app's own computed column types (window.State.meta). No app internals
// are re-implemented here; we observe what the shipped app actually produces.
import { chromium } from 'playwright';

const INDEX = process.argv[2];
const FIXTURE = process.argv[3];
const fileUrl = 'file:///' + INDEX.replace(/\\/g, '/').replace(/ /g, '%20');

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

try {
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30000 });
  // wait for the CDN SheetJS to load (the app needs it to parse)
  const xlsxReady = await page.waitForFunction(() => typeof window.XLSX !== 'undefined', { timeout: 30000 })
    .then(() => true).catch(() => false);

  const input = await page.$('input[type=file]');
  if (!input) throw new Error('no <input type=file> found');
  await input.setInputFiles(FIXTURE);

  await page.waitForSelector('#kpiRow [data-count]', { timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(1800); // let the count-up animation settle so shown values are final

  const result = await page.evaluate(() => {
    const out = { meta: {}, kpis: [], verdict: null, rows: null, kpiRowText: null };
    const kr = document.querySelector('#kpiRow');
    out.kpiRowText = kr ? kr.innerText.replace(/\n+/g, ' | ').trim() : null;
    if (window.State) {
      out.rows = (window.State.rows || []).length;
      if (window.State.meta) for (const k of Object.keys(window.State.meta)) out.meta[k] = window.State.meta[k].type;
    }
    out.kpis = [...document.querySelectorAll('#kpiRow [data-count]')].map((el) => {
      const card = el.closest('.kpi, article, div');
      return { dataCount: el.getAttribute('data-count'), shown: el.textContent.trim(), label: card ? card.textContent.replace(/\s+/g, ' ').trim().slice(0, 140) : '' };
    });
    const v = document.querySelector('#verdictBox');
    out.verdict = v ? v.textContent.replace(/\s+/g, ' ').trim().slice(0, 700) : null;
    out.chartTitles = [...document.querySelectorAll('.chart-card h3, .fb-card h3')].map(e => e.textContent.trim());
    out.filterLabels = [...document.querySelectorAll('.filter-row__label')].map(e => e.textContent.trim());
    return out;
  });
  result.xlsxReady = xlsxReady;
  result.errors = errors;
  console.log(JSON.stringify(result, null, 2));
} catch (e) {
  console.log(JSON.stringify({ fatal: String(e && e.message), errors }, null, 2));
  process.exitCode = 2;
} finally {
  await browser.close();
}
