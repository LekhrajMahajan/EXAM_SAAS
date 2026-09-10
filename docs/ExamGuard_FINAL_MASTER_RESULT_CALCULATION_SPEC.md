# ExamGuard Pro — FINAL, SINGLE SOURCE Result Calculation Specification
## Backend + Frontend + Exam Creation Configuration

This is the implementation specification for the current ExamGuard Pro codebase.

The current Result problem is NOT a simple UI-number problem. The current backend log:

```text
[EVAL AGGREGATE] CorrectScore: 0
[EVAL AGGREGATE] NegativeScore: 0
[EVAL AGGREGATE] FinalScore: 0
[EVAL AGGREGATE] MaxMarks: 300
%: 0
```

is consistent with a missing subject-configuration mapping: the engine is calculating the maximum from the exam fallback (`300`) while the configured subject map can be empty because the exam's subject rows do not reliably contain `subjectId`.

The fix must make the exam configuration, submitted answers, backend evaluation, MongoDB Result, and frontend display use ONE consistent source of truth.

---

# 1. CURRENT EXAM CONFIGURATION — AUTHORITATIVE BUSINESS RULE

For the current test exam:

```text
Subjects = 4

Reasoning
25 questions
Marks/Q = 3
Negative/Q = 1.5
Sectional cutoff = 32

English Language
25 questions
Marks/Q = 3
Negative/Q = 1.5
Sectional cutoff = 36

Quantitative Aptitude
25 questions
Marks/Q = 3
Negative/Q = 1.5
Sectional cutoff = 40

General Awareness
25 questions
Marks/Q = 3
Negative/Q = 1.5
Sectional cutoff = 44
```

Therefore:

```text
Total questions = 4 × 25 = 100

Maximum marks =
25×3 + 25×3 + 25×3 + 25×3
= 300
```

Overall:

```text
cutoffType = MARKS
passingMarks = 126
```

Category:

```text
GENERAL = 40%
OBC = 35%
SC = 30%
EWS = 30%
```

Sectional cutoff:

```text
ON
```

Group/Part cutoff:

```text
OFF
```

Shuffle:

```text
Shuffle Subjects = ON
Shuffle Questions = ON
```

---

# 2. CRITICAL ROOT CAUSE IN CURRENT CODE

## File

```text
backend/src/modules/result/result.service.ts
```

## `authoritativeEvaluate()`

Current lines approximately:

```text
188–438
```

The function creates:

```ts
const examSubjectConfigMap = new Map<string, any>();
```

and only adds a subject when:

```ts
if (!s.subjectId) continue;
```

Current:

```ts
for (const s of (exam.subjects || [])) {
    if (!s.subjectId) continue;
    ...
    examSubjectConfigMap.set(String(s.subjectId), ...)
}
```

### Why this is critical

Frontend currently creates subject rows using only:

```text
name
questions
marksPerQuestion
negativeMarksPerQuestion
sectionalCutoff
timeAllottedMinutes
```

It does NOT currently send:

```text
subjectId
```

in the exam-create payload.

Therefore the saved Exam can contain subject rows without `subjectId`.

Then `authoritativeEvaluate()` skips those rows.

That produces:

```text
subject map = empty/incomplete
subject scores = 0
correctScore = 0
negativeScore = 0
```

while:

```text
totalMaximumMarks
```

can still fall back to:

```text
exam.totalMarks = 300
```

This exactly matches the current server log:

```text
CorrectScore: 0
NegativeScore: 0
FinalScore: 0
MaxMarks: 300
```

## REQUIRED ROOT FIX

DO NOT patch the final score.

Make Exam subject configuration contain a valid `subjectId` for every subject row.

---

# 3. FRONTEND BUG — Exam subject row does not store `subjectId`

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current subject schema

Approximately:

```text
55–73
```

Currently:

```ts
{
  name,
  questions,
  marksPerQuestion,
  negativeMarksPerQuestion,
  sectionalCutoff,
  timeAllottedMinutes
}
```

### REQUIRED

Add a required `subjectId`:

