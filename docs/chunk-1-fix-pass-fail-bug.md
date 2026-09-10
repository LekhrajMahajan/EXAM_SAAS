# CHUNK 1 of 8 — Fix Pass/Fail Calculation Bug

> Give this file to Antigravity alone. Do not attach other chunks. This is a small, isolated bug fix — do not touch any file outside the ones listed below.

## Goal
Fix an incorrect comparison in the result-generation logic where a **percentage (0–100 scale)** is being compared against **`passingMarks`, which is a raw marks value**, not a percentage. This produces wrong pass/fail status on every generated result.

## Files to Touch
- `backend/src/modules/result/result.service.ts`

## Exact Problem (two occurrences in the same file)
Search for this pattern (it appears twice, inside `generateResults()`):
```ts
const resultStatus = percentage >= (paper.passingMarks || 35) ? PassStatus.PASSED : PassStatus.FAILED;
```
`percentage` is always 0–100. `paper.passingMarks` is a raw marks number (e.g. "35 marks out of 200 total"). Comparing them directly is wrong — a candidate could score 35 raw marks out of 200 (17.5%) and this code would treat it as if they passed a "35%" cutoff, which is incorrect.

## Required Fix
Replace both occurrences with a correct comparison that uses the same basis (raw marks vs raw marks, not marks vs percentage):

```ts
const passingPercentage = totalMarks > 0 ? ((paper.passingMarks || 0) / totalMarks) * 100 : 0;
const resultStatus = percentage >= passingPercentage ? PassStatus.PASSED : PassStatus.FAILED;
```

This converts `passingMarks` into the equivalent percentage using the same `totalMarks` already computed just above each occurrence in the function, then compares percentage-to-percentage correctly.

## Acceptance Criteria (Definition of Done)
- Both occurrences of the buggy comparison are fixed the same way.
- No other logic in `generateResults()` is changed.
- No other file is touched.
- Manually verify: a candidate scoring exactly at `passingMarks` raw marks should get `PASSED`; one mark below should get `FAILED`.
