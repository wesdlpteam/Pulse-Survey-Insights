# Survey Analyser — Comprehensive Improvement Design

**Date:** 2026-07-01
**Status:** Approved (design), pending implementation plan
**Author / owner:** Nathan Benn (with Claude, Coding V2)
**Applies to:** `index.html` (Insight · Universal Survey Analyser)

## 1. Context

`index.html` is a single-file, client-side survey analyser: vanilla HTML/CSS/JS, no build
step, using `xlsx@0.18.5` and `chart.js` from CDN. It takes a CSV/Excel survey export and
produces KPIs, per-question bar charts, live pill filters, open-text themes with sentiment,
and a prose verdict with recommended actions.

A librarian read of the current file (1002 lines) surfaced concrete gaps that motivate this
work. Reference the git history and that read for detail; the load-bearing ones are captured
inline below.

## 2. Goals

Improve the app across four areas in one comprehensive, internally phased pass:

1. Smarter analysis (correctness) — a V2 hard gate.
2. Accessibility (WCAG 2.2 AA) — a V2 hard gate.
3. Robustness on real, messy files.
4. New user-facing capabilities.

All backed by a governed, oracle-anchored test suite before any correctness claim is made.

## 3. Decisions locked with the user

| Decision | Choice |
|---|---|
| Scope | All four areas, one comprehensive pass, internally phased |
| Verification | Build the governed oracle: Playwright live-path suite + independent Python/pandas numeric oracle + axe accessibility gate |
| App architecture | Stays a single portable `index.html`, no build step for the shipped app. Test tooling is dev-only |
| Code structure | Approach B: refactor the JS into clearly-bounded, mostly-pure modules under one `window.Insight` namespace |
| Column transparency | Column Inspector + per-column include/exclude + type override is a core piece, not optional |
| External AI | Optional, off-by-default "AI deep-read" of open text, with PII redaction before any send, bring-your-own Claude key, explicit pre-send warning. Off by default means zero network calls |

## 4. Non-goals

- No migration away from single-file / no-build for the shipped app.
- No claim of multilingual sentiment. Non-English text is handled honestly (see 6.1), not faked.
- No semantic "understanding" of every answer on-device. On-device analysis stays statistical.
- No unrelated refactoring beyond what serves these goals.

## 5. Architecture (Approach B)

One IIFE inside `index.html` exposing a single namespace `window.Insight`. The five pure
modules are the oracle's targets and are reachable from Playwright via `page.evaluate`.

| Module | Responsibility | Purity |
|---|---|---|
| `Parse` | ArrayBuffer to `{ sheets:[{name, matrix}], warnings }`; enumerates all sheets; records encoding/format warnings | pure-ish (wraps SheetJS) |
| `Ingest` | one sheet matrix to `{ headers, rows, title, warnings }`; dedup headers, drop blank rows, header-row detection | pure |
| `Infer` | headers+rows to `columns:[{name, type, stats}]`; `type in {numeric, likert, categorical, multi, date, text}` | pure |
| `Stats` | filtered rows+columns to KPIs, tallies, breakdowns | pure |
| `Text` | tokenize, themes (uni/bigrams), sentiment with coverage guard | pure |
| `Verdict` | stats+text to `{ prose, facts, actions }` | pure |
| `Filter` | state+rows to filtered rows | pure |
| `Render` | orchestrates modules, paints DOM | impure |
| `A11y` | chart data-table builder, aria wiring | impure |
| `Export` | print stylesheet, self-contained HTML/CSV download, optional AI call | impure |
| `UI` | toast, reveal, count-up, dropzone, sheet/column pickers, inspector | impure |

`State` holds the raw parsed sheets plus current selections: active sheet, included columns,
per-column type overrides, and active filters. Refactor ships with no behaviour change; it is
the reorg that makes everything downstream testable.

## 6. Feature design

### 6.1 Smarter analysis (correctness gate)

- **Likert/rating as a first-class `likert` type.** Detect (a) small integer scales
  (1-5 / 1-7 / 0-10, roughly <= 11 distinct values) and (b) worded agreement/frequency/
  satisfaction scales matched against the existing ordinal scale sets (extended). Likert
  columns get ordinal ordering, a mean and a distribution, and a top-box percentage
  (for example % agree + strongly agree).
- **Fix `splitMulti` over-splitting.** Stop splitting on runs of 2+ spaces. Classify a column
  as `multi` only when a single consistent delimiter recurs across most non-empty cells;
  otherwise it stays `text`/`categorical`.
- **`toNumber` guard.** Do not coerce strings like "50% of the time" into `50`. Require a cell
  to be predominantly numeric before stripping symbols, so text answers stop polluting numeric
  ratios and averages.
- **Remove the duplicate-completion KPI hack.** Replace the two-identical-cards fallback with a
  genuine second metric chosen from what the data actually contains. No two KPI cards ever show
  the same number.
- **Honest sentiment degradation.** Keep the lexicon, add a coverage check: if too few tokens
  hit the lexicon (non-English or heavy jargon), display "sentiment not reliable for this
  dataset" rather than a fake all-neutral result. Add light stemming and a slightly wider
  negation window.
- **Quote attribution fix.** Carry the source row index through so a representative quote is
  attributed to the row it came from, not the first text-equal match.
- **Verdict tightening.** Base mood on Likert top-box and numeric means where available, not
  sentiment alone. Guard against small-N over-claiming.