```ts
subjectId: z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, "Invalid subject")
```

The user should SELECT an existing Subject record from the Subject master data.

Do NOT rely on a free-text subject name as the primary identity.

Recommended row:

```text
Subject
Questions
Marks/Q
Negative/Q
Cutoff (if enabled)
Time (if enabled)
```

The visible subject name should come from the selected Subject master record.

---

# 4. FRONTEND BUG — Subject UI is free-text instead of subject selection

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current lines

Approximately:

```text
1070–1085
```

Current:

```tsx
<Input placeholder='Enter Subject Name' {...field} />
```

### REQUIRED

Replace the free-text identity field with a Subject selector.

The selector must load active Subjects from:

```text
frontend/src/features/company/subject/api/subject.api.ts
```

or the existing Subject API/hook.

Store:

```text
subjectId
```

and display the selected subject's name.

The saved exam row must contain:

```ts
{
  subjectId,
  name,
  questions,
  marksPerQuestion,
  negativeMarksPerQuestion,
  sectionalCutoff,
  timeAllottedMinutes
}
```

`subjectId` is the identity.
`name` is the display/snapshot field.

---

# 5. FRONTEND BUG — Negative/Q field is missing from the subject table

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current header lines

Approximately:

```text
1059–1065
```

Current:

```tsx
Subject Name
Questions
Marks/Question
...
```

### REQUIRED

Add:

```tsx
<div className='w-40'>Negative/Q</div>
```

The row must visibly show:

```text
Subject Name | Questions | Marks/Q | Negative/Q | Cutoff | Time
```

---

# 6. FRONTEND — Add Negative/Q input

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current Marks/Q field

Approximately:

```text
1099–1110
```

Immediately after Marks/Q add:

```tsx
<FormField
  control={form.control}
  name={`subjects.${index}.negativeMarksPerQuestion`}
  render={({ field }) => (
    <FormItem className='w-40'>
      <FormControl>
        <Input
          type='number'
          placeholder='Negative/Q'
          min={0}
          step='any'
          {...field}
          value={field.value ?? 0}
        />
      </FormControl>
      <FormMessage />
    </FormItem>
  )}
/>
```

Configuration meaning:

```text
Marks/Q = 3
Negative/Q = 1.5
```

means:

```text
Correct = +3
Wrong = -1.5
Not Attempted = 0
```

Store negative configuration as positive magnitude `1.5`, not `-1.5`.

---

# 7. FRONTEND BUG — Edit mode does not load subjectId and Negative/Q

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current lines

Approximately:

```text
562–570
```

Current mapping omits `subjectId` and `negativeMarksPerQuestion`.

### REQUIRED

Use:

```ts
subjects: data.subjects.map((s: any) => ({
  subjectId: String(s.subjectId),
  name: s.name,
  questions: s.questions,
  marksPerQuestion: s.marksPerQuestion ?? 1,
  negativeMarksPerQuestion:
    s.negativeMarksPerQuestion ?? 0,
  sectionalCutoff: s.sectionalCutoff ?? '',
  timeAllottedMinutes: s.timeAllottedMinutes ?? '',
}))
```

Do not lose the subject identity when an exam is edited.

---

# 8. FRONTEND BUG — Create/Update payload does not send subjectId or Negative/Q

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

## Current lines

Approximately:

```text
724–736
```

Current subject payload omits:

```text
subjectId
negativeMarksPerQuestion
```

### REQUIRED

Send:

```ts
subjects: values.subjects?.map((s) => ({
  subjectId: s.subjectId,
  name: s.name,
  questions: Number(s.questions),
  marksPerQuestion: Number(s.marksPerQuestion),
  negativeMarksPerQuestion:
    Number(s.negativeMarksPerQuestion ?? 0),

  sectionalCutoff:
    values.sectionalCutoffEnabled &&
    s.sectionalCutoff !== null &&
    s.sectionalCutoff !== ''
      ? Number(s.sectionalCutoff)
      : null,

  timeAllottedMinutes:
    s.timeAllottedMinutes !== null &&
    s.timeAllottedMinutes !== ''
      ? Number(s.timeAllottedMinutes)
      : null,
}))
```

