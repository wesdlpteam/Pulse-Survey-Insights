# Independent numeric oracle — answer key for `sample-survey.csv`

**Immutable fixture** (pinned by git commit = the immutable rev, Law 2). Do not edit the CSV; if the
survey shape must change, add a NEW fixture. All values below are hand-computed from the CSV by a
human-verifiable method, independent of the app's code (Law 3: never baseline against the app's own
output). The executable oracle (`test/oracle.py`, pure stdlib) must reproduce these exactly, or the
oracle itself is the bug (E2).

## The data (9 body rows; row 8 is fully blank)
| # | Satisfaction | Recommend | NPS |
|---|---|---|---|
| 1 | 5 | Yes | 10 |
| 2 | 4 | Yes | 9 |
| 3 | 3 | No | 6 |
| 4 | (blank) | No | 3 |
| 5 | 2 | No | 4 |
| 6 | 5 | YES | 10 |
| 7 | 1 | no | 0 |
| 8 | (blank) | (blank) | (blank) |
| 9 | 4 | Yes | 8 |

## Response count
- Body rows in file: **9**
- Non-empty responses (≥1 non-blank cell): **8** (row 8 excluded)
- **The classic bug:** counting 9 (a fully-blank trailing row inflates the count).

## Satisfaction (1–5) — numeric mean
- Non-blank values: [5, 4, 3, 2, 5, 1, 4] → n = **7**, sum = **24**
- **Correct mean = 24 / 7 = 3.4286 → 3.4 (1dp)**
- Bug variants to watch: ÷8 (non-blank rows) = 3.00 · ÷9 (all rows) = 2.67 · blanks-as-0 ÷8 = 3.00

## NPS (0–10) — Net Promoter Score
- Non-blank values: [10, 9, 6, 3, 4, 10, 0, 8] → n = **8**
- Promoters (9–10): {10, 9, 10} = 3 · Passives (7–8): {8} = 1 · Detractors (0–6): {6, 3, 4, 0} = 4
- **Correct NPS = (%prom − %detr) = (3/8 − 4/8) × 100 = −12.5**

## Recommend — categorical distribution (CASE-INSENSITIVE is correct)
- Case-insensitive: **Yes = 4** (rows 1,2,6,9), **No = 4** (rows 3,4,5,7), blank = 1
- **Recommend rate = Yes / (Yes+No) = 4/8 = 50.0%**
- **The classic bug:** case-SENSITIVE grouping splits into Yes=3 / YES=1 / No=3 / no=1 → wrong % and
  four "categories" where there are two.

## Mean satisfaction among "Recommend = Yes" (cross-tab, case-insensitive)
- Rows 1,2,6,9 → [5, 4, 5, 4] → mean = **4.5**

## Free-text ("Comments")
- Non-blank comments: 7 (rows 1,2,3,4,6,7,9). Rows 5 and 8 blank.
- A comma inside a quoted field (row 9) must NOT split into an extra column (CSV quoting correctness).
