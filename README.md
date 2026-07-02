# Pulse · Survey Insights

Turn any CSV or Excel survey export into an instant, readable insights report: KPIs, per-question
breakdowns, group comparisons, recurring themes, and a plain-English verdict. Everything runs in your
browser. Nothing is uploaded.

Created by the DLP Team.

## Use it
Open `index.html` in a browser (or host it anywhere static). Drop in a `.csv`, `.xlsx`, or `.xls` survey
export and the report builds itself. You can also type what the survey is about at the top to focus the
verdict.

## What it does
- **At a glance:** response count, key averages, completion rate, open-text sentiment.
- **Key findings:** the 3 to 4 most striking points, in plain English.
- **Per-question breakdowns** and a **rating spread** (how each rating leans from low to high).
- **Compare groups:** for example, average satisfaction by year level or by campus.
- **Open feedback:** recurring themes (click one to read the comments behind it), plus what people liked
  and what could be better.
- **Verdict and recommended actions.**
- **Export:** download a self-contained interactive report that works offline and can be shared by email,
  or save as PDF.

## Privacy
- All processing happens in your browser. Nothing is sent anywhere by default.
- Identifier and personal-info columns (names, emails, ID numbers, phone numbers, timestamps) are
  detected and excluded from the analysis, charts, and exports.

## Optional AI verdict (bring your own OpenAI key)
Paste an OpenAI API key in the bar at the top and the verdict is written by AI, grounded in your data.
- Your key is stored only in your browser. It is never saved in the file or included in a shared report.
- Only anonymised comments and aggregate numbers are sent to OpenAI. Never names, emails, IDs, or phones.
- The AI verdict is baked into a shared export as plain text, so recipients need no key and nothing is
  sent when they open it.

## Built with
Vanilla HTML, CSS, and JavaScript in a single file. SheetJS (parsing) and Chart.js (charts, bundled inline
so exports work fully offline).

## Tests
`test/` holds a governed check suite: live-path browser tests (Playwright), an accessibility scan
(axe-core, WCAG 2.2 AA), and an independent Python numbers oracle, with fabricated sample fixtures.
See `test/README.md` for how to run them.