This is mandatory.

---

# 9. FRONTEND — Total Marks MUST be derived from subject configuration

## File

```text
frontend/src/features/exam-manager/pages/CreateExamPage.tsx
```

Current lines:

```text
439–451
```

The current calculation:

```ts
q × marksPerQuestion
```

is correct.

Keep it, but make it the authoritative value shown to the user:

```ts
totalMarks =
  SUM(
    subject.questions × subject.marksPerQuestion
  )
```

Example:

```text
25×3 + 25×3 + 25×3 + 25×3
= 300
```

### IMPORTANT

`totalMarks` should preferably be READ-ONLY/displayed as:

```text
Total Marks = 300
```

rather than allowing a manually entered value that can disagree with subject rows.

Do not let:

```text
subjects → 300
totalMarks field → 250
```

co-exist.

Before create/update:

```text
computedTotalMarks === values.totalMarks
```

must be enforced, or simply overwrite the submitted `totalMarks` with the computed value.

---

# 10. OVERALL PASSING MARKS

Exam configuration:

```text
cutoffType = MARKS
passingMarks = 126
```

Therefore result logic is:

```text
finalScore >= 126
```

For percentage-based overall cutoff:

```text
cutoffType = PERCENTAGE
overallQualifyingPercent = X
```

then:

```text
percentage >= X
```

Do not mix these.

If no overall cutoff is configured:

```text
overallCutoffStatus = NOT_APPLICABLE
```

---

# 11. CATEGORY-WISE CUTOFF

Category cutoff field is explicitly percentage-based.

Exam creation:

```text
GENERAL = 40%
OBC = 35%
SC = 30%
EWS = 30%
```

For candidate category:

```text
General
```

normalize:

```text
GENERAL
```

Then:

```text
candidatePercentage >= 40
```

The category cutoff is NOT controlled by the global `cutoffType`.

If the exam has no matching category cutoff:

```text
categoryCutoffStatus = NOT_APPLICABLE
```

If configured:

```text
QUALIFIED / NOT_QUALIFIED
```

---

# 12. SECTIONAL CUTOFF

If:

```text
sectionalCutoffEnabled = true
```

every configured subject with a cutoff must be evaluated.

Subject score:

```text
subjectScore =
(correctCount × marksPerQuestion)
-
(wrongCount × negativeMarksPerQuestion)
```

Current:

```text
Reasoning = 32
English = 36
Quantitative Aptitude = 40
General Awareness = 44
```

Compare:

```text
Reasoning score >= 32
English score >= 36
Quant score >= 40
GA score >= 44
```

Every required subject must pass.

---

# 13. GROUP / PART-WISE CUTOFF

If:

```text
partWiseCutoffEnabled = true
```

each Part contains:

```text
partName
subjectIds[]
cutoffType
cutoffValue
```

Use subject IDs to select the already-calculated subject breakdown.

Correct:

```ts
part.subjectIds.some(
  (id) => String(id) === String(subject.subjectId)
)
```

NEVER compare a subject ID with:

```text
subjectName
```

Part score:

```text
SUM(subject.marksObtained)
```

Part maximum:

```text
SUM(subject.maxMarks)
```

For MARKS:

```text
partMarks >= cutoffValue
```

For PERCENTAGE:

```text
(partMarks / partMaxMarks) × 100 >= cutoffValue
```

Do not recalculate questions inside group validation.

---

# 14. ONE AUTHORITATIVE RAW SCORE ENGINE

## File

```text
backend/src/modules/result/result.service.ts
```

Current authoritative method:

```text
approximately lines 188–439
```

Keep ONE shared raw-score engine.

It must return:

