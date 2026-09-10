# CHUNK 12 of 14 — Part-wise Cutoff: Applied During Result Generation

> Give this file to Antigravity alone, after Chunk 11 is done and verified. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**POST-EXAM, PER CANDIDATE — at "Generate Results" time.** This runs right after an individual candidate's answers are evaluated (same step as the existing subject-wise breakdown and sectional cutoff logic from Chunk 5). It does **not** need to wait for other candidates, other shifts, or the whole exam window to close — only that specific candidate's own answers. This is different from normalization (Chunk 14), which genuinely cannot run until all shifts are complete.

## Goal
Extend the result-generation logic (already producing `subjectWiseBreakdown` per candidate since Chunk 5) to also compute totals per Part (as configured in Chunk 11), compare each against its cutoff, and fail the candidate overall if any Part is not cleared — even if their overall total and every individual subject's sectional cutoff are otherwise fine.

## Files to Touch
- `backend/src/modules/result/result.model.ts`
- `backend/src/modules/result/result.types.ts`
- `backend/src/modules/result/result.service.ts`

## Changes

### 1. `result.model.ts` — add new field
```ts
partWiseBreakdown: [
  {
    partName: { type: String },
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    marksObtained: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },
    cutoffType: { type: String, enum: ["MARKS", "PERCENTAGE"] },
    cutoffValue: { type: Number },
    partStatus: {
      type: String,
      enum: ["QUALIFIED", "NOT_QUALIFIED", "NOT_APPLICABLE"],
      default: "NOT_APPLICABLE",
    },
  },
],
```

### 2. `result.types.ts` — add matching field to `IResult`
```ts
partWiseBreakdown?: {
  partName: string;
  subjectIds: Types.ObjectId[];
  marksObtained: number;
  maxMarks: number;
  cutoffType: "MARKS" | "PERCENTAGE";
  cutoffValue: number;
  partStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE";
}[];
```

### 3. `result.service.ts` — extend `generateResults()`
This function already builds `subjectWiseBreakdown` (from Chunk 5) before calling `Result.create(...)`. Add this step right after `subjectWiseBreakdown` is finalized, using the same `exam` document already loaded in this function (which now has `exam.parts` from Chunk 11):

```ts
let partWiseBreakdown: any[] = [];
let failedAnyPart = false;

if (exam.partWiseCutoffEnabled && Array.isArray(exam.parts) && exam.parts.length > 0) {
  partWiseBreakdown = exam.parts.map((part: any) => {
    const relevantSubjectEntries = subjectWiseBreakdown.filter((s) =>
      part.subjectIds.some((id: any) => String(id) === String(s.subjectId))
    );

    const marksObtained = relevantSubjectEntries.reduce((sum, s) => sum + s.marksObtained, 0);
    const maxMarks = relevantSubjectEntries.reduce((sum, s) => sum + s.maxMarks, 0);

    const comparisonValue =
      part.cutoffType === "PERCENTAGE" && maxMarks > 0
        ? (marksObtained / maxMarks) * 100
        : marksObtained;

    const partStatus = comparisonValue >= part.cutoffValue ? "QUALIFIED" : "NOT_QUALIFIED";
    if (partStatus === "NOT_QUALIFIED") failedAnyPart = true;

    return {
      partName: part.partName,
      subjectIds: part.subjectIds,
      marksObtained,
      maxMarks,
      cutoffType: part.cutoffType,
      cutoffValue: part.cutoffValue,
      partStatus,
    };
  });
}
```

### 4. Update the final `resultStatus` calculation
This function already combines the overall-cutoff check with the sectional-cutoff check from Chunk 5 (`overallPass && !failedSectionalCutoff`). Extend it to also require Part-wise clearance:
```ts
const resultStatus =
  overallPass && !failedSectionalCutoff && !failedAnyPart
    ? PassStatus.PASSED
    : PassStatus.FAILED;
```

### 5. Include the new field in `Result.create({...})`
Add `partWiseBreakdown` alongside the other fields already being saved (`subjectWiseBreakdown`, `category`, `gender`, etc. from Chunk 5).

### 6. Apply the same change to both evaluation loops
As with Chunk 5, this codebase has two separate blocks handling "Standard Submissions" and "CandidateExamAnswer Submissions" fallback — mirror this exact change in both.

## Acceptance Criteria (Definition of Done)
- With `exam.partWiseCutoffEnabled = false` (default, or any exam created before this chunk), behavior is unchanged — `partWiseBreakdown` is empty and has no effect on pass/fail.
- With Parts configured (from Chunk 11) and a candidate who clears their overall cutoff and every individual sectional cutoff but fails one Part's combined cutoff, the candidate's final `resultStatus` is correctly `FAILED`.
- `Result.partWiseBreakdown` correctly shows marks obtained vs cutoff for each configured Part.
- No other part of `generateResults()` is altered beyond what's specified here.
