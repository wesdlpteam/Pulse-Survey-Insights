# Survey Analyser — project instructions

Coding **V2** governs here (loaded from `~/.claude/CLAUDE.md` → full manual `~/.claude/coding-v2/Coding-V2.md`).
Say **"go back to Coding V1"** to switch modes; see `coding-modes/Coding-V1.md`.

## What this is
`index.html` — single-file, client-side *Insight · Universal Survey Analyser* (vanilla HTML/CSS/JS;
`xlsx@0.18.5` + `chart.js`; no build step). See `.agent-memory/facts/project.md`.

## Adaptive tier: UNIVERSAL-only
Not learner-facing → edtech seats (L2 pedagogy, L4 practice, L7 outcomes) are PARKED. Re-engage them
only if a learner-facing surface is added, and run the 3-question bootstrap first.

## Oracles for THIS stack (to build before making correctness claims)
- **Governed test suite (live-path):** a Playwright test that opens `index.html`, uploads a *fixed
  sample* CSV/XLSX, and asserts the rendered KPIs/breakdowns/verdict — route through the real
  upload→parse→render path, never internal functions (Law 5). Pin sample files as immutable fixtures.
- **Numeric oracle (differential):** compute expected KPIs from the sample with an INDEPENDENT tool
  (e.g. a tiny Python/pandas script, ideally cross-model) and diff against the app's output. The app's
  own output is never its own oracle (Laws 2–3).
- **Accessibility gate:** `@axe-core/cli` (or axe in the Playwright test) on the live render → WCAG 2.2
  AA. The design already claims AA inline — treat that as a checkable claim, not a fact.
- **Reading-grade:** not required (not learner-facing). Human-writing law still applies to all UI copy.

## Standing rules (from V2)
- Zero-hallucination / source-or-silent binds every seat incl. the lead. Tag provenance; "cannot verify"
  over gap-fill.
- Survey data may be personal → keep processing client-side; no exfiltration.
- Merge bar: suite passes (necessary not sufficient) + independent numeric oracle agrees + a11y passes +
  no open L3 RED + L6 cleared material claims.