```ts
{
  attemptedQuestions,
  correctAnswers,
  wrongAnswers,
  unansweredQuestions,

  totalMarks,
  marksObtained,
  negativeMarks,
  percentage,

  subjectWiseBreakdown,
  partWiseBreakdown,

  overallCutoffStatus,
  categoryCutoffStatus,
  sectionalCutoffStatus,
  groupCutoffStatus,

  passStatus,
  category,
  sectionalCutoffApplied,
  partWiseCutoffApplied,
  categoryWiseCutoff
}
```

`generateResults()` must call this engine.

Do not duplicate scoring in another path.

---

# 15. AUTHORITATIVE QUESTION SCORE

For each submitted answer:

```text
answer.questionId
        ↓
Master Question
        ↓
question.subjectId
        ↓
Exam.subjects[].subjectId
        ↓
marksPerQuestion
negativeMarksPerQuestion
```

Then:

```text
Correct:
+marksPerQuestion

Wrong:
-negativeMarksPerQuestion

Not Attempted:
0
```

The negative penalty must be deducted exactly once.

---

# 16. NO FALLBACK TO `1 MARK`

## File

```text
backend/src/modules/result/result.service.ts
```

In `authoritativeEvaluate()` approximately lines:

```text
207–210
```

Current:

```ts
const marksPerQ = ... ? Number(...) : 1;
```

### REQUIRED

Do NOT silently default a missing score configuration to `1`.

Missing configuration must be treated as invalid:

```text
Subject configuration missing
```

and evaluation must fail clearly.

A wrong default is more dangerous than an explicit error.

For negative marks:

```text
0 is a VALID negative-marking configuration.
```

Do not treat zero as missing.

---

# 17. QUESTION-TO-SUBJECT MAPPING MUST BE STRICT

At:

```text
authoritativeEvaluate()
```

current lines approximately:

```text
253–267
```

This mapping is correct in principle:

```text
Question.subjectId
→ examSubjectConfigMap
```

Keep it.

If the map has no entry:

```ts
throw new Error(
  `Question subject configuration not found...`
)
```

Do not continue with zero scoring.

This ensures the exam can never silently generate:

```text
0 / 300
```

because a subject configuration was not mapped.

---

# 18. CANDIDATE ANSWER SOURCE

The result engine must select ONE authoritative submission source.

For CandidateExamAnswer flow:

```text
CandidateExamAnswer.results
```

should be the preferred source because it contains the submission snapshot.

If using `CandidateAnswer` for a standard submission, use it consistently for that submission.

Never calculate:

```text
score from CandidateAnswer
```

and:

```text
question analysis from CandidateExamAnswer
```

for the same Result.

---

# 19. CANDIDATEEXAMANSWER QUESTION ID

## File

```text
backend/src/modules/candidate-exam/candidateExam.service.ts
```

Current submit/auto-submit mapping is already using:

```text
masterQ._id
```

as:

```text
questionId
```

and retaining:

```text
paperQuestionId
```

This is correct.

Keep:

```text
questionId = Master Question ID
paperQuestionId = PaperQuestion ID
```

The result engine uses:

```text
questionId
```

for scoring.

---

# 20. IMPORTANT — `evaluate()` OLD PATH MUST BE CONVERTED

## File

```text
backend/src/modules/result/result.service.ts
```

Current method:

```text
evaluate()
```

approximately:

```text
441–636
```

It separately loops PaperQuestions and currently uses `evaluateAnswer()`.

It also has an old negative-score clamp.

### REQUIRED

Do not maintain an independent scoring algorithm.

Refactor:

```text
evaluate()
```

to call the same authoritative evaluation engine used by:

```text
generateResults()
```

If `evaluate(resultId)` is retained for re-evaluation, it must load the submission's normalized answers and invoke the shared engine.

There must be ONE score implementation.

---

# 21. OLD `evaluate()` NEGATIVE CLAMP MUST NEVER RUN

Current `evaluate()` contains approximately:

```text
577–584
```

with:

```ts
obtainedMarks = obtainedMarks - negativeMarks;

if (obtainedMarks < 0) {
  obtainedMarks = 0;
}
```

The clamp must be removed.

Negative scores are valid.

---

