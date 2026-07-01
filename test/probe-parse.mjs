// Independent oracle #1 — settle the SheetJS parse crux using the REAL library (xlsx@0.18.5,
// same version the app pins). Reproduces the app's exact read path, then reports how each column
// would classify under the app's verbatim cascade. Emits parsed-matrix.json for the Python oracle.
import XLSX from 'xlsx';
import fs from 'node:fs';

const CSV = process.argv[2];
const OUT = process.argv[3] || 'parsed-matrix.json';
const buf = fs.readFileSync(CSV);

// EXACT app read path (index.html lines 369-371)
const wb = XLSX.read(new Uint8Array(buf), { type: 'array', cellDates: true });
const ws = wb.Sheets[wb.SheetNames[0]];
const matrix = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '', blankrows: false, raw: false });

// app helpers (verbatim, lines 350/352/407)
const isBlank = (v) => v === null || v === undefined || String(v).trim() === '';
function toNumber(v) {
  if (isBlank(v)) return NaN;
  if (typeof v === 'number') return v;
  const n = parseFloat(String(v).replace(/[, %$]/g, ''));
  return Number.isFinite(n) ? n : NaN;
}
const DATE_RE = /^\d{4}[-/]\d{1,2}[-/]\d{1,2}|^\d{1,2}[-/]\d{1,2}[-/]\d{2,4}/;

const header = matrix[0];
const body = matrix.slice(1).filter((r) => r && !r.every(isBlank)); // app's 2nd blank filter (line 386)

console.log('sheets           :', wb.SheetNames);
console.log('header           :', JSON.stringify(header));
console.log('body rows (kept) :', body.length, '(app drops fully-blank rows)');
console.log('');

header.forEach((h, i) => {
  const vals = body.map((r) => (i < r.length ? r[i] : '')).filter((v) => !isBlank(v));
  const n = vals.length;
  let numCount = 0, dateCount = 0;
  vals.forEach((v) => {
    if (!Number.isNaN(toNumber(v))) numCount++;
    const s = String(v);
    if (DATE_RE.test(s) || v instanceof Date) dateCount++;
  });
  const distinct = [...new Set(vals.map((v) => String(v).trim()))];
  const numericRatio = n ? numCount / n : 0;
  const dateRatio = n ? dateCount / n : 0;
  // app cascade first two branches (numeric BEFORE date) — the crux
  let cls;
  if (numericRatio >= 0.8 && distinct.length > 1) cls = 'numeric';
  else if (dateRatio >= 0.7) cls = 'date';
  else cls = 'other(cat/text/multi)';
  const sample = body.find((r) => !isBlank(r[i]));
  console.log(`col[${i}] "${h}"`);
  console.log(`   parsedJsType=${typeof (sample && sample[i])} isDate=${sample && sample[i] instanceof Date} sampleValue=${JSON.stringify(sample && sample[i])}`);
  console.log(`   n=${n} numCount=${numCount} (ratio ${numericRatio.toFixed(2)})  dateCount=${dateCount} (ratio ${dateRatio.toFixed(2)})  distinct=${distinct.length}`);
  console.log(`   => classifies as: ${cls}`);
});

fs.writeFileSync(OUT, JSON.stringify(matrix, (k, v) => (v instanceof Date ? { __date__: v.toISOString() } : v)));
console.log('\nwrote parsed matrix ->', OUT);