### 6.2 Accessibility (WCAG 2.2 AA gate)

- Each chart `<canvas>` gains `role="img"` + a concise `aria-label` summary, plus a
  visually-hidden (toggle-to-show) data `<table>` built by `A11y` from the same `Stats` tally,
  so the table can never drift from the chart.
- Filter pills gain `aria-pressed` reflecting selection state; keep existing `:focus-visible`.
- No colour-only signals: the sentiment mini-bar gains inline text/percent labels.
- Dropzone and inspector controls are labelled, keyboard-operable controls.
- `@axe-core` runs against the live render in the test suite (WCAG 2.2 AA must pass). The inline
  AA contrast claims are verified with an actual contrast checker, not trusted as comments.

### 6.3 Robustness

- **Multi-sheet:** a sheet picker appears for workbooks with >1 sheet; defaults to first
  non-empty. No more silently reading only sheet 1.
- **Header-row / layout detection:** detect the likely header row so a title banner or blank
  rows above the data do not wreck inference; let the user adjust "data starts at row N".
  Merged-cell or pivot-looking sheets raise a non-blocking warning banner.
- **Large files:** parse off the main thread (Web Worker) with a progress state; debounce filter
  re-renders. Row count always shown. If display ever samples, it says so (no silent caps).
- **Encoding:** strip UTF-8 BOM, use SheetJS codepage handling, warn on obvious mojibake.
  Honest limit: perfect legacy-encoding detection is not guaranteed; the app warns rather than
  pretends.
- **Errors:** distinct, friendly messages for empty file, unsupported type, zero data rows,
  all-blank sheet, and parse failure, replacing today's single coarse catch.

### 6.4 Column Inspector (core)

Every column listed with: detected type, a sample of values, and the analytic being applied.
Controls per column: include/exclude, and type override. Also drives which columns power the
filter pills (today the app silently auto-picks 3). This is the honest answer to "does it read
and interpret every column": every column is read and surfaced; interpretation is best-effort
but always visible and user-correctable.

### 6.5 New capabilities

- **Export:**
  - Print stylesheet for a clean, branded "Save as PDF" (zero dependencies).
  - Self-contained standalone `.html` download of the current report (data + rendered state
    inlined) that opens offline.
  - CSV export of the computed tables (per-question tallies, KPIs).
- **Selection UX:** built on the Column Inspector — pick active sheet, include/exclude columns,
  override types, choose filter-driving columns.
- **Optional AI deep-read (off by default):** redact-then-send toggle. PII (names/emails/phones)
  stripped before any send; explicit pre-send warning; bring-your-own Claude key stored in
  `localStorage`; current Claude model, with the exact model / endpoint / direct-browser-access
  header pinned against the `claude-api` reference at implementation time. Toggle off means zero
  network calls.

## 7. Testing and the governed oracle

- **Fixtures (immutable), under `test/fixtures/`:** a clean survey CSV, a Likert-heavy XLSX, a
  multi-sheet workbook, and a messy file (merged cells / non-English / blanks). Ground-truth
  inputs, pinned.
- **Independent numeric oracle `test/oracle.py` (pandas):** computes expected KPIs, Likert
  means/top-box, category tallies, completion %, and sentiment coverage from the fixtures,
  independently of the app. The app's output is never its own oracle.
- **Playwright suite:** opens `index.html`, uploads each fixture through the real upload to
  render path (Law 5), asserts on-screen KPIs/breakdowns/verdict, and also calls
  `Insight.Stats.*` / `Insight.Infer.*` via `page.evaluate` and diffs against `oracle.py`.
  Any mismatch fails.
- **Accessibility gate:** `@axe-core` on the live render, WCAG 2.2 AA.
- **Dev-only:** all of the above lives in `test/` with a `package.json` of dev-deps. The shipped
  app stays a single dependency-free `index.html`.

## 8. Implementation order (one pass, internally phased)

1. Refactor JS into `Insight.*` modules (no behaviour change) + stand up fixtures, `oracle.py`,
   and a first Playwright test that passes against current behaviour (safety net first).
2. Smarter analysis (6.1), each change verified against the oracle.
3. Robustness (6.3) + Column Inspector (6.4).
4. Accessibility (6.2), axe gate green.
5. New capabilities (6.5), including the optional redacted AI toggle.
6. Final pass: full suite green + oracle agrees + axe passes + human-writing eyeball of all UI
   copy (warm, right level, no AI tells, no em-dashes).

## 9. Definition of done (merge bar)

- Playwright live-path suite passes (necessary, not sufficient).
- Independent numeric oracle agrees on every asserted number.
- `@axe-core` WCAG 2.2 AA passes on the live render.
- No two KPI cards show the same value; sentiment degrades honestly on non-English input.
- Every column is visible and correctable in the Column Inspector.
- With the AI toggle off (default), zero network calls occur; with it on, PII is redacted before
  any send and the user is warned.
- Human-writing pass on all UI copy.

## 10. Honest limitations (source-or-silent)

- Type inference is heuristic and has a failure floor; the Column Inspector makes that floor
  visible and correctable rather than hidden.
- Malformed layouts (merged cells, multi-row headers, pivots) are detected and warned about,
  not guaranteed to parse perfectly.
- Legacy text encodings cannot be perfectly auto-detected; the app warns.
- On-device text analysis is statistical, not semantic. Deeper interpretation requires the
  opt-in AI toggle, which sends redacted text off-device.