# 22. OLD `evaluateAnswer()` MUST NOT USE PAPERQUESTION SCORING AS AUTHORITY

Current approximately:

```text
644–713
```

contains:

```ts
marks: correct ? paperQuestion.marks : 0
negativeMarks: correct ? 0 : paperQuestion.negativeMarks
```

This is another source of truth.

The authoritative score must use:

```text
Exam.subjects[].marksPerQuestion
Exam.subjects[].negativeMarksPerQuestion
```

The PaperQuestion values may exist as snapshots, but they cannot override the exam's configured marking scheme.

---

# 23. `getDetails()` MUST BE DISPLAY-ONLY

## File

```text
backend/src/modules/result/result.service.ts
```

approximately:

```text
1550+
```

The API can return question-level display data:

```text
isCorrect
marks
negativeMarks
```

but the summary must come from the saved Result:

```text
marksObtained
totalMarks
percentage
correctAnswers
wrongAnswers
unansweredQuestions
negativeMarks
```

Do not create another total score in `getDetails()`.

---

# 24. RESULT QUESTION DISPLAY MUST USE ACTUAL EXAM CONFIG

Current `getDetails()` has fallback logic like:

```ts
res.marks || question?.marks || 1
```

and:

```ts
res.negativeMarks || question?.negativeMarks || 0
```

This can create:

```text
+1
-0
```

even when the exam is configured as:

```text
+3
-1.5
```

### REQUIRED

For each question:

```text
question.subjectId
→ exam subject configuration
→ marksPerQuestion
→ negativeMarksPerQuestion
```

Then return:

```text
Correct:
marks = configured marks
negativeMarks = 0

Wrong:
marks = 0
negativeMarks = configured negative

Not Attempted:
marks = 0
negativeMarks = 0
```

---

# 25. FRONTEND RESULT QUESTION DISPLAY

## File

```text
frontend/src/features/company/result/components/ResultAnswersView.tsx
```

Current lines approximately:

```text
45–48
```

The display expression is conceptually correct:

```tsx
answer.isCorrect
  ? `+${answer.marks}`
  : answer.isAnswered
    ? `-${answer.negativeMarks}`
    : '0'
```

Do NOT replace this with hardcoded values.

The backend must send:

```text
Correct → marks = 3
Wrong → negativeMarks = 1.5
Not Attempted → 0
```

Then the frontend naturally displays:

```text
+3
-1.5
0
```

For another exam:

```text
+2
-0.5
0
```

without changing React code.

---

# 26. FRONTEND RESULT SUMMARY

## File

```text
frontend/src/features/company/result/pages/ResultDetailsPage.tsx
```

The summary can continue to display:

```text
result.marks.obtainedMarks
result.marks.totalMarks
result.marks.percentage
```

The frontend must not independently calculate:

```text
correct × marks - wrong × negative
```

Backend is authoritative.

---

# 27. EXACT CURRENT DATABASE TEST

Stored earlier:

```text
correctAnswers = 24
wrongAnswers = 68
unansweredQuestions = 8
attemptedQuestions = 92

totalMarks = 300
negativeMarks = 102
marksObtained = -78
percentage = -26
```

The counts satisfy:

```text
24 + 68 + 8 = 100
24 + 68 = 92
```

Negative marks:

```text
68 × 1.5 = 102
```

Correct marks:

```text
24 × 3 = 72
```

Final:

```text
72 - 102 = -30
```

Percentage:

```text
-30 / 300 × 100 = -10%
```

Expected:

```text
correctAnswers = 24
wrongAnswers = 68
unansweredQuestions = 8
attemptedQuestions = 92

totalMarks = 300
negativeMarks = 102
marksObtained = -30
percentage = -10
passingMarks = 126
```

---

# 28. ZERO/300 TEST FROM CURRENT LOG

The latest server log shows:

```text
CorrectScore: 0
NegativeScore: 0
FinalScore: 0
MaxMarks: 300
```

This is NOT a valid result when the candidate submitted answers.

It strongly indicates that the subject/question configuration mapping failed.

