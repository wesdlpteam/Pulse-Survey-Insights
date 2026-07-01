---
name: correctness-ledger
description: Living ledger of settled correctness findings + re-runnable recipes.
metadata: { type: reference }
---

# Correctness Ledger (living)

A finding is settled only when an INDEPENDENT seat attacked it against an ORACLE and failed.
Each row stores the RECIPE to re-prove it — memory is a pointer, not truth; re-run before relying.

| # | Finding (settled) | Oracle + immutable locator | Re-runnable recipe | Attacked by | Date |
|---|---|---|---|---|---|
| CL-1 | Date/Timestamp columns are misread as 1-5 rating questions. The headline "Average" KPI and the written verdict treat the first date column as a rated question (live verdict literally: "Timestamp is the weakest area at 1/5"). Root cause: the type classifier checks numeric BEFORE date, and `toNumber` uses `parseFloat`, so "1/1/24" becomes 1. | Real `xlsx@0.18.5` parse (probe) + live browser verdict (Playwright). Fixture `test/fixtures/sample-survey.csv` (git-pinned). App: `index.html` cascade ~L430-435, `toNumber` L352, avg KPI L596-604. | L1-read raised the hypothesis; probe (real lib) + L5 live render CONFIRMED; reading alone did NOT settle it (Law 5). | 2026-07-01 |

**Recipe to re-prove CL-1:** `node probe-parse.mjs <fixture>` shows Timestamp classifies as numeric (all values `parseFloat` to 1); `node live-path.mjs <index.html> <fixture>` renders a verdict saying "Timestamp is the weakest area at 1/5". A governed live-path test (Playwright) now exists, so the earlier "no suite" note is retired.

**Verified-correct on the same run (not bugs):** response count = 8 (fully-blank row correctly dropped); completion = 95% (38 filled / 40 cells); NPS column averaged to 6.3 (=50/8). These matched the independent hand-computed answer key.

## CL-1 FIXED + re-verified (2026-07-01)
Fix in `index.html`: the type classifier now checks date BEFORE numeric/multi (`dateRatio>=0.7` first),
so a date column can no longer masquerade as a rating. Re-ran the live-path oracle on the same fixture:
- Average KPI now = **3.4 / 5**, labelled Average "Satisfaction (1-5)" (was 1 / 5 = Timestamp).
- Verdict now = "Satisfaction (1-5) is the weakest area at 3.4/5 ... NPS (0-10) (6.3/10) a strength."
- Response count (8) and completion (95%) unchanged. No console errors.

## CL-2 accessibility (2026-07-01) — PASS (automated)
axe-core WCAG 2.0/2.1/2.2 A+AA rule set on the live render: **0 violations** on the upload screen
(18 checks passed) and **0** on the full report (21 passed). Recipe: `node a11y-scan.mjs <index> <fixture>`.
Caveat: axe automatically catches roughly a third to a half of WCAG issues; keyboard + screen-reader
spot-checks are still needed before a full AA claim.

## CL-5 (design pass, 2026-07-01) — latent tag contrast fixed
The polish pass's a11y re-scan surfaced a real latent fail: the small sentiment tags rendered text
below 4.5:1 on their pale badges (`.tag.pos` ~4.4:1, `.tag.neg` ~3.9:1, `.tag.neu` ~3.3:1). Fixed with
darker text-only tokens (`--pos-ink`/`--neg-ink`/`--neu-ink`); badge fills + chart colours unchanged.
Re-verified 0 axe violations on BOTH fixtures (sample renders neg/neu tags). Design pass also swapped
Inter -> IBM Plex Sans (body) + Spectral (display headings) and removed the `.quote` gold side-stripe.

## CL-6 (Wave 2, multi-agent, 2026-07-02) — identifier / PII columns excluded from analysis
Real user complaint: the app showed "Average Id" and analysed an Email column. Root cause: any numeric-
or text-looking column was treated as data. Fix: new column type "id" (`isIdentifierCol`: header keywords
id/email/name/timestamp/phone/address + an email data-pattern check; deliberately NOT "all-unique numbers",
so real measures like Age/Score are never wrongly dropped), checked FIRST in `analyse()`; plus the two
completion-tally loops (renderKPIs + renderVerdict) now skip type "id". Verified on the live path:
- pii-survey.csv: Average is now "Overall Satisfaction" (was Id); Id/Email/Timestamp gone from charts,
  filters and verdict; response count 10, completion 100%.
- edge-columns.csv (false-positive trap): Student ID + Email Address excluded; Age, Score /100, Q1 Rating
  correctly KEPT. Matches `test/fixtures/expected-columns.md` exactly.
- axe WCAG 2.2 AA: 0 violations on both fixtures.
Cross-model red-team (Gemini) was UNAVAILABLE (503 overload + network); rules were red-teamed against the
edge fixtures instead (honest gap). Recipe: `node live-path.mjs <index> test/fixtures/pii-survey.csv`.

## CL-3 FIXED + re-verified (2026-07-01) — "Responses in view" KPI showed 0
CONFIRMED real (reproduced on BOTH fixtures: the response card showed 0 while the verdict knew the
true count). Root cause: in `renderKPIs` (index.html ~L591-592) the responses card passed `0` as the
count-up target; `kpiCard` animates `data-count` (the `count` arg), not the `value` arg, so it always
counted up to 0. Fix: pass `shown` instead of `0`. Re-ran live-path: responses now show 10
(clean-survey) and 8 (sample-survey). Recipe: `node live-path.mjs <index> <fixture>`.

## CL-4 cross-oracle agreement (2026-07-01) — independent Python oracle matches the app
On `clean-survey.csv`, the independent `oracle.py` (pure Python, no app code) and the live app agreed
on every headline number: satisfaction mean 3.6, completion 100%, positive sentiment 60%, responses 10.
Two independent sources agreeing = strong correctness evidence, and confirms the CL-1 fix is safe on a
normal (timestamp-free) survey. Recipe: `python oracle.py fixtures/clean-survey.csv` vs `node live-path.mjs`.
