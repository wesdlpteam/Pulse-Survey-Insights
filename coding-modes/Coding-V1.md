# Coding V1 — Superpowers + Oh-my-claude + Impeccable

**Status:** preserved / dormant. This is the setup that was active before Coding V2.
To return to it, tell me **"go back to Coding V1"** and I will operate by this document
(and neutralise the V2 governance in `CLAUDE.md`). Nothing here is uninstalled — the
plugins and skills remain available at all times; this file just records the *mode*.

---

## What V1 is

A general-purpose, high-discipline solo-developer setup built from three installed layers.
It is **not** edtech-specialised and has **no** hostile oracle-anchored review army. Its
strengths are process discipline, context protection, and design craft.

### Layer 1 — Superpowers (process skills)
Invoke-before-acting skills that set the *approach* before implementation:

- `brainstorming` — required before any creative/build work; explores intent + design.
- `writing-plans` / `executing-plans` — spec → plan → checkpointed execution.
- `test-driven-development` (red/green/refactor) — tests before implementation.
- `systematic-debugging` — root-cause discipline before proposing fixes.
- `verification-before-completion` — run real checks + show output before claiming done.
- `subagent-driven-development` / `dispatching-parallel-agents` — parallel independent work.
- `requesting-code-review` / `receiving-code-review` — rigorous review, no performative agreement.
- `using-git-worktrees` — isolated workspaces for feature work.
- `writing-skills` — author/edit skills via TDD.
- `finishing-a-development-branch` — merge/PR/cleanup decision.
- `using-superpowers` — the meta-skill: check for a relevant skill before ANY response.

### Layer 2 — Oh-my-claude (conductor + agents + coordination)
- **Identity:** conductor, not musician — PLAN, DELEGATE, COORDINATE, VERIFY; don't implement in-context.
- **Context Protection:** context window is for reasoning, not storage; subagent context is free.
- **Agents:** `librarian` (READ/summarise large files + git), `advisor` (pre-plan gap analysis),
  `critic` (review plans before execution), `validator` (run checks, binary verdict),
  `code-reviewer`, `risk-assessor`, `security-auditor`.
- **Built-in agents:** `Explore` (find), `Plan` (design), `general-purpose`/`worker` (build), `verifier` (independent verification).
- **Task system:** `TaskCreate/TaskUpdate/TaskList` with `addBlockedBy/addBlocks` to model ordering.
- **Skills:** `prime`, `debugger`, `tdd`, `verification`, `worktree`, `git-commit-validator`,
  `pr-creation`, `receiving-code-review`, `init-deep`, `ralph-plan`, `ralph-loop-init`, `writing-skills`.
- **MCP:** `context7` (live library docs), `sequential-thinking`.
- **Hard rule:** NO EVIDENCE = NOT COMPLETE. Verify edited files, run claimed-passing tests, check build exit codes.

### Layer 3 — Impeccable (frontend design craft)
- `impeccable` skill — UX review, visual hierarchy, information architecture, cognitive load,
  accessibility, responsive behaviour, theming, typography, spacing, colour, motion, micro-interactions,
  UX copy, error/empty states, i18n, reusable design systems/tokens. Live browser iteration.

### Global user layer (always on, in both modes)
- `delegating-to-gemini` — delegate huge-context / second-opinion / web-research / bulk grunt work to
  Gemini 3.5 Flash via `mcp__gemini-cli__ask-gemini`, after redacting Wesley College personal data.
- `wesley-brand-kit` — Wesley College palette, typography, semantic UI colours, design tokens.

---

## How V1 operates (the default loop)
1. `brainstorming` to explore intent → 2. `writing-plans` for multi-step work →
3. `using-git-worktrees` for isolation → 4. delegate reads to `librarian`, finds to `Explore` →
5. implement via `worker`/`general-purpose` with `test-driven-development` →
6. `validator`/`verifier` for evidence → 7. `requesting-code-review` →
8. `git-commit-validator` / `pr-creation` → 9. `finishing-a-development-branch`.

Design work routes through `impeccable` (+ `wesley-brand-kit` when asked).

---

## Restoring V1
Say **"go back to Coding V1."** I will: (a) treat this document as the operating mode,
(b) stop applying the V2 8-seat hostile-oracle governance, and (c) leave all V2 artifacts
(`.agent-memory/`, war-room files, hooks) in place but dormant unless you ask to remove them.
