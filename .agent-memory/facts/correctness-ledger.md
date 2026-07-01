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
| — | (none yet — no governed test suite exists for this repo yet) | | | | |

**Note:** this repo has no automated test suite yet. Before any correctness *claim* about the Survey
Analyser, stand up a governed oracle (see project CLAUDE.md → Oracles) and test the LIVE path
(the actual upload→parse→render flow), not internal functions.
