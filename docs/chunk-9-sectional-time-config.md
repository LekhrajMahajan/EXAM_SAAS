# CHUNK 9 of 14 — Subject-wise Time Limit: Create Exam Configuration

> Give this file to Antigravity alone, after Chunks 1–8 are done and verified. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**PRE-DECIDED.** This chunk only lets the admin *configure* per-subject time limits while creating/editing an exam. It does NOT make the candidate's live exam screen actually enforce the timer — that is Chunk 10. This chunk is config-only, no live behavior changes yet.

## Goal
Add the ability to assign each subject its own time allotment (in minutes), and a toggle to enable/disable this "strict sectional timing" mode for the exam. When disabled (default), the exam behaves exactly as it does today — one overall timer, free navigation between subjects.

## Files to Touch
- `backend/src/modules/exam/exam.model.ts`
- `backend/src/modules/exam/exam.types.ts`
- `backend/src/modules/exam/exam.validation.ts`
- `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

## Backend Changes

### `exam.model.ts`
Add a new top-level field:
```ts
sectionalTimeLimitEnabled: {
  type: Boolean,
  default: false,
},
```
Update the `subjects` sub-schema (already extended in Chunk 2 with `marksPerQuestion`, `negativeMarksPerQuestion`, `sectionalCutoff`) to add:
```ts
timeAllottedMinutes: {
  type: Number,
  default: null,
},
```

### `exam.types.ts`
Add `sectionalTimeLimitEnabled?: boolean;` to `IExam`, and `timeAllottedMinutes?: number | null;` to the subjects array item type.

### `exam.validation.ts`
- Add `sectionalTimeLimitEnabled: z.boolean().optional().default(false)`.
- Add `timeAllottedMinutes` as an optional positive number on the subject schema.
- Add a **refine/superRefine rule**: if `sectionalTimeLimitEnabled` is true, every subject in the `subjects` array must have a `timeAllottedMinutes` value greater than 0, and the sum of all subjects' `timeAllottedMinutes` must equal the exam's overall `duration` field (do not silently allow mismatch — reject the save with a clear error message like `"Sum of subject time allocations (X min) does not match exam duration (Y min)"`).

## Frontend Changes (`CreateExamPage.tsx`)

1. Add `sectionalTimeLimitEnabled` and `timeAllottedMinutes` (per subject) to the Zod schema and `FormValues` type, mirroring the backend validation rule above using `.superRefine()` on the form schema too, so the error shows inline before the API call.

2. In the **"Shuffle Options"** card (or add a new card right after it, whichever fits the existing layout better), add a toggle: **"Enable Sectional Time Limit"** with helper text: *"Each subject gets its own timer. Once a subject's time is up, candidates automatically move to the next subject and cannot return."*

3. In the Exam Paper Subject table (the `useFieldArray` rows), when the toggle above is ON, show one more input per row: **"Time (min)"** (`timeAllottedMinutes`).

4. Add a live-computed helper text under the subject table (same pattern as the Total Marks auto-calc from Chunk 2): **"Total Allocated Time: {sum} / {exam duration} min"** — color it red if mismatched, green if matched, so the admin gets instant feedback before hitting save.

5. Include both new fields in the payload sent on save, same as other fields in this form.

## Acceptance Criteria (Definition of Done)
- Toggle OFF (default): form behaves exactly as before this chunk — no new required fields, saves fine.
- Toggle ON: each subject row requires a time value; save is blocked with a clear inline error if the sum doesn't match exam duration.
- Saved values are correctly reloaded when editing an existing exam.
- No live exam-taking behavior is changed in this chunk — that is out of scope here.