After fixing the subjectId identity mapping, the same candidate must no longer silently become:

```text
0 / 300
```

If there is a genuine all-unanswered candidate, then and only then:

```text
correct = 0
wrong = 0
unanswered = totalQuestions
score = 0
```

---

# 29. DATABASE RESULT INVARIANTS — MUST BE ENFORCED BEFORE SAVE

Before saving Result, validate:

```text
correctAnswers
+ wrongAnswers
+ unansweredQuestions
===
totalQuestions
```

and:

```text
attemptedQuestions
===
correctAnswers + wrongAnswers
```

and:

```text
negativeMarks
===
SUM(wrong question penalties)
```

and:

```text
marksObtained
===
correctScore - negativeMarks
```

and:

```text
totalMarks
===
SUM(subject.questions × subject.marksPerQuestion)
```

and:

```text
percentage
===
(marksObtained / totalMarks) × 100
```

If any invariant fails:

```text
DO NOT SAVE RESULT
```

Log the mismatch with:

```text
candidateId
examId
questionId
subjectId
correctScore
negativeScore
finalScore
maxMarks
percentage
```

---

# 30. EXAM CREATION — WHAT THE ADMIN FILLS

For each subject:

```text
Subject
→ select existing Subject

Questions
→ number of questions assigned to that subject

Marks/Q
→ marks for ONE correct answer

Negative/Q
→ penalty for ONE wrong answer

Sectional Cutoff
→ minimum marks required in that subject
   only when Sectional Cutoff is ON

Time
→ subject time only when Sectional Time Limit is ON
```

Example:

```text
Reasoning
Questions: 25
Marks/Q: 3
Negative/Q: 1.5
Cutoff: 32
```

Means:

```text
1 correct = +3
1 wrong = -1.5
1 unanswered = 0
subject maximum = 25×3 = 75
subject cutoff = 32
```

---

# 31. EXAM TOTAL MARKS

Admin does NOT need to manually calculate:

```text
300
```

System should calculate:

```text
SUM(subject questions × marks/Q)
```

Example:

```text
Reasoning 25×3 = 75
English 25×3 = 75
Quant 25×3 = 75
GA 25×3 = 75

Total = 300
```

Display the computed total.

---

# 32. OVERALL PASSING MARKS

When:

```text
cutoffType = MARKS
```

Admin enters:

```text
Passing Marks = 126
```

Result uses:

```text
marksObtained >= 126
```

When:

```text
cutoffType = PERCENTAGE
```

Admin enters:

```text
Overall Qualifying % = X
```

Result uses:

```text
percentage >= X
```

---

# 33. CATEGORY-WISE CUTOFF

Admin enters percentage values:

```text
GENERAL = 40%
OBC = 35%
SC = 30%
EWS = 30%
```

For a General candidate:

```text
candidatePercentage >= 40%
```

This criterion is independent of global `cutoffType`.

---

# 34. SECTIONAL CUTOFF

If enabled, admin enters subject-level minimum marks.

Current:

```text
Reasoning = 32
English = 36
Quantitative Aptitude = 40
General Awareness = 44
```

These are MARKS, not percentages, for the current configuration.

The result compares:

```text
subject marks obtained >= subject sectional cutoff
```

---

# 35. GROUP-WISE CUTOFF

If enabled, admin first groups existing selected Subject IDs into a Part.

Example:

```text
Part A:
Reasoning + English

Part B:
Quantitative Aptitude + General Awareness
```

Then selects:

```text
Cutoff Type:
MARKS or PERCENTAGE
```

and enters:

```text
Cutoff Value
```

For current subjects at 3 marks/Q:

```text
2 subjects × 25 questions × 3 marks
= 150 maximum marks per 2-subject part
```

If the desired group threshold is 40%, then:

```text
40% of 150 = 60
```

So a MARKS cutoff of:

```text
60
```

represents that 40% threshold.

---

# 36. FINAL PASS/FAIL

Run all configured criteria.

Statuses:

```text
overallCutoffStatus
categoryCutoffStatus
sectionalCutoffStatus
groupCutoffStatus
```

