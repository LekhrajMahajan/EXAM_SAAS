# CHUNK 4 of 8 — Add Frontend Form Sections for New Exam Fields

> Give this file to Antigravity alone, after Chunk 3 is done and verified. Do not attach other chunks. This chunk is frontend-only, and depends on the backend fields added in Chunk 3 already existing.

## Goal
Add new form sections to the Create/Edit Exam page so the admin can configure the fields added in Chunk 3: cutoff type, overall qualifying %, sectional cutoff toggle, category-wise cutoffs, rank type, tie-break rule order, and multi-stage settings.

## Files to Touch
- `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

## Changes

### 1. Update the Zod `formSchema` and `FormValues` type
Add these fields (all optional, matching the backend from Chunk 3):
```ts
cutoffType: z.enum(['MARKS', 'PERCENTAGE']).default('MARKS'),
overallQualifyingPercent: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),
sectionalCutoffEnabled: z.boolean().default(false),
categoryWiseCutoff: z.array(z.object({
  category: z.string().min(1),
  cutoffPercent: z.union([z.string(), z.number()]).transform((v) => Number(v)),
})).optional(),
rankType: z.enum(['COMBINED', 'CATEGORY_WISE']).default('COMBINED'),
tieBreakRules: z.array(z.object({
  order: z.number(),
  ruleType: z.enum([
    'HIGHER_MARKS', 'HIGHER_PERCENTAGE', 'MORE_CORRECT', 'LOWER_NEGATIVE',
    'OLDER_AGE', 'YOUNGER_AGE', 'APPLICATION_NUMBER',
  ]),
})).optional(),
isMultiStage: z.boolean().default(false),
stageType: z.enum(['QUALIFYING_ONLY', 'SCORE_CARRIED_FORWARD']).default('SCORE_CARRIED_FORWARD'),
stageWeightagePercent: z.union([z.string(), z.number()]).transform((v) => Number(v)).default(100),
linkedNextExamId: z.string().optional(),
resultDeclarationDate: z.string().optional(),
```
Mirror the same fields in the `FormValues` TypeScript type below the schema.

### 2. New Card — "Qualifying Criteria" (place after the existing "Marking Scheme" card)
- Dropdown: **Cutoff Type** — "Marks-based" / "Percentage-based" (`cutoffType`)
- Number input: **Overall Qualifying %** (`overallQualifyingPercent`) — only rendered/enabled when Cutoff Type = Percentage-based
- Toggle: **Enable Sectional Cutoff** (`sectionalCutoffEnabled`)
- If the toggle is on, show a "Sectional Cutoff" number input next to each subject row already present in the Exam Paper Subject section (reuse the `useFieldArray` subjects array from Chunk 2 — add the `sectionalCutoff` field to each row's inputs, only rendered when this toggle is on).

### 3. New Card — "Category-wise Cutoff"
- Use a `useFieldArray` for `categoryWiseCutoff`.
- Each row: Category dropdown (`General`, `OBC`, `SC`, `ST`, `EWS`, `PwD`) + Cutoff % number input.
- "+ Add Category" button to append a row, trash icon to remove a row (follow the same UI pattern already used for the Subjects field array in this same file — reuse `Plus` / `Trash2` icons already imported).

### 4. New Card — "Result & Rank Settings"
- Dropdown: **Rank Type** — "Combined Merit List" / "Category-wise Merit List" (`rankType`)
- **Tie-Breaking Rules** — a simple ordered list UI (does not need drag-and-drop; a numbered list with up/down arrow buttons per row is sufficient) backed by `tieBreakRules` field array. Pre-fill with this default order when creating a new exam:
  1. `HIGHER_MARKS`
  2. `HIGHER_PERCENTAGE`
  3. `MORE_CORRECT`
  4. `LOWER_NEGATIVE`
  Let the admin optionally append `OLDER_AGE`, `YOUNGER_AGE`, or `APPLICATION_NUMBER` as further tie-break levels via a dropdown + "Add Rule" button.
- Date picker: **Result Declaration Date** (`resultDeclarationDate`)

### 5. New Card — "Multi-Stage Configuration"
- Toggle: **Is this exam part of a multi-stage process?** (`isMultiStage`)
- If on, show:
  - Dropdown: **Stage Type** — "Qualifying Only" / "Score Carried Forward" (`stageType`)
  - Number input: **Stage Weightage %** (`stageWeightagePercent`)
  - Dropdown: **Linked Next Exam** (`linkedNextExamId`) — populate options by calling the existing `examApi.getAll()` (already used elsewhere in this file) and listing `examTitle (examCode)` for each, excluding the exam currently being edited.

### 6. Wire up existing fetch/submit logic
- In the `useEffect` that loads exam data for editing (where `totalMarks`, `passingMarks` etc. are already being populated from `data.*`), add population for all new fields the same way (e.g. `cutoffType: data.cutoffType || 'MARKS'`, etc.).
- In the submit handler where the payload object is built (where `totalMarks: Number(values.totalMarks)` etc. already appears), add all new fields to the payload the same way.

## Acceptance Criteria (Definition of Done)
- All five new cards render correctly on both the Create Exam and Edit Exam flows (this page handles both via the existing `id` param check already in the file).
- Values persist correctly on save and reload (edit an exam, refresh, confirm the new fields still show the saved values).
- Sectional cutoff inputs only appear when the toggle is on; percentage input only appears when Cutoff Type is Percentage-based; multi-stage fields only appear when the multi-stage toggle is on.
- No existing field, section, or behavior on this page is broken or removed.
