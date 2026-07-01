# Governed test suite (Coding V2 oracles)

Independent checks for the Survey Analyser. None of them trust the app's own output; each is a
separate source of truth (Laws 2-3), and the browser test drives the REAL upload -> parse -> render
path (Law 5), not internal functions.

## Files
- `fixtures/sample-survey.csv` — adversarial file (blank cells, mixed case, a Timestamp column) that
  exposed the "date treated as a rating" bug. Pinned; do not edit (add a new fixture instead).
- `fixtures/clean-survey.csv` — a normal school survey (Year 7-12), for a happy-path / regression check.
- `fixtures/expected-oracle.md` — hand-worked answer key for `sample-survey.csv`.
- `oracle.py` — independent numbers checker, pure Python standard library. `python oracle.py [file.csv]`.
- `probe-parse.mjs` — reads a file with the real `xlsx@0.18.5` and reports how each column is classified.
- `live-path.mjs` — opens `index.html` in a real Chromium browser, uploads a file the normal way, and
  reads back the on-screen KPIs + verdict (the true live path).
- `a11y-scan.mjs` — runs `axe-core` (WCAG 2.2 AA rules) against the live page.

## One-time setup (dependencies are NOT committed; node_modules is gitignored)
```
npm install xlsx@0.18.5 playwright axe-core
npx playwright install chromium
```

## Run
```
python oracle.py fixtures/clean-survey.csv
node probe-parse.mjs fixtures/sample-survey.csv
node live-path.mjs ../index.html fixtures/sample-survey.csv
node a11y-scan.mjs ../index.html fixtures/clean-survey.csv
```

## Settled results (full detail in `.agent-memory/facts/correctness-ledger.md`)
- CL-1 date/timestamp columns were averaged as if they were 1-5 ratings — FIXED.
- CL-3 "Responses in view" KPI always showed 0 — FIXED.
- CL-2 accessibility: 0 automated WCAG 2.2 AA violations (manual keyboard/screen-reader still advised).
- CL-4 independent Python oracle agrees with the live app on the clean survey.
