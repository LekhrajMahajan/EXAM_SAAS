# CHUNK 2 of 8 — Fix Exam Subjects Schema + Auto-Calculate Total Marks

> Give this file to Antigravity alone, after Chunk 1 is done and verified. Do not attach other chunks.

## Goal
Currently the exam's `subjects` array only stores `{ name, questions }`. There is no way to give different subjects different marks-per-question, and the exam-level `Total Marks` field is manually typed by the admin, which causes it to mismatch the real sum of questions × marks (already observed as a real bug: 50 questions shown as "Total Marks: 50" when it should be 25 based on 0.5 marks/question).

## Files to Touch
- `backend/src/modules/exam/exam.model.ts`
- `backend/src/modules/exam/exam.types.ts`
- `backend/src/modules/exam/exam.validation.ts`
- `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

## Backend Changes

### `exam.model.ts` — update the `subjects` sub-schema
Find:
```ts
subjects: [
  {
    name: { type: String, required: true },
    questions: { type: Number, required: true },
  },
],
```
Replace with:
```ts
subjects: [
  {
    name: { type: String, required: true },
    subjectId: { type: Schema.Types.ObjectId, ref: "Subject" },
    questions: { type: Number, required: true },
    marksPerQuestion: { type: Number, required: true, default: 1 },
    negativeMarksPerQuestion: { type: Number, default: 0 },
    sectionalCutoff: { type: Number, default: null },
  },
],
```

### `exam.types.ts` — update the matching interface field
Find:
```ts
subjects?: { name: string; questions: number }[];
```
Replace with:
```ts
subjects?: {
  name: string;
  subjectId?: string;
  questions: number;
  marksPerQuestion: number;
  negativeMarksPerQuestion?: number;
  sectionalCutoff?: number | null;
}[];
```

### `exam.validation.ts` — update the Zod/validation schema for subjects
Wherever the subjects array schema is defined, add validation for the two new numeric fields (`marksPerQuestion` required and `>= 0`, `negativeMarksPerQuestion` optional and `>= 0`), following the same pattern already used for `questions` in that file.

## Frontend Changes (`CreateExamPage.tsx`)

1. In the Zod `formSchema`, update the `subjects` array schema to include the two new fields:
```ts
subjects: z
  .array(
    z.object({
      name: z.string().min(1, 'Subject name required'),
      questions: z.union([z.string(), z.number()]).transform((v) => Number(v)),
      marksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)),
      negativeMarksPerQuestion: z.union([z.string(), z.number()]).transform((v) => Number(v)).optional(),
    }),
  )
  .min(1, 'At least one subject is required'),
```
Update the matching `FormValues` type the same way.

2. In the subject rows UI (rendered via `useFieldArray`), add two new `<Input type="number">` fields next to the existing "questions" input: **"Marks/Question"** and **"Negative Marks/Question"**.

3. Change the `totalMarks` field from an editable `<Input>` to a **read-only, auto-computed display**. Compute it live from the subjects field array:
```ts
const totalMarks = fields.reduce(
  (sum, subj) => sum + (Number(subj.questions) || 0) * (Number(subj.marksPerQuestion) || 0),
  0
);
```
Display this value in a disabled input or plain text, and submit this computed value as `totalMarks` in the form payload instead of a manually-typed one. Remove `totalMarks` from the manually-editable form fields; keep it in the submitted payload as a derived value.

## Acceptance Criteria (Definition of Done)
- Adding/editing a subject row lets the admin set marks-per-question and negative-marks-per-question.
- Total Marks on screen updates live and automatically as subjects/questions/marks-per-question change, with no manual input possible.
- Saving an exam with 2 subjects × 25 questions × 0.5 marks each results in `totalMarks = 25` saved correctly, not a mismatched manually-typed value.
- No other exam field or page is changed.
