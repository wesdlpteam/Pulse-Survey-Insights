---
name: project
description: Insight Survey Analyser; the 3 edtech setup questions are still OPEN.
metadata: { type: project }
---

**Product (verified from index.html):** *Insight · Universal Survey Analyser* — a single-file,
client-side web app. Upload any CSV/Excel survey export → instant editorial-grade analytics report
(KPIs, per-question breakdowns, recurring themes, a data-driven verdict).

**Stack (verified from index.html):** one `index.html`, vanilla HTML/CSS/JS, no build step, runs
fully client-side. CDN libs: `xlsx@0.18.5` (parsing) + `chart.js` (charts). Fonts: Inter.
Has a deep-purple/gold/lilac design-token system with WCAG-AA contrast noted inline.

**Why:** general survey analysis. Author is at a school, so a survey/feedback-insight tool is
plausibly used in an education setting — but the app itself is **not currently learner-facing**.

**OPEN — the 3 V2 setup questions were NOT answered** (user chose "run V2 as is" globally):
1. edtech product? — *unanswered; treat this repo as a general tool until told otherwise.*
2. learner age/level + curriculum/jurisdiction? — *unanswered / likely N/A here.*
3. target stack (keep vanilla vs migrate)? — *unanswered; currently vanilla single-file.*

**How to apply — adaptive tier: UNIVERSAL-only.** Edtech-scoped seats (L2 pedagogy, L4 practice,
L7 outcomes) stay PARKED unless a learner-facing surface is added. Still-on gates: correctness
(oracle-anchored tests), **WCAG 2.2 AA** (the design already claims AA — treat as a verifiable gate,
not a claim), human-writing, zero-hallucination. Privacy note: survey data may be personal → keep
processing client-side; no exfiltration.