Use:

```text
NOT_APPLICABLE
```

only when the criterion is genuinely disabled or not configured.

Final:

```text
ALL applicable criteria QUALIFIED
→ PASSED

ANY applicable criterion NOT_QUALIFIED
→ FAILED
```

Do not stop early if the UI needs a detailed breakdown.

---

# 37. CRITICAL IMPLEMENTATION SEQUENCE

The result generation sequence must be:

```text
Exam Configuration
        ↓
Validate every subject has subjectId
        ↓
Build Subject Configuration Map
        ↓
Load submitted answers
        ↓
Resolve Master Question by questionId
        ↓
Resolve question.subjectId
        ↓
Resolve exam subject config
        ↓
Get marks/Q
Get negative/Q
        ↓
Evaluate answer
        ↓
Question score
        ↓
Subject aggregation
        ↓
Total aggregation
        ↓
Maximum marks
        ↓
Percentage
        ↓
Overall cutoff
        ↓
Category cutoff
        ↓
Sectional cutoff
        ↓
Group cutoff
        ↓
Final PASS/FAIL
        ↓
Validate Result invariants
        ↓
Save ONE Result document
        ↓
Frontend displays saved Result
```

---

# 38. DO NOT USE THESE AS SCORING FALLBACKS

Never silently use:

```text
1 mark
0 negative
100 total marks
200 total marks
300 total marks
35 passing marks
40 passing percentage
```

Those may only be valid when explicitly configured.

The saved Exam Configuration is the authority.

---

# 39. DO NOT CLAMP

Never:

```ts
Math.max(0, score)
```

for final score.

A negative result is valid.

Example:

```text
1 correct
10 wrong
3 marks
1.5 negative

3 - 15 = -12
```

Store:

```text
-12
```

---

# 40. TEST MATRIX

After implementation, run these:

### Test A — current database case

```text
24 correct
68 wrong
8 unanswered
+3 / -1.5
```

Expected:

```text
-30 / 300
-10%
```

### Test B — previous PDF case

```text
32 correct
54 wrong
14 unanswered
+3 / -1.5
```

Expected:

```text
15 / 300
5%
```

### Test C — all unanswered

```text
0 correct
0 wrong
100 unanswered
```

Expected:

```text
0 / 300
0%
```

### Test D — all wrong

```text
0 correct
100 wrong
0 unanswered
```

Expected:

```text
-150 / 300
-50%
```

### Test E — all correct

```text
100 correct
0 wrong
0 unanswered
```

Expected:

```text
300 / 300
100%
```

### Test F — different subjects

```text
Reasoning = +3 / -1.5
English = +2 / -0.5
Quant = +1 / 0
GA = +4 / -2
```

Verify question-level calculation uses the matching subject configuration.

### Test G — shuffle

Enable:

```text
Shuffle Subjects = ON
Shuffle Questions = ON
```

The score must remain identical to the equivalent non-shuffled answer set.

---

# 41. FINAL CODE-CHANGE CHECKLIST

## Backend

### `backend/src/modules/exam/exam.model.ts`

Current subject schema approximately:

```text
290–299
```

Keep:

```text
subjectId
questions
marksPerQuestion
negativeMarksPerQuestion
sectionalCutoff
timeAllottedMinutes
```

Make `subjectId` required for an exam subject row if the data model permits this migration.

### `backend/src/modules/exam/exam.validation.ts`

Add validation:

```text
every subject row must have subjectId
```

and verify:

```text
subjectId belongs to company
```

Reject duplicate subject IDs inside the exam.

### `backend/src/modules/exam/exam.service.ts`

On create/update:

```text
validate/normalize subjects
```

Do not accept subject name as the only identity.

### `backend/src/modules/result/result.service.ts`

Main work:

```text
188–438
```

authoritative engine.

Remove/retire duplicate scoring logic:

```text
441–636
```

old `evaluate()` path.

Refactor:

```text
644–713
```

old `evaluateAnswer()` so it cannot override exam configuration.

