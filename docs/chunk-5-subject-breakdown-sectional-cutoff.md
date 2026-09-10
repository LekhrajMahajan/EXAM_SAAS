# CHUNK 5 of 8 — Subject-Wise Breakdown + Sectional Cutoff in Result Generation

> Give this file to Antigravity alone, after Chunks 1–4 are done and verified. Do not attach other chunks.

## Goal
Currently `generateResults()` computes only an overall score. This chunk adds a **subject-wise breakdown** stored on each `Result` document, applies the **sectional cutoff rule** (candidate fails overall if any subject falls below its own cutoff, even if overall score passes), and copies `category`/`gender` from the candidate onto the `Result` for easy downstream use by the merit list.

## Files to Touch
- `backend/src/modules/result/result.model.ts`
- `backend/src/modules/result/result.types.ts`
- `backend/src/modules/result/result.service.ts`

## Changes

### 1. `result.model.ts` — add new fields to `resultSchema`
Add after the existing `percentage` field:
```ts
subjectWiseBreakdown: [
  {
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    subjectName: { type: String },
    questionsAttempted: { type: Number, default: 0 },
    correctAnswers: { type: Number, default: 0 },
    wrongAnswers: { type: Number, default: 0 },
    marksObtained: { type: Number, default: 0 },
    maxMarks: { type: Number, default: 0 },
    sectionalCutoff: { type: Number, default: null },
    sectionalStatus: {
      type: String,
      enum: ["QUALIFIED", "NOT_QUALIFIED", "NOT_APPLICABLE"],
      default: "NOT_APPLICABLE",
    },
  },
],

category: {
  type: String,
  default: null,
},

gender: {
  type: String,
  default: null,
},

sectionalCutoffApplied: {
  type: Boolean,
  default: false,
},
```

### 2. `result.types.ts` — add matching fields to `IResult`
```ts
subjectWiseBreakdown?: {
  subjectId: Types.ObjectId;
  subjectName: string;
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  marksObtained: number;
  maxMarks: number;
  sectionalCutoff?: number | null;
  sectionalStatus: "QUALIFIED" | "NOT_QUALIFIED" | "NOT_APPLICABLE";
}[];

category?: string | null;

gender?: string | null;

sectionalCutoffApplied?: boolean;
```

### 3. `result.service.ts` — update `generateResults()`

This function currently loops through `answers` for each candidate and accumulates `correct`, `wrong`, `obtainedMarks`, `negativeMarks` as single totals. Modify it to **also accumulate per-subject** using a `Map<subjectId, {...}>` alongside the existing totals (do not remove the existing totals — subject breakdown is additional, not a replacement).

Pseudocode for the additions inside the existing answer-evaluation loop (both occurrences of this loop in the file — the "Standard Submissions" block and the "CandidateExamAnswer Submissions" fallback block):

```ts
const subjectMap = new Map<string, {
  subjectId: any;
  subjectName: string;
  questionsAttempted: number;
  correctAnswers: number;
  wrongAnswers: number;
  marksObtained: number;
  maxMarks: number;
}>();

// inside the existing per-answer loop, after `question` is fetched and `isCorrect` determined:
const subjKey = String(question.subjectId);
if (!subjectMap.has(subjKey)) {
  const subjectDoc = await Subject.findById(question.subjectId); // reuse existing Subject import in this file if present, else import it
  subjectMap.set(subjKey, {
    subjectId: question.subjectId,
    subjectName: subjectDoc?.subjectName || "Unknown",
    questionsAttempted: 0,
    correctAnswers: 0,
    wrongAnswers: 0,
    marksObtained: 0,
    maxMarks: 0,
  });
}
const subjEntry = subjectMap.get(subjKey)!;
subjEntry.questionsAttempted += 1;
subjEntry.maxMarks += marksForQuestion;
if (isCorrect) {
  subjEntry.correctAnswers += 1;
  subjEntry.marksObtained += marksForQuestion;
} else {
  subjEntry.wrongAnswers += 1;
  subjEntry.marksObtained -= penaltyForQuestion;
}
```

After the loop, before calling `Result.create(...)`, build the final breakdown array and apply sectional cutoff using the exam's `subjects` config (from Chunk 2, each subject now carries `sectionalCutoff`):

```ts
const examSubjectCutoffs = new Map(
  (exam.subjects || []).map((s: any) => [String(s.subjectId), s.sectionalCutoff])
);

const subjectWiseBreakdown = Array.from(subjectMap.values()).map((s) => {
  const cutoff = examSubjectCutoffs.get(String(s.subjectId)) ?? null;
  const sectionalStatus =
    !exam.sectionalCutoffEnabled || cutoff === null
      ? "NOT_APPLICABLE"
      : s.marksObtained >= cutoff
      ? "QUALIFIED"
      : "NOT_QUALIFIED";
  return { ...s, sectionalCutoff: cutoff, sectionalStatus };
});

const failedSectionalCutoff = subjectWiseBreakdown.some(
  (s) => s.sectionalStatus === "NOT_QUALIFIED"
);
```

Then, when setting `resultStatus` (already fixed in Chunk 1 to compare correctly), add the sectional override:
```ts
const overallPass = percentage >= passingPercentage;
const resultStatus = (overallPass && !failedSectionalCutoff) ? PassStatus.PASSED : PassStatus.FAILED;
```

Finally, fetch the candidate's `category` and `gender` (the candidate document is already reachable via `submission.candidateId` / `ca.candidateId` in this function) and include all new fields in the `Result.create({...})` call:
```ts
subjectWiseBreakdown,
category: candidate?.category || null,
gender: candidate?.gender || null,
sectionalCutoffApplied: !!exam.sectionalCutoffEnabled,
```

Apply this same pattern to **both** loops in the file (the "Standard Submissions" block and the "CandidateExamAnswer Submissions" fallback block) — they currently duplicate similar logic, so mirror the change in both places exactly.

## Acceptance Criteria (Definition of Done)
- After running Generate Results on an exam with `sectionalCutoffEnabled = true` and per-subject cutoffs set, a candidate who clears overall percentage but fails one subject's cutoff is correctly marked `FAILED`.
- Each `Result` document now contains a populated `subjectWiseBreakdown` array with correct per-subject marks.
- `category` and `gender` are correctly populated on each `Result` document from the candidate record.
- Exams with `sectionalCutoffEnabled = false` behave exactly as before (all `sectionalStatus` = `NOT_APPLICABLE`, no change to pass/fail outcome from sectional logic).
- No other function in `result.service.ts` is modified.
