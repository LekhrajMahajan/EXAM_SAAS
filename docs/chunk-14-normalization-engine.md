# CHUNK 14 of 14 — Normalization Calculation Engine (Post-Result, Runs Once)

> Give this file to Antigravity alone, after Chunk 13 is done and verified. Do not attach other chunks. This is the final chunk.

## ⏱ WHEN THIS RUNS
**POST-RESULT, ACROSS ALL SHIFTS TOGETHER — at Merit List generation time, not at individual Result generation time.** This is the key difference from every other cutoff/rule in this project: normalization cannot be computed per-candidate as their result comes in, because it requires comparing that candidate's score against the *entire score distribution of their own shift*, and every other shift, at once. It only makes sense to run this **after all shifts' results already exist**, right before ranking the merit list (which is the existing `generate()` step in `meritList.service.ts`, extended here from Chunk 6's `bulkCreateFromResults`).

## Goal
When `exam.normalizationEnabled` is true, compute a `normalizedMarks` value for every candidate across all shifts of the same exam group, then rank the merit list using `normalizedMarks` instead of raw `marksObtained`.

## Files to Touch
- `backend/src/modules/merit-list/meritList.model.ts`
- `backend/src/modules/merit-list/meritList.types.ts`
- `backend/src/modules/merit-list/meritList.service.ts`

## Changes

### 1. `meritList.model.ts` — add new fields
```ts
normalizedMarks: {
  type: Number,
  default: null,
},

normalizationApplied: {
  type: Boolean,
  default: false,
},
```

### 2. `meritList.types.ts` — add matching fields to `IMeritList`
```ts
normalizedMarks?: number | null;
normalizationApplied?: boolean;
```

### 3. `meritList.service.ts` — add a normalization step

Add a new private method:
```ts
private async applyNormalization(examId: string) {
  const Exam = mongoose.models.Exam;
  const Result = mongoose.models.Result;

  const exam = await Exam.findById(examId);
  if (!exam?.normalizationEnabled || !exam?.hasMultipleShifts) {
    return; // nothing to do
  }

  // Find every exam document sharing the same group (all shifts of this exam)
  const groupKey = exam.examGroupId; // or whatever field Chunk 13 confirmed/added
  if (!groupKey) return;

  const shiftExams = await Exam.find({ examGroupId: groupKey });
  const shiftExamIds = shiftExams.map((e: any) => e._id);

  const allResults = await Result.find({ examId: { $in: shiftExamIds } });

  // Group results by shift (using each result's own examId, since each shift is a separate Exam doc)
  const byShift = new Map<string, any[]>();
  for (const r of allResults) {
    const key = String(r.examId);
    if (!byShift.has(key)) byShift.set(key, []);
    byShift.get(key)!.push(r);
  }

  for (const [, shiftResults] of byShift) {
    const scores = shiftResults.map((r) => r.marksObtained);
    const minScore = Math.min(...scores);
    const maxScore = Math.max(...scores);

    for (const r of shiftResults) {
      let normalized = r.marksObtained;

      if (exam.normalizationMethod === "PERCENTILE" && maxScore !== minScore) {
        normalized = ((r.marksObtained - minScore) / (maxScore - minScore)) * 100;
      }
      // MEAN_EQUATING: implement as a documented TODO if the exact formula isn't
      // confirmed with the admin yet — do not guess a formula for this method silently.
      // Leave normalized = r.marksObtained (no change) for MEAN_EQUATING until confirmed,
      // and log a clear warning when this method is selected but not yet implemented.

      await meritListRepository.updateMany(
        { resultId: r._id },
        { normalizedMarks: normalized, normalizationApplied: true }
      );
    }
  }
}
```

Note: check `meritListRepository` for an `updateMany` method matching this signature; if it doesn't exist, add one following the same pattern as other repository methods already in that file.

### 4. Wire this into the existing merit generation flow
In `bulkCreateFromResults` (built in Chunk 6), call `await this.applyNormalization(examId);` **after** all `MeritList` records have been created for this exam, but **before** calling the existing `this.generate(examId)` ranking step.

### 5. Update the ranking/sort logic in the existing `generate()` method
Find the existing sort comparator in `generate()` (the one already using marks → percentage → correct answers → negative marks → tie-breaker, built before this project's chunked work began). At the top of the comparator, add:
```ts
if (exam.normalizationEnabled) {
  const aScore = a.normalizedMarks ?? a.marksObtained;
  const bScore = b.normalizedMarks ?? b.marksObtained;
  if (bScore !== aScore) return bScore - aScore;
  // fall through to existing tie-break chain below if normalized scores are equal
}
```
This must be a fallback in front of the existing chain, not a replacement of it — if normalization is disabled, or two candidates have identical normalized scores, the existing tie-break logic must still run exactly as before.

## Acceptance Criteria (Definition of Done)
- Exams with `normalizationEnabled = false` (default, or any exam from before this chunk) rank exactly as before — `normalizedMarks` stays `null` and has zero effect.
- Exams with normalization enabled and `PERCENTILE` method correctly compute each candidate's normalized score relative to their own shift's min/max, and the merit list ranks by this normalized score.
- `MEAN_EQUATING` is left as an explicit, clearly-logged not-yet-implemented path rather than a silently wrong calculation — do not invent a formula for it without confirming.
- Running `bulkCreateFromResults` a second time on the same exam does not duplicate or corrupt normalization values — re-running recalculates cleanly.
- No change to any exam where `hasMultipleShifts` or `normalizationEnabled` is false.
