# War Room — Survey Analyser

**Blackboard, not a controller.** Claim your row before working; update on block/done; ping the peer
you unblock. A claim becomes DECIDED only after an INDEPENDENT seat attacked it with an ORACLE and
FAILED. Lead = referee + release-valve, never the message path for the challenge. Never nest
orchestrators. Leave-the-ball handoffs, not await/monitor.

- **Current wave:** WAVE 2 (real multi-agent) — make the report USEFUL: exclude identifier/PII columns (Id, Email, Timestamp, Name) from all analysis, and rework the verdict into actionable synthesis. User-reported.
- **Adaptive tier:** UNIVERSAL-only (no learner-facing surface yet → L2/L4/L7 parked).
- **Round cap (default):** 3
- **Goal / definition of done:** an INDEPENDENT numeric oracle (not the app's own code) re-derives the app's KPIs on a pinned fixture; diff run against the live path; any discrepancy logged to the correctness/hallucination ledger with its oracle. Ceremony-with-no-catch = FAIL (L3 watching).

## AGENT REGISTRY (self-register your ID so peers can wake you directly)
| Seat | Agent ID | Model | Cross-model? |
|---|---|---|---|
| L8 (lead/coord) | lead-session | Opus 4.8 | — |

## DISPATCH TABLE
| Seat | Status | Claimed task | Blocked on | Oracle anchor | Round |
|---|---|---|---|---|---|
| L1-read (librarian) | working | extract exact KPI/verdict/parse spec from index.html | | the source itself (evidence) | 1 |
| L1-oracle (impl) | blocked | build clean-room numeric oracle + fixture CSV | L1-read spec | independent pandas/node re-derivation | 1 |
| L5 (a11y) | queued | accessibility pass on live render | render harness | axe-core on live DOM | 1 |
| L6 (halluc) | queued | cross-model re-check of extracted formulas | L1-read spec | Gemini 3.5 (cross-model) | 1 |
| L8 (lead) | working | env check + coordinate; run the diff oracle | | flow/critical-path | 1 |

## DATA CONTRACT (post at design time so downstream builds in parallel — E3)
```
(none yet)
```

## DECIDED ledger (oracle-anchored — DO NOT re-litigate)
| # | Claim | Oracle + locator | Attacked by | Attack result | [FRESH]? |
|---|---|---|---|---|---|
| D1 | Date/Timestamp columns are wrongly averaged as 1-5 ratings (headline KPI + verdict). | real SheetJS parse (probe-parse.mjs) + live browser verdict (live-path.mjs); fixture sample-survey.csv | L1-read (hypothesis) → probe + L5 live render (confirm) | CONFIRMED; reading alone was insufficient (Law 5) | [FRESH] 2026-07-01 |
| D2 | The fix works: date columns now excluded; Average = Satisfaction 3.4/5; verdict names Satisfaction weakest. | re-run of live-path.mjs on same fixture (real browser) | L1 owner fixed → L5 live render re-verified | CONFIRMED fixed on the live path | [FRESH] 2026-07-01 |
| D3 | No automated accessibility violations (WCAG 2.2 AA rule set) on upload screen or full report. | axe-core via a11y-scan.mjs on live render | L5 ran axe; peer-rerunnable recipe pinned | PASS (automated only; manual keyboard/SR still advised) | [FRESH] 2026-07-01 |
| D4 | "Responses in view" KPI showed 0 (2nd real bug) — root-caused (hardcoded 0 count) and fixed. | live-path.mjs on both fixtures (real browser) | reproduced on 2 fixtures → root-caused → fixed → re-verified | CONFIRMED fixed (now shows 10 and 8) | [FRESH] 2026-07-01 |
| D5 | Independent Python oracle (oracle.py) agrees with the live app on clean-survey (mean 3.6, completion 100%, sentiment 60%, responses 10). | oracle.py vs live-path.mjs | two independent sources cross-checked | AGREE (strong correctness evidence) | [FRESH] 2026-07-01 |

## OPEN queue (round-capped)
| # | Open question | Owner | Needs oracle | Round |
|---|---|---|---|---|
| 1 | Does this repo become a learner-facing edtech product? If yes, run the 3-question bootstrap. | user | — | 0 |
| 2 | Optional design pass: impeccable flags (side-tab border L176, Inter font L11, layout-animation L171). | user | impeccable audit | 0 |

## HANDOFFS graph
- 

## ESCALATIONS (lead runs the oracle to resolve)
- 

---
## WAVE 2 BOARD (real multi-agent) — 2026-07-01
Core index.html edit = SINGLE OWNER (lead). Prep + verification = parallel agents. Board is lead-maintained.

**Round 1 (parallel):**
| Seat | Agent | Task | Oracle |
|---|---|---|---|
| P1 | worker (bg) | PII + edge-case fixtures + expected-columns answer key | hand-reasoned exclusions |
| P2 | general (bg) | synthesis design: local heuristic + responsible OpenAI-key AI option | existing data + privacy rules |
| P3 | Explore (bg) | map every column-type consumption site (completeness) | source read |
| L6 | Gemini (lead-run) | red-team identifier-detection rules for false pos/neg | independent model |

**Then:** L1 (lead, single owner) implements -> V (verifier + critic) attacks on live path + a11y + false-positive audit.

**OPEN decision (user):** AI comment-synthesis handling (OpenAI key offered) — PII-stripped opt-in vs local-only.

### DECIDED (Wave 2)
| # | Claim | Oracle | Result |
|---|---|---|---|
| W2-1 | Identifier/PII columns (Id, Email, Timestamp, Student ID) excluded from all analysis; real measures (Age, Score, Q1 Rating) kept. | live-path on pii + edge fixtures + a11y, vs the expected-columns answer key | CONFIRMED - matches the key; Average now shows the real rating, not Id. Gemini red-team unavailable (503), used edge fixtures instead. |
