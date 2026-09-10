# CHUNK 11 of 14 — Part-wise (Grouped Subject) Cutoff: Create Exam Configuration

> Give this file to Antigravity alone, after Chunk 10 is done and verified. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**PRE-DECIDED.** This chunk only lets the admin define, while creating/editing an exam, how subjects are grouped into "Parts" and what combined cutoff each Part requires. It does NOT calculate anything about any candidate — that happens in Chunk 12, after a candidate's exam is evaluated.

## Goal
This is different from the existing per-subject "Sectional Cutoff" (built in earlier chunks), which checks each subject individually. This new feature lets the admin group **two or more subjects together into a named Part** (e.g., "Part A" = Reasoning + Quantitative Aptitude, "Part B" = English + General Awareness), and set **one combined cutoff for each Part**. A candidate must clear every Part's combined cutoff to remain eligible for the merit list, regardless of their overall total.

## Files to Touch
- `backend/src/modules/exam/exam.model.ts`
- `backend/src/modules/exam/exam.types.ts`
- `backend/src/modules/exam/exam.validation.ts`
- `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

## Backend Changes

### `exam.model.ts` — add a new top-level field
```ts
partWiseCutoffEnabled: {
  type: Boolean,
  default: false,
},

parts: [
  {
    partName: { type: String, required: true },       // e.g. "Part A"
    subjectIds: [{ type: Schema.Types.ObjectId, ref: "Subject" }],
    cutoffType: { type: String, enum: ["MARKS", "PERCENTAGE"], default: "MARKS" },
    cutoffValue: { type: Number, required: true },
  },
],
```

### `exam.types.ts` — add matching fields to `IExam`
```ts
partWiseCutoffEnabled?: boolean;

parts?: {
  partName: string;
  subjectIds: string[];
  cutoffType: "MARKS" | "PERCENTAGE";
  cutoffValue: number;
}[];
```

### `exam.validation.ts`
- `partWiseCutoffEnabled`: optional boolean.
- `parts`: optional array; when `partWiseCutoffEnabled` is true, require at least one part, each part must have `subjectIds.length >= 1` (allow a "part" of just one subject too, though typically 2+), `partName` non-empty, and `cutoffValue >= 0`.
- Add a **superRefine** check: no subject (by `subjectId`) should appear in more than one Part for the same exam — reject with a clear error naming the duplicate subject if it does.

## Frontend Changes (`CreateExamPage.tsx`)

Add a new card, **"Part-wise (Group) Cutoff"**, placed after the existing "Category-wise Cutoff" card:

1. Toggle: **"Enable Part-wise Cutoff"** (`partWiseCutoffEnabled`) with helper text: *"Group subjects into parts. Candidates must clear the combined cutoff for every part to qualify."*

2. When enabled, show a repeatable list of Parts (`useFieldArray` on `parts`), each row/block containing:
   - Text input: **Part Name** (e.g. "Part A")
   - Multi-select checkboxes or a multi-select dropdown listing the exam's current subjects (pull from the same `subjects` field array already in this form) — admin ticks which subjects belong to this Part.
   - Dropdown: **Cutoff Type** — Marks / Percentage
   - Number input: **Cutoff Value**
   - "Remove Part" button
   "+ Add Part" button to append a new empty Part block.

3. Live validation feedback in the UI (mirroring the backend rule): if the same subject is ticked in two different Parts, show an inline warning like *"Reasoning is already assigned to Part A"* and prevent ticking it in a second Part.

4. Optional but recommended: show a small live summary line — *"3 of 4 subjects assigned to a Part"* — so the admin can see at a glance if any subject was left out (leaving a subject out of every Part is allowed; it simply won't be covered by Part-wise cutoff logic, only by its own individual sectional cutoff if that's separately enabled).

5. Include `partWiseCutoffEnabled` and `parts` in the save payload.

## Acceptance Criteria (Definition of Done)
- Toggle OFF (default): no change to existing form behavior.
- Toggle ON: admin can create multiple named Parts, assign subjects to each, and set a cutoff per Part.
- The same subject cannot be assigned to two different Parts — enforced both in the UI (immediate) and on the backend (on save, as a safety net).
- Saved Parts configuration correctly reloads when editing an existing exam.
- No result or merit calculation logic is touched in this chunk — that is Chunk 12.
