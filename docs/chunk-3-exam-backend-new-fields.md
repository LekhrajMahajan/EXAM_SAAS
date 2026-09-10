# CHUNK 3 of 8 — Add New Exam-Level Backend Fields (Cutoffs, Multi-Stage, Tie-Break Rules)

> Give this file to Antigravity alone, after Chunk 2 is done and verified. Do not attach other chunks. This chunk is backend-only — do not touch any frontend file in this chunk.

## Goal
Add new configuration fields to the Exam model so that qualifying cutoffs (overall and category-wise), sectional cutoff toggle, multi-stage exam linkage, rank type, and tie-break rule order can be stored per exam. These fields will be used by later chunks (result generation and merit list generation) — this chunk only adds the schema, types, and validation, nothing else.

## Files to Touch
- `backend/src/modules/exam/exam.model.ts`
- `backend/src/modules/exam/exam.types.ts`
- `backend/src/modules/exam/exam.validation.ts`

## Changes

### `exam.model.ts` — add these new top-level fields to `ExamSchema`
Add after the existing `negativeMarks` field:
```ts
cutoffType: {
  type: String,
  enum: ["MARKS", "PERCENTAGE"],
  default: "MARKS",
},

overallQualifyingPercent: {
  type: Number,
  default: null,
},

sectionalCutoffEnabled: {
  type: Boolean,
  default: false,
},

categoryWiseCutoff: [
  {
    category: { type: String, required: true },
    cutoffPercent: { type: Number, required: true },
  },
],

rankType: {
  type: String,
  enum: ["COMBINED", "CATEGORY_WISE"],
  default: "COMBINED",
},

tieBreakRules: [
  {
    order: { type: Number, required: true },
    ruleType: {
      type: String,
      enum: [
        "HIGHER_MARKS",
        "HIGHER_PERCENTAGE",
        "MORE_CORRECT",
        "LOWER_NEGATIVE",
        "OLDER_AGE",
        "YOUNGER_AGE",
        "APPLICATION_NUMBER",
      ],
      required: true,
    },
  },
],

isMultiStage: {
  type: Boolean,
  default: false,
},

stageType: {
  type: String,
  enum: ["QUALIFYING_ONLY", "SCORE_CARRIED_FORWARD"],
  default: "SCORE_CARRIED_FORWARD",
},

stageWeightagePercent: {
  type: Number,
  default: 100,
},

linkedNextExamId: {
  type: Schema.Types.ObjectId,
  ref: "Exam",
  default: null,
},

resultDeclarationDate: {
  type: Date,
  default: null,
},
```

### `exam.types.ts` — add the matching fields to the `IExam` interface
```ts
cutoffType?: "MARKS" | "PERCENTAGE";

overallQualifyingPercent?: number | null;

sectionalCutoffEnabled?: boolean;

categoryWiseCutoff?: { category: string; cutoffPercent: number }[];

rankType?: "COMBINED" | "CATEGORY_WISE";

tieBreakRules?: {
  order: number;
  ruleType:
    | "HIGHER_MARKS"
    | "HIGHER_PERCENTAGE"
    | "MORE_CORRECT"
    | "LOWER_NEGATIVE"
    | "OLDER_AGE"
    | "YOUNGER_AGE"
    | "APPLICATION_NUMBER";
}[];

isMultiStage?: boolean;

stageType?: "QUALIFYING_ONLY" | "SCORE_CARRIED_FORWARD";

stageWeightagePercent?: number;

linkedNextExamId?: Types.ObjectId | null;

resultDeclarationDate?: Date | null;
```

### `exam.validation.ts` — add validation for the new fields
Following the same style/library already used in this file (Zod, based on other modules seen in this codebase), add:
- `cutoffType`: enum `["MARKS", "PERCENTAGE"]`, optional, default `"MARKS"`
- `overallQualifyingPercent`: optional number, `0–100` when `cutoffType === "PERCENTAGE"`
- `sectionalCutoffEnabled`: optional boolean
- `categoryWiseCutoff`: optional array of `{ category: string, cutoffPercent: number (0-100) }`
- `rankType`: enum `["COMBINED", "CATEGORY_WISE"]`, optional
- `tieBreakRules`: optional array of `{ order: number, ruleType: enum(...) }`
- `isMultiStage`: optional boolean
- `stageType`: enum, optional
- `stageWeightagePercent`: optional number `0–100`
- `linkedNextExamId`: optional Mongo ObjectId string
- `resultDeclarationDate`: optional date string

## Acceptance Criteria (Definition of Done)
- Exam model, types, and validation compile without errors.
- Creating/updating an exam via API (e.g. Postman) with these new fields in the payload saves them correctly and they are returned on `GET /exams/:id`.
- Omitting these fields entirely still works (all are optional with sensible defaults) — existing exams and existing frontend form (unchanged in this chunk) continue to work exactly as before.
- No frontend file is touched in this chunk.
