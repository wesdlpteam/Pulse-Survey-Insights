# Expected column classification - answer key

This is the differential oracle for the two identifier-detection fixtures. The app must
**EXCLUDE** identifier / personal-info columns from analysis and **KEEP** genuine response
columns. Fabricated data only - no real people; all emails use the `example.com` domain.

| Column | Fixture | EXCLUDE or KEEP | Reason |
|---|---|---|---|
| Id | pii-survey.csv | EXCLUDE | Row identifier (unique sequential ints), not a survey response |
| Timestamp | pii-survey.csv | EXCLUDE | Submission date metadata, not a response to analyse |
| Email | pii-survey.csv | EXCLUDE | Personal contact info (PII), not a response |
| Year Level | pii-survey.csv | KEEP | Categorical response (Year 7-12), valid for breakdowns |
| Overall Satisfaction | pii-survey.csv | KEEP | Numeric rating 1-5, a core measure to analyse |
| Would Recommend | pii-survey.csv | KEEP | Categorical Yes/No response, valid for breakdowns |
| Comments | pii-survey.csv | KEEP | Free-text response, valid for sentiment/themes |
| Age | edge-columns.csv | KEEP | Legit numeric measure (11-18, has repeats) - NOT an identifier |
| Score /100 | edge-columns.csv | KEEP | Legit numeric measure (40-100, has repeats) - NOT an identifier |
| Campus | edge-columns.csv | KEEP | Categorical response (North/South/East), valid for breakdowns |
| Student ID | edge-columns.csv | EXCLUDE | Identifier (unique text codes S00123...), not a response |
| Email Address | edge-columns.csv | EXCLUDE | Personal contact info (PII), not a response |
| Q1 Rating | edge-columns.csv | KEEP | Numeric rating 1-5, a valid measure - NOT an identifier |
| Feedback | edge-columns.csv | KEEP | Free-text response, valid for sentiment/themes |

## False-positive caveat (why `edge-columns.csv` exists)

`Age`, `Score /100` and `Q1 Rating` are genuine numeric measures that MUST be analysed. A
naive "all-unique numbers => identifier" heuristic would over-trigger and wrongly drop them.
They are deliberately built with **repeated values** (e.g. Age 14 and 15 both appear; Score
72, 64 and 88 each repeat) so a correct detector keeps them. The true identifiers here are
`Student ID` (unique text codes) and `Email Address` (PII) - those, plus `Id`, `Timestamp`
and `Email` in `pii-survey.csv`, are the only columns that should be excluded.
