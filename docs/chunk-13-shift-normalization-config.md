# CHUNK 13 of 14 — Shift & Normalization: Create Exam Configuration

> Give this file to Antigravity alone, after Chunk 12 is done and verified. Do not attach other chunks.

## ⏱ WHEN THIS RUNS
**PRE-DECIDED — but only the *choice*, not the *calculation*.** This chunk lets the admin declare, while creating the exam, that it will run in multiple shifts and that normalization should apply, plus which method to use. It stores that decision only. **No actual normalized score is computed in this chunk.** The real computation genuinely cannot happen yet — it needs every shift's every candidate's result to exist first, which is only true after the full exam window closes. That calculation is Chunk 14, and runs at Merit List generation time, not here.

## Goal
Add exam-level fields so the admin can mark an exam as multi-shift and choose whether/how to normalize scores across shifts, without yet performing any calculation.

## Files to Touch
- `backend/src/modules/exam/exam.model.ts`
- `backend/src/modules/exam/exam.types.ts`
- `backend/src/modules/exam/exam.validation.ts`
- `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

## Backend Changes

### `exam.model.ts` — add new top-level fields
```ts
hasMultipleShifts: {
  type: Boolean,
  default: false,
},

normalizationEnabled: {
  type: Boolean,
  default: false,
},

normalizationMethod: {
  type: String,
  enum: ["PERCENTILE", "MEAN_EQUATING"],
  default: "PERCENTILE",
},
```

Also confirm whether a `shiftId` or `shift` field already exists somewhere reachable from a candidate's exam attempt (the earlier screenshots showed a "Shift" dropdown — Morning/Afternoon/Evening — already present in the Schedule & Timing section of this same form). If that existing `shift` field is a simple string on the `Exam` document itself (one shift per exam document) rather than something that varies per candidate, this means **"multiple shifts" in this system is modeled as multiple separate Exam documents that share the same exam group/name but different shift values** — confirm this by checking how exams with different shifts are currently created (e.g., is there a concept of an "exam group" or "parent exam" tying multiple shift-exams together?). If no such grouping concept exists yet, add one:
```ts
examGroupId: {
  type: String,
  default: null,
  index: true,
},
```
This `examGroupId` should be the same shared value across all shift-variants of what is conceptually "one exam" (e.g., all shifts of "SSC CGL Tier 1 Day 1" share one `examGroupId`, generated once and reused when the admin creates each shift's exam entry). Only add this new field if no equivalent grouping mechanism is found — check first before adding a duplicate concept.

### `exam.types.ts` and `exam.validation.ts`
Add matching fields for all of the above, following the same style already used in this file. `normalizationMethod` should only be meaningfully required when `normalizationEnabled` is true; no hard validation error needed if the default value is always present.

## Frontend Changes (`CreateExamPage.tsx`)

Add a new card, **"Shift & Normalization"**, placed near the existing "Schedule & Timing" card (which already has the Shift dropdown):

1. Toggle: **"This exam has multiple shifts"** (`hasMultipleShifts`).
2. If the `examGroupId` concept was added above: when this toggle is turned on for a *new* exam, show a field **"Exam Group"** — either let the admin type a new group name/ID, or (better) let them search/select an *existing* exam's group if they're adding another shift to an exam that was already created (e.g., "Link to Shift 1 of this exam" dropdown, searching other exams with a similar title/department). Use judgement based on what's cleanest given the actual existing "Shift" field's current implementation — the goal is simply that all shift-variants of the same conceptual exam must be identifiable as belonging together, however that's best expressed in this codebase's existing patterns.
3. Toggle: **"Enable Score Normalization"** (`normalizationEnabled`) — only show/enable this toggle when "This exam has multiple shifts" is on. Helper text: *"Adjusts scores for difficulty differences between shifts. Actual normalized scores are calculated only after results for all shifts are generated — this cannot be computed at exam creation time."*
4. Dropdown: **Normalization Method** — "Percentile-based" / "Mean-Equating" (`normalizationMethod`) — only shown when normalization is enabled.
5. Include all new fields in the save payload.

## Acceptance Criteria (Definition of Done)
- Toggles OFF (default): no change to existing form/exam behavior.
- Admin can mark an exam as multi-shift and choose a normalization method; these are saved and reloaded correctly on edit.
- No score calculation, result generation, or merit list logic is touched in this chunk.
- If an `examGroupId`-equivalent concept already exists elsewhere in this codebase, that existing mechanism is reused instead of creating a duplicate one — confirm this before adding new fields.