Ensure:

```text
getDetails()
```

does not calculate a conflicting summary.

### `backend/src/modules/result/result.model.ts`

Current fields:

```text
marksObtained
negativeMarks
percentage
```

must allow negative values.

Do not add a minimum of zero to score/percentage.

---

## Frontend

### `frontend/src/features/exam-manager/pages/CreateExamPage.tsx`

Required changes:

```text
55–73
```

subject schema → add required `subjectId`.

```text
562–570
```

edit mapping → preserve `subjectId` and `negativeMarksPerQuestion`.

```text
724–736
```

payload → send `subjectId` and `negativeMarksPerQuestion`.

```text
1059–1065
```

header → add `Negative/Q`.

```text
1070–1085
```

replace free-text Subject Name identity with Subject selector.

```text
1099–1110
```

Marks/Q → keep.

Immediately after → add Negative/Q.

```text
439–451
```

keep computed total marks, make it the authoritative total.

### `frontend/src/features/company/result/components/ResultAnswersView.tsx`

Approximately:

```text
45–48
```

keep dynamic display, but ensure backend returns the actual configured values.

### `frontend/src/features/company/result/pages/ResultDetailsPage.tsx`

Display backend Result values only.

No independent score formula.

---

# 42. FINAL ACCEPTANCE REQUIREMENT

The implementation is COMPLETE only when all of these are true:

```text
[ ] Every exam subject has a valid subjectId.
[ ] Create Exam UI selects a real Subject.
[ ] Negative/Q is visible in Create Exam.
[ ] Negative/Q is submitted to backend.
[ ] Negative/Q survives edit mode.
[ ] Total marks are derived from subject questions × marks/Q.
[ ] Passing marks are used only for MARKS overall cutoff.
[ ] Overall percentage cutoff is used only for PERCENTAGE mode.
[ ] Category cutoff is percentage based.
[ ] Sectional cutoff is subject-score based.
[ ] Group cutoff is group-score based.
[ ] Subject IDs are used for grouping.
[ ] Shuffle never changes scoring.
[ ] No hardcoded score defaults.
[ ] No score clamping.
[ ] No double negative marking.
[ ] No duplicate question counting.
[ ] One authoritative raw-score engine.
[ ] generateResults() uses it.
[ ] evaluate() uses it.
[ ] getDetails() does not create a different total.
[ ] MongoDB Result invariants pass.
[ ] Question-level display shows +configuredMarks for correct.
[ ] Question-level display shows -configuredNegative for wrong.
[ ] Not attempted displays 0.
[ ] Current 24/68/8 test produces -30/300 and -10%.
[ ] Previous 32/54/14 test produces 15/300 and 5%.
[ ] Old -78 result is not recreated.
[ ] Old 0/300 result is not recreated unless the candidate truly has 0 correct and 0 wrong.
```

# 43. FINAL INSTRUCTION TO ANTIGRAVITY

Before modifying code:

1. Inspect the current database Exam document for `exam.subjects`.
2. Confirm whether each subject row has a valid `subjectId`.
3. Inspect one submitted `CandidateExamAnswer.results` record.
4. Confirm its `questionId` resolves to the Master Question.
5. Confirm Master Question has `subjectId`.
6. Confirm that `subjectId` exists in the Exam subject configuration.
7. Trace the exact request:
   `POST /api/v1/results/generate`
8. Trace the candidate answer all the way to the Result write.
9. Print one full question-level calculation:
   questionId → subjectId → marks/Q → negative/Q → status → score.
10. Only then modify the calculation code.

After implementation, regenerate the result with `forceRegenerate`.

Then verify BOTH:

```text
MongoDB Result document
```

and:

```text
Frontend Result Details
```

They must contain the same authoritative numbers.

For the current stored-answer case:

```text
24 correct
68 wrong
8 unanswered
3 marks/Q
1.5 negative/Q
```

the final result MUST be:

```text
-30 / 300
-10%
```

This number must be produced by the code from the submitted answers and saved Exam Configuration — never hardcoded.
